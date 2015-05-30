# Problems I have with Stripe Recurring Billing

## No support for cash, checks, or ACH.

If you have to support payment types that they don't (cash, check, or ACH), you end up rewriting everything.  It's easier to have a recurring task to bill every day and dispatch to stripe, ach, etc.  Coupons, credits and invoices all need to be duplicated by payment method.

## Credits and coupons don't work with non-invoiced items.  

You can only have one invoice per subscription so you have to create a second subscription instead of just charging their card and expecting it to respect credits.

## Changing prices is painful.  

Stripes plans are immutable so if you need to raise prices, you need a new plan.  Over time you end up with lots of plans that all look almost identical, except for their prices.
