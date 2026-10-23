---
layout: post
title: "ZIRP for tech debt"
---

This is ZIRP for tech debt.

I’ve been building a Rust project for a few months, mostly through agents. It’s gotten large. When I started I just let the agents set things up and focused on velocity. In my old life this would have been throwaway code. The kind of thing you’d never take into production because bad code makes more bad code. You’d enforce standards hard before the real build.

What’s different now is that the stronger models notice quality problems on their own during normal work. I send an agent to look at how bad it is, pull the right patterns from other Rust projects, and then send a few agents off to fix it over time.

The cost of cleaning this stuff up has collapsed. The old debt metaphor assumed the interest was expensive to pay. It isn’t anymore.

Anyone else noticing this shift, or still treating quality issues the old way?

[Originally posted on X.](https://x.com/doug_tarr/status/2113661554478706764)
