---
title: rel=spam for Webmentions
---

An interesting spam technique for webmentions would be to use links with ```rel="spam"```.

These would be a "vote" that a particular URL is spam.

If you point to the root of the domain, then the entire domain is considered spam.  

If you point down the tree, then just that part is considered spam, as if it was a glob with a "*" after it.

We would need smart webmention servers to track your ```rel="spam"``` links and exclude any of them from your webmentions.

We could also add a ```rel="spamlist"```  This would be a page that you trust to manage rel="spam" links.  It could also contain other ```rel=spamlist``` links and the webmention server could follow those.

The downsides of this approach is that you would need a sophisticated server implementatoin to manage all the spam links on your domain.  

The upsides are that over time,  we would get robust and real-time spam lists just using html.  Even players outside of the webmention ecosystem could benefit by crawling from that list.  New webmention users could simply point to a trustworthy spam list.  If  the list goes bad, they can simply copy the html and manage their own lists.

This would also tie into the goals of IndieWeb better since it's not tied to a particular location or implementation.
