---
layout: post
title: Avoid using subdomains for accounts in your SaaS App
published: false
tags:
  - saas
---

When developing your SaaS application, you will hit a decision on how to implement accounts.  

One key decision point is to implement accounts as a subdomain (mybiz.saasapp.com) or simply as a login (www.saasapp.com)  The main value of the subdomain is that it provides a special "landing page" for your company, that can be linked to from intranets or other company documents.

My recommendation is that using subdomains adds cost, complexity, and other issues while providing little value.

## Cost
You will need a wildcard SSL domain, which can cost $99 / year or more.  By contrast, single domain certs are now often free (via LetsEncrypt) or very cheap (<$10 / year)   If you use a cloud host like heroku, you may need to have multiple 

## Information Leakage

## SEO and Information Leakage
Subdomains are often leaked via search engines. (search for *.slack.com on google for example)  You can also guess if a particular company has an account.

You will need a special "corporate" domain that contains corporate content (Blogs, FAQs, pricing and product info, etc) and ensure that it is the canonical version so you don't have duplicate content in search engines.

Users who are sharing your product may accidentally link to subdomains, which is known to reduce the SEO value of those links, and may also accidentally expose that users identity on social networks.

## User Experience

### Choosing subdomains
If subdomains are required, users will need to choose one during onboarding and registration.  The more fields you must choose during registration, the higher your drop-off will be in your registration funnel. 

If you write code that automatically creates a subdomain based on the account name (replacing dashes for spaces, for example), then you may end up with a long, hard to manage subdomain, if the company name is long.   You will also run through an arduous process over many months or years of whitelisting various phrases, unicode characters, etc.

### Changing Subdomain
You will need to implement permissions for your subdomain based on who can change it.  The links to the subdomain will be in places beyond your control, and therefore unchangeable, which may cause confusion for users.

### Forgot Subdomain
Users may also forget the subdomain when logging in.  You will need to have a page on your main site that lets them find their subdomain.

### Forgot Password
The login flow gets more complex when users first have to find their subdomain.

## Development Complexity
You will need to whitelist subdomains that are typically reserved for the company or are security concerns (api, admin, ftp, etc, login)

Companies may complain if their subdomain has been taken by a 3rd party.  (ie, google.saasapp.com)  Though rare, you may need to be able to handle this situation, which could involve revoking 

Your mail subsystem will need to ensure that hosts are handled correctly.  For example, if you are using Rails and ActiveMailer, you will need to pass the host to each

In development, you will need to simulate subdomains.  This requires editing your hosts files so that you can have account1.local, account2.local.  Editing a host file often requires special permissions, and can make setting up a new development box more difficult.
