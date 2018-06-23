---
layout: post
title: Migrating a Rails application from Heroku to Kubernetes on GKE
published: true
category: coding
---
This is my info-dump on how I migrated a Rails website from Heroku to GKE.

The [MVCode website(s)](https://www.mvcode.com) have been running a Rails application on Heroku since we first started.  

Over time, this grew into something of an octopus.  The set of services included:

* 2 standard 2x dynos running Rails 5.1 with Puma ($50 x 2)
* a Worker dyno (1x) running delayed_job ($25)
* Postgres (heroku) ($50)
* ElasticSearch (hosted on AWS) ($50)
* Cloudfront CDN ($5)
* S3 Bucket for Paperclip / Files
* Circle CI ($50)
* Mailgun ($50)
* Papertrail ($19)
* Rollbar ($50)
* Pusher ($50)
* Firebase Cloud Messaging
* SSL Endpoints for www.mvcode.com, www.mvcodeclub.com, and www.mvcode.site ($20 x 3)
* A bunch of on Demand GCP instances running Minecraft servers ($100-$200)

So, this setup was costing over $400 / month.   This was for an app that generated maybe 1000 visitors a day at most.

Heroku was causing a series of small, but somewhat annoying problems that made me want to switch off.  

The traffic patterns for mvcodeclub peaked after school (from about 3-6PM PT) since that was when students were using our site.  Other than that, traffic was almost non-existent.

You couldn't (as of 2018) set up autoscaling on Heroku unless you used [performance dynos](https://blog.heroku.com/heroku-autoscaling) which are very expensive ($250 each as of 2018).

I also never bothered setting up a Redis server as I had hit my limit in terms of what I wanted to spend.  This would have helped as well as caching in Rails is fairly easy to setup and can have a big impact on performance.  Ruby is somewhat slow and a lot of CPU utilization is in computing views, so aggressive caching using Redis, Memcached, or another memory store can fix a lot of problems.

## Other Solutions
Over the years, I looked into a variety of other solutions, but never found the to be worth enough to switch:

* Elastic Beanstalk (Affordable, but slow-ish deploys didn't give a lot of value over heroku)
* Google App Engine (Didn't work that well with Rails at the time)
* Bare EC2 Instances (Too much work)
* Flynn / Dokku Hosted PaaS (Great ideas but incomplete and buggy)
* Postgres RDS (Only a partial solution)
* Amazon Fargate (Most of the way there, but didn't come out until after I started this project)

## Kubernetes - GKE + Cloud SQL + Google Container Registry
I ultimately decided to switch to GKE.  This would allow me to learn Kubernetes, and also save a little money, as I could stuff in quite a few different containers into a small cluster. That said, I believe another solution around Fargate + RDS would also have worked.

## Switching to GKE
There were more steps in switching to GKE than I thought.  Expect it to take a few weeks or months, and feel like it's not worthwhile.  If you have a small deployment on heroku, it's probably not really worth it to switch to Kubernetes, unless you are expecting a lot of growth or have a lot of microservices that are deployed independently.   You are better off using Fargate, or App Engine, or Elastic Beanstalk.

### Dockerizing Rails
Here's my docker images.   I created a base file so that builds would go quicker on GCR.  The final image is based on the base image.  All images are stored on GCR.

#### Base Image
```
# Base image:
FROM ruby:2.5.1
 
# Install dependencies
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev qt5-default libqt5webkit5-dev gstreamer1.0-plugins-base gstreamer1.0-tools gstreamer1.0-x curl

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs

RUN npm install -g yarn
 
# Set an environment variable where the Rails app is installed to inside of Docker image:
ENV RAILS_ROOT /var/www/app
RUN mkdir -p $RAILS_ROOT
 
# Set working directory, where the commands will be ran:
WORKDIR $RAILS_ROOT
 
# Gems:
COPY Gemfile Gemfile
COPY Gemfile.lock Gemfile.lock
RUN gem install bundler && bundle install --jobs 20 --retry 5 --without development test
```

#### Rails Image

```Dockerfile
# Base image:
FROM gcr.io/my-proj/my-proj-base:latest
 
ENV RAILS_ENV=production \
    RACK_ENV=production \
    NODE_ENV=production

COPY . .

RUN gem install bundler && bundle install --jobs 20 --retry 5 --without development test
RUN yarn
 
EXPOSE 5000
 
RUN bundle exec rails assets:precompile
```

This docker image was big.  I'm still not sure why, and I am still investigating ways to make it smaller.  Originally, my plan was to build my docker images on my local machine and push them to GCR.  However, since my dockerfiles were pushing 2GB (still not sure why), this created a substantial amount of time where I was waiting to push images.  This lead me to discover cloud builds in Google Cloud Registry (gcr)   

You can also setup repositories in Google Source Repositories.  GCR can then automatically read from those repositories.  This is a very similar setup to Heroku, where you could run `git push heroku master`.  Instead, you would setup a google remote via the `gcloud` command line too, which would enable `git push google master`.  Alternatively, GCR can trigger from other repositories like GitHub or bitbucket.

### Replacing CircleCI with Google Cloud Builds and cloudbuild.yaml
Google Container Repository offers a declarative YAML based docker based language called CloudBuild which lets you build and deploy docker images.

This took some time to figure out, it was a little tricky to figure out what files and variables were available in the environment.  

The key learning is that each job you run will require a docker image.  Heroku abstracts this away, so you don't have to have separate deploys for scheduled tasks, worker dynos and web dynos.  In Kubernetes, you need to make sure that your container images are up to date after each deploy.

In my case, there were 11 separate steps to replicate a CircleCI / Heroku continuous deployment.  

#### Step 1: Create a docker image with envsubst that lets you use SHA-based container images
In Kubernetes, you will want to tag your containers with the latest COMMIT_SHA which lets you identify your releases.  Unfortuntely doing this in straight Kubernetes is not trivial.  You will need to have a template YAML file where you can substitute your COMMIT SHA.

In my case, I chose to create a file named dbmigrate-$COMMIT_SHA.yaml which I can use to create a job.

In order to do this, I needed a slim Dockerfile that also included `envsubst` and would run a script that would output my file
```Dockerfile
FROM alpine
RUN apk update && apk upgrade && apk add --update gettext
ADD migrate.sh /
```

Here's the contents of migrate.sh
```bash
#!/bin/sh
envsubst < $1 > $2
cat $2
```

This is the template I used.
```YAML
apiVersion: batch/v1
kind: Job
metadata:
  labels:
    app: dbmigrate
  generateName: dbmigrate-
spec:
  backoffLimit: 1
  template:
    spec:
      restartPolicy: Never
      containers:
      - command:
        - rails
        - db:migrate
        env:
        - name: DB_HOST
          valueFrom:
            fieldRef:
              apiVersion: v1
              fieldPath: status.hostIP
        envFrom:
          - secretRef:
              name: mvcode-secrets
        image: gcr.io/myproj/myproj-rails:${SHA}
        imagePullPolicy: Always
        name: dbmigrate
        resources: {}

      schedulerName: default-scheduler

```

As you can see, the point of this job is simply to run `rails db:migrate`  but in order to do that, I need access to my environment variables (all stored in secrets) as well as the DB_HOST.  The reason I need DB_HOST is because I am using CloudSQL.  CloudSQL is Google's Managed Postgres Service, and [requires that you run a sidecar container that proxies all requests](https://cloud.google.com/sql/docs/postgres/connect-kubernetes-engine).   

The default documentation suggests that you run this as sidecar container in your pod, but I found that a little clumsy, so I chose to implement this as a Kubernetes Daemonset, which will automatically inject this .  Unfortunately, this meant that the proxy was not available on localhost.  So, I had to use the Kubernetes Downwards API to query the hostIP of the server, and pass that as an environment variable in the DB_HOST paramater.


#### Step 2: Run the dbmigrate command to create a dbmigrate job with the current COMMIT_SHA

```YAML
- name: 'gcr.io/myproject/dbmigrate'
  id: 'dbmigrate'
  args: ['/migrate.sh','kubernetes/dbmigrate.yaml', 'dbmigrate-$COMMIT_SHA.yaml']
  env:
    - 'SHA=$COMMIT_SHA'
  waitFor: ['-']
```

#### Step 3: Build the production rails image
```YAML
- name: 'gcr.io/cloud-builders/docker'
  args: ['build', '-t', 'gcr.io/my-proj/$REPO_NAME:$COMMIT_SHA', '.']
  id: 'build-prod'
  waitFor: ['-']
```


#### Step 4: Push the newly built rails iamge to GCR
```YAML
- name: 'gcr.io/cloud-builders/docker'
  args: ['push', 'gcr.io/my-proj/$REPO_NAME:$COMMIT_SHA']
  id: 'push-prod'
  waitFor: ['build-prod']
```

You'll notice that this is waiting for the `build-prod` step.  Cloudbuild allows parallel tasks, which can speed things up considerably.

#### Step 5: Run all tests 

```YAML
- name: 'docker/compose:1.15.0'
  args: ['run', 'web', './test.sh']
  id: 'rspec'
  waitFor: ['-']
```
In this case, we are using docker compose, which creates a local postgres database and then runs rspec

Here's the docker-compose file

```YAML
version: "3"
services:
  db:
    image: postgres
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
  web:
    image: gcr.io/myproj-rails/test:latest
    command: sleep infinity
    volumes:
      - .:/var/www/app
    depends_on:
      - db
    environment:
      - DB_HOST=db
    ports:
      - "5000:5000"
```

You'll notice it runs `sleep infinity` which ensures the web service doesn't prematurely end.

Here's the `test.sh` file which prepares and executes the tests:
```sh
#! /bin/bash
bundle install
yarn install
bundle exec rails db:create
bundle exec rails db:schema:load
bundle exec rspec
```

We run bundle install to ensure any gems in the gemfile that have been updated in the latest build get installed.  Similarly with yarn.


#### Step 6 - Run our dbmigrate command
```YAML
- name: 'gcr.io/cloud-builders/kubectl'
  id: 'run-migration'
  args:
  - 'create'
  - '-f'
  - 'dbmigrate-$COMMIT_SHA.yaml'
  env:
  - 'CLOUDSDK_COMPUTE_ZONE=us-west1-a'
  - 'CLOUDSDK_CONTAINER_CLUSTER=my-proj'
```

`$COMMIT_SHA` is available as an environment variable in CLoudBuild.


#### Step 7 - Update our kubernetes deployment with our newly built image
```YAML
- name: 'gcr.io/cloud-builders/kubectl'
  id: 'deploy'
  waitFor: ['run-migration']
  args:
  - 'set'
  - 'image'
  - 'deployment/my-proj'
  - 'myproj-rails=gcr.io/my-proj/$REPO_NAME:$COMMIT_SHA'
  env:
  - 'CLOUDSDK_COMPUTE_ZONE=us-west1-a'
  - 'CLOUDSDK_CONTAINER_CLUSTER=my-proj'
  ```

#### Step 8 - Update our delayed job deployment with the newly built image as well
```YAML
 - name: 'gcr.io/cloud-builders/kubectl' id: 'deploy-delayed-job' waitFor: ['run-migration']
   args:
  - 'set'
  - 'image'
  - 'deployment/myproj-rails-delayed-job'
  - 'myproj-rails-delayed-job=gcr.io/mvcodeclub-rails/$REPO_NAME:$COMMIT_SHA'
  env:
  - 'CLOUDSDK_COMPUTE_ZONE=us-west1-a'
  - 'CLOUDSDK_CONTAINER_CLUSTER=myproj-rails'
```

#### Step 9 - Update our CronJobs with the newly build iamge

You'll notice this is more involved than updating a deployment.  This is because as of Kubernetes 1.10, you can not simply call `kubectl set image` on a CronJob.  Instead, you'll have to use the more verbose `kubectl patch -f` command below

```YAML
- name: 'gcr.io/cloud-builders/kubectl'
  waitFor: ['deploy']
  id: 'deploy-dailytasks'
  args:
  - 'patch'
  - '-f'
  - 'kubernetes/dailytasks.yaml'
  - '--type=json'
  - '-p=[{"op":"replace", "path": "/spec/jobTemplate/spec/template/spec/containers/0/image", "value":"gcr.io/myproj-rails/$REPO_NAME:$COMMIT_SHA"}]'
  env:
  - 'CLOUDSDK_COMPUTE_ZONE=us-west1-a'
  - 'CLOUDSDK_CONTAINER_CLUSTER=myproj-rails'

- name: 'gcr.io/cloud-builders/kubectl'
  waitFor: ['deploy']
  id: 'deploy-invoicetasks'
  args:
  - 'patch'
  - '-f'
  - 'kubernetes/invoice.yaml'
  - '--type=json'
  - '-p=[{"op":"replace", "path": "/spec/jobTemplate/spec/template/spec/containers/0/image", "value":"gcr.io/myproj-rails/$REPO_NAME:$COMMIT_SHA"}]'
  env:
  - 'CLOUDSDK_COMPUTE_ZONE=us-west1-a'
  - 'CLOUDSDK_CONTAINER_CLUSTER=myproj-rails'
- name: 'gcr.io/cloud-builders/kubectl'
  waitFor: ['deploy']
  id: 'deploy-hourlytasks'
  args:
  - 'patch'
  - '-f'
  - 'kubernetes/hourlytasks.yaml'
  - '--type=json'
  - '-p=[{"op":"replace", "path": "/spec/jobTemplate/spec/template/spec/containers/0/image", "value":"gcr.io/myproj-rails/$REPO_NAME:$COMMIT_SHA"}]'
  env:
  - 'CLOUDSDK_COMPUTE_ZONE=us-west1-a'
  - 'CLOUDSDK_CONTAINER_CLUSTER=myproj-rails'
```

### Step 10 - Update rollbar
```YAML
- name: 'gcr.io/mvcodeclub-rails/ubuntu-curl'
  args: ['bash','./rollbar_deploy.sh']
  id: 'rollbar-deploy'
  env:
    - 'REVISION=$REVISION_ID'
```
We use rollbar  to manage our errors, and rollbar lets you notify it when a new deployment occurs.  This lets you tie back errors to particular errors in rollbar.

### Step 11 - Cloudbuild Configuration
```YAML
images: ['gcr.io/myproj-rails/$REPO_NAME:$COMMIT_SHA']
timeout: 1800s
options:
  machineType: 'N1_HIGHCPU_8'
```

Our build is fairly complex.  The images property lets you mark the image as being finished.  You may need to update the timeout value as we did, otherwise your entire build may fail.  Finally, we use one of the higher powered machineTypes available in GCR cloud builds.  This is quite helpful when you are running builds in parallel.

You can pretty much do the same things with GCR that you do with CircleCI.  The pricing structure is different however.  Both offer a free tier, which lets you run your builds and tests.  With CircleCI, you can add multiple workers which can then run your tests in parallel.  

The downside of this is that once your build succeeds (and it's associated tests), you then have to deploy to heroku, which then runs an almost identical build process.  In our case, this also involved a pretty substantial precompile step for both rails assets and webpack assets (as we have a React client side app as well)

You can also use CircleCI to build your docker images, but if you are using heroku, the common path is to build your app in a git post-commit hook.

### Creating your deployment
Be careful with setting your health checks.  They may cause flapping.  Here's what I did.

By default, heroku checks for health by pinging "/" on your website.  If this fails (after a certain amount of time) then you will receive a 503 error (service unavailable).  If you are using cloudfront on heroku, this can also cascade into some cached errors with your javascript or other precompiled assets, since these try to proxy from your website.

Kubernetes lets you define health checks (readiness checks and liveness checks).   Though these are optional, you will get warnings using a K8S ingress if you do not define them.

Many complex rails apps take a while to startup.  Our app, for example, may take upwards of 30 seconds.  If you do not set the appropriate timeouts, K8S will kill your pod before its ready, and do this continouously.  If you see your pod having lots of restarts and not staying up, this is the likely cause.

### Moving from Heroku Postgres to Google CloudSQL
The steps for doing this involved create a pgdump file, and then restoring that to CloudSQL.  Originally, my plan was to restore directly onto the CloudSQL VM but the versions I used created incompatible pgdump files.  Heroku and CloudSQL were both using Postgres 9.6 but the minor versions were different and I could not restore using the pg client.  So, I needed to create a temporary VM with the same version as Heroku.  Then, I ran a pgbackup from heroku, and curl'ed that backup to my new VM.  Restoring from that VM to CloudSQL worked successfully at that point.

### Replacing Papertrail with Stackdriver logging
I had been using Papertrail on Heroku.  This was fine, but I found that I didn't really use it that much, and I would generate large amounts of log files.  If you aren't careful you'll end up with gigabytes of files.    According [to the new StackDriver pricing](https://cloud.google.com/stackdriver/pricing_v2), your first 50GB are free.  That said, it's still really easy to generate a lot of log files in GKE using web applications if they aren't configured correctly, so be careful.

### Replacing Heroku config with K8S Secrets
You need to decide how you are setting up your secrets.  One gotcha is that changing a secret doesn't automatically restart your containers.  Restarting containers is also not particularly easy, and [has resulted in all sorts of bash scripts and hacks to make this work](https://github.com/kubernetes/kubernetes/issues/13488).  What I have done in this case is just delete the pod, and the deployment will recreate a new one.  This may cause problems with uptime though, and you may just want to force a new deployment.

### Moving from AWS ElasticSearch to a Kubernetes Pod
We had been using AWS elasticsearch which is a completely managed elasticsearch.  In our case, ES was used for a very small part of our application, and was a very small dataset. We were also using a deprecated version of elasticsearch (2.4.6), so we needed to have our own Docker. So, instead I just used a docker container.  It isn't sharded but does have a persistent volume.

Here's the Dockerfile:
```YAML
FROM openjdk:8-jre-alpine

# ensure elasticsearch user exists
RUN addgroup -S elasticsearch && adduser -S -G elasticsearch elasticsearch

# grab su-exec for easy step-down from root
# and bash for "bin/elasticsearch" among others
RUN apk add --no-cache 'su-exec>=0.2' bash

# https://artifacts.elastic.co/GPG-KEY-elasticsearch
ENV GPG_KEY 46095ACC8548582C1A2699A9D27D666CD88E42B4

WORKDIR /usr/share/elasticsearch
ENV PATH /usr/share/elasticsearch/bin:$PATH

ENV ELASTICSEARCH_VERSION 2.4.6
ENV ELASTICSEARCH_TARBALL="https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-2.4.6.tar.gz" \
	ELASTICSEARCH_TARBALL_ASC="https://download.elastic.co/elasticsearch/elasticsearch/elasticsearch-2.4.6.tar.gz.asc" \
	ELASTICSEARCH_TARBALL_SHA1="c3441bef89cd91206edf3cf3bd5c4b62550e60a9"

RUN set -ex; \
	\
	apk add --no-cache --virtual .fetch-deps \
		ca-certificates \
		gnupg \
		openssl \
		tar \
	; \
	\
	wget -O elasticsearch.tar.gz "$ELASTICSEARCH_TARBALL"; \
	\
	if [ "$ELASTICSEARCH_TARBALL_SHA1" ]; then \
		echo "$ELASTICSEARCH_TARBALL_SHA1 *elasticsearch.tar.gz" | sha1sum -c -; \
	fi; \
	\
	if [ "$ELASTICSEARCH_TARBALL_ASC" ]; then \
		wget -O elasticsearch.tar.gz.asc "$ELASTICSEARCH_TARBALL_ASC"; \
		export GNUPGHOME="$(mktemp -d)"; \
		gpg --keyserver ha.pool.sks-keyservers.net --recv-keys "$GPG_KEY"; \
		gpg --batch --verify elasticsearch.tar.gz.asc elasticsearch.tar.gz; \
		rm -rf "$GNUPGHOME" elasticsearch.tar.gz.asc; \
	fi; \
	\
	tar -xf elasticsearch.tar.gz --strip-components=1; \
	rm elasticsearch.tar.gz; \
	\
	apk del .fetch-deps; \
	\
	mkdir -p ./plugins; \
	for path in \
		./data \
		./logs \
		./config \
		./config/scripts \
	; do \
		mkdir -p "$path"; \
		chown -R elasticsearch:elasticsearch "$path"; \
	done; \
	\
# we shouldn't need much RAM to test --version (default is 2gb, which gets Jenkins in trouble sometimes)
	export ES_JAVA_OPTS='-Xms32m -Xmx32m'; \
	if [ "${ELASTICSEARCH_VERSION%%.*}" -gt 1 ]; then \
		elasticsearch --version; \
	else \
# elasticsearch 1.x doesn't support --version
# but in 5.x, "-v" is verbose (and "-V" is --version)
		elasticsearch -v; \
	fi

COPY config ./config

VOLUME /usr/share/elasticsearch/data

COPY docker-entrypoint.sh /

EXPOSE 9200 9300
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["elasticsearch"]
```

Here's the Kubernetes deployment:
```YAML
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "2"
  generation: 2
  labels:
    app: elasticsearch
    run: elasticsearch
  name: elasticsearch
  namespace: default
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      run: elasticsearch
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        run: elasticsearch
    spec:
      containers:
      - image: gcr.io/my-prj/elasticsearch:2.4.6
        imagePullPolicy: IfNotPresent
        name: elasticsearch
        resources: {}
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
        volumeMounts:
        - mountPath: /usr/share/elasticsearch/data
          name: es-pv-storage
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
      volumes:
      - name: es-pv-storage
        persistentVolumeClaim:
          claimName: es-pv-claim
```

Here's the Persistent Volume Claim to support ElasticSearch, that I made in Kubernetes:

```YAML
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  annotations:
    pv.kubernetes.io/bind-completed: "yes"
    pv.kubernetes.io/bound-by-controller: "yes"
    volume.beta.kubernetes.io/storage-provisioner: kubernetes.io/gce-pd
  finalizers:
  - kubernetes.io/pvc-protection
  name: es-pv-claim
  namespace: default
  resourceVersion: "9103414"
  selfLink: /api/v1/namespaces/default/persistentvolumeclaims/es-pv-claim
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 3Gi
  storageClassName: standard
```

Here's the Kubernetes Service I created for ElasticSearch:

```YAML
apiVersion: v1
kind: Service
metadata:
  labels:
    app: elasticsearch
    run: elasticsearch
  name: elasticsearch
  namespace: default
spec:
  ports:
  - port: 9200
    protocol: TCP
    targetPort: 9200
  selector:
    run: elasticsearch
  sessionAffinity: None
  type: ClusterIP

```


### Adding Redis as a Kubernetes Pod
This was pretty easy, I just included a Redis Deployment and a Redis Service, using the default Redis docker image.

```YAML
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations:
    deployment.kubernetes.io/revision: "2"
  generation: 3
  labels:
    app: redis
  name: redis
  namespace: default
spec:
  progressDeadlineSeconds: 600
  replicas: 1
  revisionHistoryLimit: 10
  selector:
    matchLabels:
      app: redis
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      creationTimestamp: null
      labels:
        app: redis
    spec:
      containers:
      - image: redis:latest
        imagePullPolicy: Always
        name: redis
        resources:
          limits:
            cpu: 500m
            memory: 1000Mi
          requests:
            cpu: 100m
            memory: 250Mi
        terminationMessagePath: /dev/termination-log
        terminationMessagePolicy: File
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30

```


Here's the service:

```YAML
apiVersion: v1
kind: Service
metadata:
  labels:
    app: redis
  name: redis
  namespace: default
spec:
  ports:
  - port: 6379
    protocol: TCP
    targetPort: 6379
  selector:
    app: redis
  sessionAffinity: None
  type: ClusterIP
```


### Replacing the Heroku Scheduler with Kubernetes CronJobs
The Heroku Scheduler is nice in that 
You need to remember to update your images

### Replacing Heroku TLS/SSL Endpoints with Google Cloud Load Balancer + Kubernetes Ingress Controller
Kubernetes GCP ingress controller doesn't do everything you need so you'll have to set some of it up yourself, unless you have a really simple case.  The GCP ingress simply manages an L7 Google Cloud Load Balancer for you.  But unfortunately, it's somewhat incomplete and doesn't manage all the features of the load balancer (such as CDN and multiple wildcard SSL certs) so you may end up managing your Load Balancer separately anyway.  The Google Cloud Load Balancer is nicer to integrate than Cloudfront, in that it's just a checkbox on the Load Balancer vs an entirely separate service.  However, this is not yet integrated into the Ingress service, so you'll have to do that manually.

However, it's nice to have since I can now add new services on subdomains and set them up completely via Kubernetes.  

### Adding a slack integration for deployments
If you want to get notified that your deployment succeeded, you need to use Google Cloud Functions.

I used [this tutorial](https://cloud.google.com/container-builder/docs/configure-third-party-notifications) as a starting point. 

T
```javascript
const IncomingWebhook = require('@slack/client').IncomingWebhook;
const SLACK_WEBHOOK_URL = ""

const webhook = new IncomingWebhook(SLACK_WEBHOOK_URL);

// subscribe is the main function called by Cloud Functions.
module.exports.subscribe = (event, callback) => {
 const build = eventToBuild(event.data.data);

// Skip if the current status is not in the status list.
// Add additional statues to list if you'd like:
// QUEUED, WORKING, SUCCESS, FAILURE,
// INTERNAL_ERROR, TIMEOUT, CANCELLED
  const status = ['QUEUED', 'SUCCESS', 'FAILURE', 'INTERNAL_ERROR', 'TIMEOUT'];
  if (status.indexOf(build.status) === -1) {
    return callback();
  }

  // Send message to Slack.
  const message = createSlackMessage(build);
  webhook.send(message, callback);
};

// eventToBuild transforms pubsub event message to a build object.
const eventToBuild = (data) => {
  return JSON.parse(new Buffer(data, 'base64').toString());
}

// createSlackMessage create a message from a build object.
const createSlackMessage = (build) => {
  let message = {
   text: 'Build ' + build.id,
    mrkdwn: true,
    attachments: [
      {
        title: 'Build logs',
        title_link: build.logUrl,
        fields: [{
          title: 'Status',
          value: build.status
        }]
      }
    ]
  };
  return message
}

```

### Getting mailgun to work on GCP
The standard mailgun port (587) is blocked on GCP so you'll have to switch to the alternative port (2525)  Otherwise that works fine  Otherwise that works fine.

### Setting up K8S Horizontal Pod Autoscaler + Node Scaler
The autoscaler settings are somewhat confusing.  I ended up occasionally scaling to 8 servers when I had no traffic.  

Similarly, if you use the GKE UI to setup new deployments, it defaults to 3 pods in your replica set, which can get expensive when you are just starting out.  You can change this to one in your YAML or autoscaler if you are testing or comfortable with short outages during deploys or failures.

### Replacing heroku run rails console
You need to either pick an instance (which can get killed) or spool up a temp one, which is slow.  Since running `rails console` is mostly a diagnostic issue for me, I used a command which simply looked for the first pod available and connects to that via `kubectl exec`:

```sh
kubectl exec -ti $(kubectl get pods --selector=app=mvcodeclub-rails -o jsonpath="{.items[0].metadata.name}") -- rails console
```
