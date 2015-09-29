---
layout: post
title:  "Migration of IoT Analytics to the Trusted Analytics platform"
date:   2015-09-29 15:43:20
categories: enableiot tap
---

Hello! :) I wanted to share with your the current IoT Analytics team engagement.

While the team is in the process of open sourcing the [EnableIoT.com][enableiot] backend (finally!), we're also making adjustments to ensure the platform is single-click installable on the [Trusted Analytics Platform][tap]. 

This is a major improvement: apart from The Maker Movement, we had couple of installations for the industrial environments. All of those installations, at some point, required custom analytics, custom security policies, and a direct access to the data backend. What was needed in one environment was different from what was required in the other environments. It meant that we had to perform a lot of customizations in the deployment scripting, as well as manage a healthy validation process and automation to keep problems at bay. 

Now, those needs are going to be fulfilled by default - the [Trusted Analytics Platform][tap] will provide all the popular Big Data tooling, security and infrastructure in a structured manner. It means less support on our side (we no longer need DevOps support to look after the environments!) and a common deployment strategy, shared with other teams. 

![The end-user perspective on the IoT Analytics]({{ site.url }}/assets/enableiot.jpg)

How everything started?
=======================

Previous deployment automation and sustaining was based on AWS Cloud Formation and Chef. This is the classic approach, so let's skip longer description. I'll just say that we used auto scaling of the AWS A LOT. It worked fine, but required a regular support of a dedicated DevOps, familiar with the platform.

Then suddenly, the Trusted Analytics pitched us, and we decided to enable it as the base platform. Needless to say: customer asked as about the Open Stack support (to keep their proprietary data in their data centers). Trusted Analytics platform provided that, so it was an easy choice. Looking back, I have to say that the migration of the most of our components was painless. Let's go one-by-one.

Frontend – API & UI
===================

Our API service, written in node.js, worked out of the box. All we had to change is the configuration part, which was previously managed by Chef. 
Backend – analytics and data retrieval
Adjustment of the backend service (based on Java and Spring) was limited to the build system, which now outputs fat jar file with all dependencies. It is much better than having Chef to manage the class path, so I recommend this approach no matter the target platform.

Data storage in HBase
=====================

The part of the system that handles the actual sensory data is based on HBase, as provided by [Cloudera Hadoop Distribution][cdh]. There was no action required on our part, other than binding the HBase service to our apps. The real kicker is already in works - the Kerberos integration between user applications and the HDFS, in addition to the [HDFS encryption][enchdfs]. That will allow us to share the same Hadoop with other customers on a single cluster, without any security concerns.

Relational data storage 
=======================

The relational data used by API is persisted in the PostgreSQL database (provided via the TA Marketplace). The old PostgreSQL broker we're using is not capable of performing backups and providing any replication/HA support, so this is a step back from Amazon RDS service. The good news is that the proper PostgreSQL (and MySQL) solution is coming to the platform's marketplace in the next release.

Alerts, controls and the rule engine
=======================

The final part is the rule engine, which is based on Apache Spark. While the Spark job file (PySpark in our case) worked as-is, we had to develop an application that configured and scheduled the Spark job execution. 

Automatic deployments
=====================

As the team uses the CI system to automate builds/deployments/tests, we needed an easy way to deploy our system to the Trusted Analytics platform. We developed an installation wizard - a command-line application that takes parameters (in both interactive and non-interactive mode) and spins the system using the Trusted Analytics CLI tools. The wizard in its current form consists of around 500 lines of code. Trusted Analytics team agreed to implement a better way to deploy complex applications (with cycles in dependent services), based on the Trusted Analytics Console. We already have a proof of concept solution and we hope to make it available during the next sprints.

What’s missing and the future
=============================

We're missing few important features as of now (apart from the Open Sourcing of the backend - stay tuned). One is log aggregation. While the Trusted Analytics CLI tooling is OK, we are looking forward to a proper LogStash/ElasticSearch/Kibana integration. The original stack used both log aggregation and monitoring tooling (Nagios) in synergy. We used the LogStash API to scan for critical issues raised in log files and informed the team.

We'll also need to adjust the MQTT flow provided by the Trusted Analytics with the one that our agent use - it'll be a separate post on the details in the future.

Final words
===========

Wrapping up, thanks to the Trusted Analytics platform we no longer require administrative knowledge in the team to create and maintain our system, got Open Stack support for free, access to the hot analytics tools (like Arcadia Data) and a deployment strategy that is being standardized. 
If you have any questions specific to the IoT Analytics or the Trusted Analytics platform, please do not hesitate to contact us on our GitHub :)

_Rafal Rozestwinski_

[enableiot]:      http://enableiot.com/
[tap]:            http://trustedanalytics.github.io/
[cloudera]:       http://www.cloudera.com/
[enchdfs]:        http://www.cloudera.com/content/cloudera/en/documentation/core/latest/topics/cdh_sg_hdfs_encryption.html