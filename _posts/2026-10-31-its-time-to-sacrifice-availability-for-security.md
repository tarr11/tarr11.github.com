---
layout: post
title: "It's time to sacrifice availability for security"
---

## October 2026 was a bad month

In October, at least nine AI developer platforms disclosed security incidents. Wiz lists them by disclosure date: Fireworks AI (Oct 6), Andromeda (Oct 9), Zeabur (Oct 14), Lightning AI (Oct 15), OpenCode (Oct 16 to 17), Railway (Oct 20), Warp (Oct 23), CommandCode (Oct 28) and Northflank (Oct 30). According to Wiz, every public report describes attackers hunting for stored environment variables, especially AI keys ([Wiz, summarized by Qovery](https://www.qovery.com/blog/northflank-security-incident-secrets-own-cloud)).

Zeabur published the most detailed report. On October 14, an attacker signed in with a cluster admin token Zeabur created in January 2024. The token had no expiry and sat in plaintext in a private config repo. About a day and a half later, the attacker had read 3,218,965 environment variable records and data for 321,810 accounts. Zeabur is shutting down on December 31 ([Zeabur](https://zeabur.com/blogs/october-2026-security-incident)).

PingCAP's attacker used stolen service account credentials from September 9 to October 7, 28 days, before PingCAP noticed ([PingCAP](https://www.pingcap.com/trust-hub/security/security-update-october-2026/)). Railway paused every deployment on its platform while it investigated ([Railway](https://blog.railway.com/p/security-disclosure-wednesday-october-21st)). Northflank told every customer to assume attackers had decrypted all their environment variables ([Northflank](https://status.northflank.com/cmvv0rn5a092f14rutwccodpp)).

![Timeline of notable security incidents in October 2026: Fireworks AI Oct 6, Andromeda Oct 9, Zeabur Oct 14, Lightning AI Oct 15, OpenCode Oct 16, PingCAP Oct 19, Railway Oct 20, Warp Oct 23, CommandCode Oct 28, Northflank Oct 30](/images/october-2026-incidents.svg)

At Fireworks, Zeabur, Lightning AI and PingCAP, the attacker didn't break in. They logged in with valid credentials. Zeabur's report says that because the attacker used valid credentials and Zeabur's own access paths, about 36 hours of activity triggered no alerts. A user reported the breach.

These systems are lopsided. They have sophisticated ways to keep running when something breaks. Few have a good way to stop when something looks wrong.

## We need to accept false positives

CrowdStrike's 2026 Global Threat Report puts the average time from initial access to lateral movement at 29 minutes. The fastest it saw was 27 seconds, and in one intrusion data started leaving four minutes after the attacker got in ([CrowdStrike](https://www.crowdstrike.com/en-us/press-releases/2026-crowdstrike-global-threat-report/)). Unit 42 reviewed more than 750 incidents and found that in the fastest cases, attackers went from initial access to stealing data in 72 minutes, four times faster than a year earlier ([Unit 42](https://www.paloaltonetworks.com/blog/2026/02/unit-42-global-ir-report/)). Zeabur's attacker pulled 3.2 million environment variable records out of its platform database in 37 minutes.

The human loop is someone getting paged, pulling up dashboards, escalating and getting approval to do something drastic. At Zeabur, about 36 hours passed between the attacker's first use of a stolen credential and the start of the investigation. Once the team started, it took about four hours to remove the attacker's foothold in the internal network. The attacker gets every minute of that loop for free.

So containment has to be automated. Automated systems will sometimes get it wrong and interrupt a legitimate customer. I think we should treat that as an engineering tradeoff, not an unacceptable failure.

We already accept this tradeoff in the physical world. Banks freeze your card when a charge looks odd (usually right when you're traveling and need it). Airports clear terminals over a suspicious bag. Schools lock down over a credible threat. Nobody loves these, but we accept some disruption to avoid something worse.

In 2014, an attacker got into Code Spaces' AWS control panel and, over about 12 hours, deleted most of its data, machine configurations and offsite backups. The company shut down ([Channel Futures](https://channelfutures.com/cloud/the-cautionary-tale-of-code-spaces)). A temporary interruption is annoying, but you recover from it. Once an attacker steals or destroys your data, it stays that way.

## We internalized availability, but not security

AWS commits to 99.99% monthly uptime for EC2 deployed across availability zones, and pays service credits when it misses ([AWS](https://aws.amazon.com/compute/sla/)). That's about four minutes of downtime a month. To hit numbers like that, engineers replicate, fail over, retry and recover. They assume disks die, servers crash, networks partition and regions go down, and they design around it.

Security usually stops at authentication, authorization and encryption. Once a request passes those checks, the system serves it. Zeabur's attacker read the platform database through an internal read-only account that could read everything. The database logged 29 connections and 8,903 operations, and every one passed the checks.

Unit 42 found that identity weaknesses played a material role in nearly 90% of its investigations: attackers logged in instead of breaking in. Security people have understood defense in depth for a long time, but it hasn't sunk into everyday application engineering the way fault tolerance has. We should assume credentials will be compromised, permissions will be misconfigured and attackers will get past the perimeter, the same way we assume a disk will fail.

Availability machinery can also work for the attacker. Zeabur's daily cluster backups stored every secret. During the incident, Zeabur rotated a compromised key at 15:40 UTC. The 16:00 backup captured the new key, and the attacker used it at 20:30. At Code Spaces, the offsite backups sat behind the same AWS account, so the attacker deleted those too. Backups, retries and replication can't tell a customer's work from an attacker's. They make sure both get done.

## Security teams can't solve this alone

The BSIMM study of software security programs found an average of one security specialist for every 73 developers ([BSIMM10](https://securityboulevard.com/2019/09/infographic-bsimm10-by-the-numbers/)). A team that size can't review every design, and finding a risk isn't the same as fixing it. Zeabur found root passwords stored in its server setup on September 3. Nobody fixed them before October, and Zeabur believes the attacker used them to sign in as root to 101 servers. A secrets migration that started on October 3 still hadn't merged when the attacker arrived.

When companies do pull the brake, it's coarse. Railway paused deployments for every customer, even though its first analysis suggested only a subset was affected. Zeabur signed out every user. Northflank's status page marked seven platform components in a major outage from 13:40 UTC until midnight ([Northflank](https://status.northflank.com/cmvv0rn5a092f14rutwccodpp)). It's an emergency brake for the whole train, with no way to slow down one car.

Now look at the gaps Zeabur listed: an admin interface open to the public internet, a key meant for one storage bucket that could read every bucket, internal services and customer workloads on the same cluster, and a deploy key still valid four months after its service shut down. Those are architecture decisions, not security tooling.

Security is part of a product engineer's job, the same way availability is. Nobody hands failover to a separate team and walks away. The engineers who build the system own how it fails, and they should own how it contains an attack too.

That doesn't mean everyone has to be an expert. Most teams already have staff engineers who specialize in performance, storage or consensus and help everyone else get those things right. Security can work the same way. A staff engineer who specializes in security sits in the architecture discussions from the start, helps define the threats and the tests, and raises the bar for the whole team.

Containment should be a core product capability, not something you hand off to a separate security team or a vendor.

## Vendors have the wrong incentives

AWS's EC2 agreement spells out availability to the hundredth of a percent. Below 99.99% uptime in a month, customers get 10% of that month's bill back. Below 99%, they get 30%. Below 95%, they get all of it ([AWS](https://aws.amazon.com/compute/sla/)). Engineering teams get measured on the same numbers.

Vendors sell security through certifications. The Fireworks page that disclosed its incident lists SOC 2 Type 2, ISO 27001, ISO 27701 and ISO 42001 ([Fireworks](https://fireworks.ai/security/bulletins/october-2026-security-incident)). Those matter, but none of them tells a customer what happens when an internal credential leaks. There's no standard number for how long containment takes, so customers can't compare two products on it.

Zeabur's report shows what that number could look like. The attacker first used a stolen key at 01:36 UTC on October 14. The investigation started at 13:56 UTC on October 15, after a user report. Zeabur removed the attacker's node from its internal network at 17:58 that day. That's a time to detect and a time to contain, with timestamps behind them.

Vendors don't like to describe their defenses because they don't want to hand attackers a map. That's a fair concern, but it shouldn't stop independent testing or published outcomes. Here's what I'd like to see reported:

- Time from first malicious action to detection
- Time from detection to containment
- How well containment works against simulated attacks
- The maximum blast radius of a compromised credential
- How often legitimate customers get interrupted (the false-positive rate)
- How long it takes to restore legitimate operations

Should security interruptions count against availability SLAs? I think vendors should report them openly, but separately from infrastructure failures. If a security pause counts against the uptime number, every vendor has a strong incentive to never pull the brake.

## What developers should do differently

If I were building a data platform today, this is what I'd want on the list.

**Design the security experience from the start.** Commits pushed while Railway's deployments were paused never deployed. Railway published follow-up posts telling customers to redeploy, reconnect GitHub, and recreate CLI and CI credentials ([Railway](https://blog.railway.com/p/security-disclosure-recommendation-recover-failing-deploys)). Containment isn't an error message. When the system pauses an export or locks a credential, the customer should know what happened, why, and what to do next. Design the notifications, the status in the console, the reauthorization flow and the path back to normal alongside the feature itself.

**Build security circuit breakers.** Zeabur's attacker read the secrets of every service on its shared cluster and ran commands in 865 customer database containers. Nothing stopped it. Zeabur is now adding alerts for bulk reads of secrets and databases, but an alert still waits for a person. Mass deletions, bulk exports, bulk secret reads and privilege changes should pause automatically when they look wrong. Detection has to lead to enforcement.

**Design for partial unavailability.** Railway stopped deployments for everyone, and Zeabur signed out everyone. You should be able to suspend one user, tenant, resource, API or class of operation without shutting down the whole service. That's the brake for one car instead of the whole train.

**Make operations interruptible.** Zeabur's attacker read some PostgreSQL databases table by table, up to 50,000 rows per table. Long-running exports, bulk reads and admin operations should support pause, cancel and reauthorize, so the system can stop one partway through.

**Add friction when behavior looks suspicious.** Wiz followed two stolen AWS Bedrock keys. One made about 1.7 million calls in 13 hours. The other only worked in one group of AWS regions, so thousands of its calls failed and regional quotas slowed the rest ([Wiz, summarized by Qovery](https://www.qovery.com/blog/northflank-security-incident-secrets-own-cloud)). Scoped keys, rate limits, reduced concurrency and extra authorization buy time even when they don't stop an attack.

**Make restrictions survive failover.** Zeabur's 16:00 backup captured a key rotated 20 minutes earlier, and the attacker used it that evening. Retries, background jobs, queues, replication, backups and failover shouldn't be able to route around a containment decision.

**Measure false positives.** Track how often legitimate operations get interrupted, how long the interruptions last and how fast customers recover. Without that number, nobody can make a case for a tighter threshold.

**Test containment, not just detection.** PingCAP's attacker had 28 days inside, and Zeabur's had 36 hours without an alert. Both used valid credentials. Simulate exactly that: compromised credentials, malicious bulk operations and privilege escalation. Then confirm the dangerous operations stop and nothing bypasses the restriction.

**Design for recovery.** Zeabur told customers on its compromised GCP servers to back up their data and rebuild the servers to remove any backdoors. Make temporary restrictions reversible, and make interrupted operations safe to resume.

## The tradeoffs are real

Railway's pause blocked deploys for every customer, including ones its own first analysis suggested weren't affected. That's a real cost, and automated containment adds more. Attackers could trip the mechanisms on purpose to cause a denial of service. False positives can disrupt critical workloads. Automated detection will make mistakes. And availability is itself a security property; a system nobody can use isn't secure in any way that matters.

The answer is graduated, fine-grained responses: slow it down first, then restrict, then stop, and only for the thing that looks wrong. The region-scoped Bedrock key in the Wiz case shows the first step working.

The distinction I keep coming back to is reversible versus irreversible. Railway's customers redeployed. Zeabur is shutting down, and so did Code Spaces. A delayed export or a temporary account suspension is something you can recover from. Once someone steals confidential data, you can't make it secret again.

## Security is part of reliability

One thing in Zeabur's report worked. After its August incident, Zeabur gave dedicated server customers a way to move their environment variables off the platform. Projects that moved them were outside the October database read. Zeabur built that containment in ahead of time, and it held.

We've spent decades building software that keeps running no matter what breaks underneath it. I'd like to see us put the same effort into software that can notice something dangerous and stop it.

That takes changes in architecture, engineering culture, who owns what, how vendors are measured and what customers expect. None of that is quick. But containment should be a normal part of a product engineer's job, and a measurable capability of the products we buy.

A system that stays up while an attacker walks off with its customers' data isn't a reliable system.

If you're working on this, or think I'm wrong, I'd love to hear from you.
