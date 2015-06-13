---
layout: post
title: "Installing New Relic on Elastic Beanstalk for Windows and IIS"
date: 2013-11-24 10:30
comments: true
categories: qna, elastic-beanstalk, new-relic
---
I recently had the experience of getting New Relic to install on an AWS Elastic Beanstalk environment using IIS and Windows.

There are some great tools that make this dead simple on Azure, but on Elastic Beanstalk, it's not quite as simple.   You can't just install using an MSI manually, since Elastic Beanstalk will auto-scale instances.

This means that you need to build it as part of the Elastic Beanstalk configuration.

*  Create a directory called ```.ebextensions``` under the root of your project
*  Create a file called ```newrelic.config``` in that directory.  This will be in YAML format (2 spaces per indent)
*  Make sure to add this file to your .csproj project and include it as content so it copies up with AWS.
*  Download the latest [.NET MSI from New Relic](https://docs.newrelic.com/docs/dotnet/new-relic-net-installation)
*  Upload this MSI to S3 and make it public (everyone should be able to download it)
*  Get your New Relic license key from your New Relic account 
*  In newrelic.config, copy this in:

```
files:
  "c:\\newrelic\\newrelic.msi":
    source: [Your S3 URL]

commands:
  install_newrelic:
    command: msiexec.exe /i c:\\newrelic\\newrelic.msi NR_LICENSE_KEY=[Your License Key] INSTALLLEVEL=1
```
*  This should copy down the MSI from your s3 bucket and install new relic with our license key to your instance
*  New Relic should start reporting your instances (called AMAZON-something)

