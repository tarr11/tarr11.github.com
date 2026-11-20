---
layout: post
title: why i'm building a database
description: "Why I'm building MelodyDB, a database that takes the pain out of running a distributed system."
---

I left MongoDB in July, after about eight years. I'd done what I set out to do there: we built a search and vector search platform and integrated the Voyage embeddings platform. I'm proud of what we built, and many people use those systems at large scale. I'm not looking for another role right now. I'm working on my own projects instead, and one of them has taken over.

One of my hobby sites cost me about $500 in overage charges, mostly from my own mistakes. It ran on Vercel, Neon, Cloudflare and GitHub, and each one billed me separately.

I moved it to a single Hetzner box and ran Postgres myself. Over time I added Temporal for workflows, then SigNoz and ClickHouse so I could see what was going on. Eventually it didn't fit on the box. The site probably should cost about 50 cents to run, and most of what I'd added was there for problems I didn't have. So I took it all down.

Around then I started playing with a B-tree in Rust (put, get, scan), mostly to see where it would go. I had two goals: something I wouldn't have to operate, and something cheap to run. I was also curious about an older question. Could a system tell you up front how it's allowed to fail?

It kept growing. It has search now, a small app server, a language called Score that I've been designing with Claude and Codex, and a way to package pieces of an app together. The idea I'm exploring is describing what an app needs instead of how to build it, and letting a compiler work out the rest and check that the pieces fit. I don't know yet if that holds up. I'm calling it MelodyDB, and I wrote up the design so far at [melodydb.com](https://melodydb.com).

I haven't written the code myself. I don't really know Rust. Claude Code and Codex do the building, and I spend my time on direction and on trying to break it. Even though I haven't written it myself, I'm pretty comfortable working this way. It reminds me of leading a large engineering org, where your influence comes from focusing on outcomes, understanding the system, and asking the right questions. The language design has been fun. Most of the work is correctness and durability bugs, and there are many.

It's early, and I keep finding things. A few weeks ago I learned the agents had built an interpreter where I'd asked for a compiler. It mostly worked, and I only noticed because their explanations started sounding off. So I'm working on that now.

I don't know yet whether this becomes something other people use. I'd like to get it to a first release and find out.

If you're curious, you can leave your email on the site to hear when there's something to try. I'd appreciate the feedback.
