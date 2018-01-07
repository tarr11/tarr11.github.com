---
layout: post
title: Stripe Sigma Should be Free
published: true
tags:
  - stripe
---

[Stripe Sigma](https://stripe.com/us/sigma) is tool for analyzing your Stripe data, targeted at Finance Teams.

## Stripe's Dashboard
Stripe already provides a basic version of this tool via the Dashboard, and there are some third party providers who will provide more targeted metrics (eg, [BareMetrics](https://baremetrics.com/)  )

Stripe has made the decision to charge for this feature, and it is based on the number of transactions you need to query.  This is the [cost plus pricing model](https://en.wikipedia.org/wiki/Cost-plus_pricing) for services.  Basically, Stripe incurs costs in order to run Sigma (associated hosting and data fees, Redshift, etc) and then marks that up. 

## Enterprise Positioning
However, the pricing and positioning decision for Sigma seems to have been based on the idea that there are a small percentage of large users who are willing to pay for this feature.  These users probably do 8-9 figures of revenue in Stripe, and have a dedicated finance team.   They probably pay a substantial fee for Stripe, but an amount which would be fairly negligable in Stripe's overall P&L.

## How does Stripe make money?
Stripe makes money per transaction.  This means that if you run a transaction through Stripe, Stripe charges fees based on volume, location and other risk factors.   The amount varies based on customers.  But generally, more volume means more revenue.  

## SMB Market Ignored
However, most businesses using Stripe are small, and outsource many of their bookkeeping functions to 3rd parties.  So, for these groups, it is unlikely that there would be much adoption of Sigma.  This is unfortunate as the SMB market is large, and is how Stripe initially found its adoption, and likely continues to be an important funnel for finding new customers.

So, If you are running a business where all of your transactions are run through Stripe, Sigma can function as a useful data analytics tool.  However, it can be difficult for small businesses to adopt a feature with unbounded pricing. Most small businesses simply do not have the time or resources to invest in learning the SQL-like language and schema of Stripe.  

## Free Sigma?
Imagine Sigma was free.  Several things would happen.  Stripe could continue to combine the features of the incredibly useful and well designed Dashboard that is already available for free for all users.  Sigma could then be an extension of that (with filters, exports and other features fluidly embedded.  This might actually encourage customers to push more of their transactions into Stripe since it would be easier to query against than exporting to an accounting package, reporting tool, or spreadsheet.

## Differentiation
Much product and design work went into Sigma.  It is a complex product.  But, like most "premium" options, it is only visible to a small segment of customers who are willing to pay for it.   This would differentiate Stripe further for new customers who are looking to choose between Stripe and other competitors like [BrainTree](https://braintree.com) or [Recurly](https://recurly.com)   

## Sigma Costs
Finally, on the negative side, Stripe would have to eat the cost of Sigma for all of their users.  This could be a substantial cost.  However, this cost would mitigated by the fact that you would not need to incur any cost for Sigma until a user starts using it.  Since most users would have a fairly small footprint (eg, hundreds or thousands of transactions) it is reasonable to assume that this data could be imported in real time.   Stripe has already likely built most of this infrastructure already to support the rollout of Sigma, since it is available to all customers (not just large enterprise customers)

I hope that Stripe reconsiders and makes Sigma available for free to all customers.  With smart engineering, it would probably not cost as much as it seems, and it would likely generate a higher transaction volume over time.  It certainly would create happier customers.
