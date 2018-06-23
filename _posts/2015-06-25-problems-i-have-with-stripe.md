---
layout: post
title: Problems I have with Stripe
published: true
category: tech
---
We use [Stripe](https://www.stripe.com) for billing at [MV Code Club](https://www.mvcodeclub.com).

Apparently if you want to build your own billing system, an army of angry Saas vendors [will come at you with pitchforks](https://www.google.com/search?q=should+i+build+a+billing+system&oq=should+i+build+a+billing+system&aqs=chrome..69i57.7336j0j7&sourceid=chrome&es_sm=93&ie=UTF-8) and tell you it's a bad idea.   I don't disagree, but I'm wondering whether their exists an application that doesn't end up writing as much work-around code to support the unique business constraints of each business.

We are a bit of an abnormal use case for Stripe - we are neither a SaaS or an e-commerce site.  Instead, we run a membership based program for kids (which feels mostly like a SaaS, with some small changes)

Problems that I have with stripe mostly revolve around constraints for Subscription billing.  

## No Support for Checks or ACH
Stripe doesn't support checks or ACH.  This means that if you are using Stripe Subscriptions, you must replicate the entirety of Stripe's business logic for subscriptions, just to support checks.  Specifically, here are a few that come to mind:

 * Recurring Billing and Retries
 * Coupons
 * Credits
 * Invoices
 * Refunds

In reality, what I believe most people do is just do invoicing for checks or ACH via Quickbooks or whatever accounting system they use.  This has the benefit of immediately integrating with your accounting system and providing A/R aging and collections reports.  However, there is no billing portal for Quickbooks, so essentially, you get an old style invoice via email or snail mail, and that's it.  We use [InDinero](http://www.indinero.com) which offers some invoicing functionality but doesn't really offer an API or integrate with our app.   What this also means in practice is that your A/R team must log in to your admin portal and input invoices into your software app to keep things synced.  

## No support for subscriptions without a credit card
Occasionally, because we are a "live" business, we have customers that come in and use our service without giving us a credit card up front. We want to subscribe them to our service (they've agreed) and then enter their credit card info later.  This is different then [a free trial with no credit card](http://stackoverflow.com/questions/19467287/stripe-how-to-handle-subscription-with-a-free-plan-and-no-credit-card-required) in that we want the billing date to start immediately. 

In this case, Stripe will throw an error that no valid card is on file.  The only solution is to have a "free plan" so that stripe will accept the charge.

## Manual overrides to subscription pricing is difficult
Stripe requires that plans be immutable so that plans don't get cancelled or changed for existing customers who may be "grandfathered" in.  There is no override available for an individual plan, where you can just change the price for a single subscription without changing the plan.  This means, in practice, that you have to add additional one-time fees each month or discount coupons to raise or lower the price.  These show up as line items on invoices and can be confusing to customers.  Alternatively, you end up with a proliferation of nearly identical plans in Stripe, except for price. 

I would prefer to be able to override an individual subscription.

## Surprise Charges when changing plans
Our customers change plans periodically, and there's no good way to know what's going to happen when you change.  I wish there was an API endpoint that gave you a summary of what would happen when you switch plans.  We've had several scenarios where customers were double-charged and then we had to refund them in this case.  In practice, what this means is that we have to reproduce Stripe's entire pro-rating and change plan logic in order to warn customers about what's going to happen.

## Pauses in middle of a plan
This is a pretty narrow case but it would be nice to have a pause function.  Because we handle kids and subscriptions, occasionally we need to pause a subscription for a period of time.  In practice, the way to do this with Stripe is by cancelling and restarting the plan.  There are lots of calculations on our side and in practice we have most of the business logic in our app, not in Stripe.

## Alternatives
I've looked at a few alternatives and they all seem to have a similar problem:

 * [Chargify](https://www.charigify.com) - Seems to support ACH / eChecks but I'd have to sign up for an Authorize.net account.  Not sure how this works for paper checks though.
 
 * [Recurly](https://www.recurly.com) - Similar to  Chargify as far as I can tell. They seem to offer manual invoicing which can "mark as paid" via check.  But I don't think this works for subscription billing so you end up with a manual process.
 
Some other alternatives I've seen but not evaluated:

 * [Zuora] (https://www.zuora.com)
 * [ChargeBee] (http://www.chargbee.com)
 * [BrainTree] (https://www.braintreepayments.com)
 
Finally, it looks like most larger accounting packages offer invoicing ([NetSuite](https://www.netsuite.com), [Quickbooks Online](http://quickbooks.intuit.com/online), [Xero](https://www.xero.com) )   But these feel like overkill for a small business but perhaps this is the inevitable path in the longer term.  Not sure.

## What's next
Despite the cries of all the vendors, we'll probably just end up ripping out the Stripe subscriptions and replacing them with our own custom subscription code in our Rails App.  If there are any other alternatives that can handle the problems that I've described here, please let me know!


 
