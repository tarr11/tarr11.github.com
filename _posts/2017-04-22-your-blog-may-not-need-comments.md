---
layout: post
title: Your blog needs contributors, not commenters
published: true
tags:
  - javascript
---
I just read [this idea](http://donw.io/post/github-comments/) about using Github Issues to replace Disqus.  [I decided last year to remove comments altogether](http://douglastarr.com/no-comment) from this blog.   In addition to the performance issues, and tracking issues of Disqus, most of the comments were low value, and the specific conversations that were taking place could have taken place on any website or social network.

## Moderation Solutions
Over time, many solutions have come to fighting spam, and increasing the quality of conversations and information.  Some solutions like [Discourse](https://www.discourse.org) are all-in-one packages with a suite of tools for moderators to curate a thoughtful and useful community.  

On [Hacker News](https://news.ycombinator.com), a combination of flagging, voting, human moderation, and other algorithmic approaches leads to a generally civil discussion.  For example, on Hacker News, you do not get notified of responses to your comments.  This discourages 2-sided, back-and-forth comments where each participant tries to prove that the other side is wrong and miscommunications flourish.  It also encourages a more diverse set of responses to a single comment thread.  It's pretty common to see a thread where the ratio of comments : commenters approaches 1, which leads to a fairly balance discussion.

## Comments create bad incentives for readers
Readers may often skim your article, and head directly to comments.  Some times, this is because the comments contain more information than the post itself.  Other times, there is simply more entertainment in the comments (trolling, memes, fighting, etc).  The commerce value of your blog is mostly to link spammers, who will use bots to post irrelevant links, and create a lot of needless moderation work for blog owners.

This kind of commentary already has a place on the internet - social media like Twitter or Facebook.  Instead of creating a mini-Twitter on your website, simply tweet a link to your post and send your users there (if you even care about this kind of comment).  

### Using Pull Requests for Corrections and Enhancements
The main interactive feedback I receive on my blog is fixing mistakes or clarifications.  Since my blog is hosted on Github Pages, Pull Requests were the obvious solution for me.  

This is a better solution than comments because the git workflow is much easier for me.  It also forces a "contributor" to overcome a set of barriers which makes it far more likely that the comments are coming:  They know how to use github, they know how to submit a pull request, and they are forced to structure their feedback in the form of a change to my document, which creates a higher quality result.
