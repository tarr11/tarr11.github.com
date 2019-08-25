---
layout: post
title: Watching Plants Grow with Unity and F#
date: 2019-08-25
category: tech
published: true
---

I have been working on a game for fun in Unity. It is inspired by the movement of “watching plants grow”.  I can’t explain why I enjoy watching plants grow, but it is mesmerizing to me.  I’d like to build a simulation that lets you create your own plants and watch them grow, and share them.  

If it is interesting,  then potentially I could build a real game around it.

There are a lot of resources around watching plants grow.  My favorites are [Reddit](https://www.reddit.com/r/watchplantsgrow/) and various videos on Youtube (like [this one](https://www.youtube.com/watch?v=w77zPAtVTuI)).

The reason that I was drawn to F# for this project was that it was a functional programming language, and could be used with Unity.  The interesting part for me is that I see plants growing as a series of sequences that are zipped together, which is easy to describe in a functional language.

Here’s a very simple example:  

[Doug Tarr on Twitter: “Messing around with F# and #Unity building a procedural plant simulation… “](https://twitter.com/doug_tarr/status/1150567177138782208)

It has been a bit challenging - the F# toolchain for Unity and Mac isn’t great.  Unity is perfectly fine to let me use F# dlls, since they are simply .NET dlls.  However, I am using a mac, and Visual Studio for Mac isn’t great.   I’m experimenting with Visual Studio Code for F# (ionide, paket, fake, etc) but it’s a heavy lift to get going.

I tried doing a similar thing in straight C#, and the code is somewhat gross. Lots of generic types make it hard to read.   One of the joys of side projects is that you can choose languages that aren’t necessarily the most mainstream, but are more pleasant to read and work with.  


