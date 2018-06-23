---
layout: post
title: "A call to application developers - the cloud needs to go"
date: 2013-11-09 08:31
comments: true
category: startups
category: mvcode
---
As software proliferates, customers have more and more choices as to where they put their data.  Why would they choose your service?  As software developers, we think that this is mostly an issue of feature parity.  But there are other factors that go into the decision - business relationships, price, and most relevant to this article, trust.

## Trust as a Service
Multi-Tenant cloud services are problematic and insecure.  We need a new solution for cloud computing that allows more security and better resource management.  

There are many examples of single-tenant architectures, but they are usually reserved for use cases where compliance is required (ie., health care and finance).  

In these cases,  single tenancy is not always really enforced; There is often a separate database instance that is running for each customer, but the instances are on a shared server, and many other resources (application servers, search, network) are shared.  

On the flipside, many line-of-business or backoffice apps are single tenant applications, since they are by definition only run by one client.

The movement towards instances has been growing as IaaS has proliferated (AWS, Azure, etc), and tools like [docker](http://docker.io) and [bitnami](http://bitnami.com) make it easier to spin up isolated instances, but the developer software platform support is minimal or non-existent.

## The problems with cloud
There are many problems with cloud services:

 * Customer data is intermingled
 * You are paying for scale that you simply don't need
 * SaaS databases are a rich target for criminals, extortion and spying.
 * Data security is a secondary consideration, or not well enforced inside SaaS company

### Intermingled Data and Resources
As a SaaS customer, have you ever stopped to ask why your resources are intermingled with other customers?  The reason is simply that software companies are not equipped to isolate your data.  This would require complete rewrites of code, as well as an order of magnitude more ops support.  

In short, it's prohibitively expensive to isolate your data, given the software infrastructure currently available.

### Security issues abound
A common SaaS application stack looks like this:

 * Application Server (Rails, Django, etc)
 * Search Engine (Elastic Search / SOLR, etc)
 * Database (Postgres, MySql, etc)
 * A myriad of cloud solutions for logging, email, alerts, backups, analytics

Each of these components has an opportunity for security issues.  Many developers have access to your application server.  Your search engine or database may be hosted by a third party service.   The cloud solutions you are using proliferate customer data across hundreds or thousands of different environments.

Each one of these layers offers spying entities an opportunity to access your data.

### Wasteful Scale problems
Most SaaS applications are built on a relational SQL environment.  All customer data is stored in the same table, and separated by foreign keys.

This means that if another customer puts a high demand on a resource (typically a database instance) that also houses your data, access to your data may be impacted, and you may experience performance issues when using the SaaS application.

Developers spend huge amounts of time on this problem.  High Scalability has gone from a niche area of Computer Science to something that is asked as part of a junior software engineer interview.  

It's also incredibly hard to get right.

Scale should be a problem for infrastructure platforms, not applications platforms.  Trying to address scale in an application is fraught with problems and tremendously expensive.

If SaaS moved to a single instance architecture, we could push these scale problems down the stack to a few IaaS providers.  Your application simply has to be able to scale to one organization, not all the potential customers you might have.  This can change your development cycle significantly.

We could also provide meaningful SLAs to customers since we could isolate their resources and pass on the SLA offered by IaaS such as AWS. 

## Let's build a Single Instance Stack
Given how hard it is to isolate your data, it makes sense that so few SaaS providers offer it.  There are simply few resources, developers or stacks that can help support it.  The IT / devops requirements are too burdensome.

But, it's certainly possible!  After all, this is how IaaS providers work.  They can monitor and provision your application and guarantee a certain number of 9's of uptime.  Your SaaS should do the same, and your customers shouldn't have to hire a devops pro to run your cloud.

### It's not just about OSS
Much open source software works in this way.  Simply download the software and run it on your own infrastructure.  

Single Tenant software is not a new concept.  It's what everyone did before they went to cloud solutions.  

It's still a common model for certain kinds of enterprise software (ie, MSFT) and Open Source software.  

However, the problem is that it requires a deep level of IT expertise that is prohibitive.

## A Single Tenant Ruby on Rails?
We need an application stack for Isolated Environments.  We need a stack like Rails, that enables developers to easily build single tenant solutions.

Ie, instead of deploying your SaaS app to one Heroku or AWS instance, you deploy it to 5000.  

If you have worked on any SaaS application, just thinking about that is probably enough to give you a migraine.

What's missing?   Basically all backoffice support that allows you to manage thousands of customer environments.

This is an incredibly hard task - just thinking about running a database migration on thousands of instances of customer databases makes my head spin.

Think about all the components of your current SaaS app - and now try and figure out how to manage them across thousands of instances.  I suspect this would require some sort of management API that can deploy code, upgrades, and let you remotely manage data.

* Robust Security Model
* Managing Users-
* Pluggable Service Components 
* Supporting Deployments
* DevOps and Provisioning
* Migrations, Versioning and Upgrades

I suspect that some of these components are out there.  

Perhaps they just need to be assembled into a stack that is more manageable.  

Perhaps they don't exist.  

Do we need this stack?  Please share your thoughts in comments.