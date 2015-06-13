---
layout: post
title: "Coding Class Week 1"
date: 2013-11-01 09:21
comments: true
categories: mvcoders
---

This was the first week of my [8 Week Coding Class for 4th Graders](/categories/mvcoders)  

I ran 2 classes after school (about 5 kids per class) after school.  I was a bit nervous to get started as I had no idea what was going to happen, or if the kids were going to get bored.  We followed the plan that I laid out in my [the fourth grade coding curriculum](https://github.com/tarr11/coding-lessons/blob/master/4th-grade-coders/lesson-1.md) on Github, with a few modifications.

## After school
Getting everyone to focus at the beginning was tough.  They came directly from school and were a little bit rambunctious from sitting in class all day.  Some kids immediately booted up their laptops to play a video game and I had to tell them not to.

## Computers
I asked the kids to bring their own laptops if possible.  I have a series of old laptops and fortunately, most of them worked, even if they were a little bit slow.   I needed Google Chrome installed on each computer, which I had to install on a few of their laptops.

I've decided to avoid using any native shell programs since they aren't going to be the same amongst all the laptops that the kids have.  For example, I've had kids bring Macbooks, Chromebooks and Windows 7 and 8 laptops.  Even trying to get a [bash shell](http://www.gnu.org/software/bash/) running on all those environments would have been tough.  

In the future, I may look at [Nitrous.io](http://nitrous.io) if I do want a terminal that they can all use.  I tried out making a "Hello World" [Voxel.js](http://voxeljs.com) / [Node.js](http://nodejs.org) with Nitrous, and that worked.  I may use that in a future class, to show them how you can code your own Minecraft world.

## Introduction
I asked the kids what they thought programming was.  Some named programming languages like HTML.  One mentioned "The Matrix" and how they used progrmaming there. A few said Minecraft.  Some said it was a way to get computers to do what you want.  A few had no idea.

I asked them what they wanted to do in the class?  In the first class, they all unanimously said "make video games".  Some had very specific ideas about the games that they wanted to make.  In the second class, it was a mix.  One wanted to make a very specific Minecraft plugin that made it easy and safe to make other Minecraft plugins.  One wanted to make it safer to use computers online (he was on a Windows 8 laptop, FWIW).  The rest wanted to make video games. 

They responded well ("woohoo!") when I told them that this wasn't going to be like a normal class in school where you had to listen to a teacher talk, and that they'd spend a lot of time coding.  That said, I did have to calm them down periodically, just like any class.
 
## ChromeCast
The class was in our living room, and I used my laptop + [ChromeCast](http://www.google.com/intl/en/chrome/devices/chromecast/) to show them videos and code samples on the screen.  This worked out really well - we watched the [Code.org video](http://www.youtube.com/watch?v=nKIu9yen5nc) in one of the classes, and the kids responded really well to seeing Bill Gates and Mark Zuckerberg on the screen, talking about coding.

## CodeCombat
![Code Combat Screenshot](https://github-camo.global.ssl.fastly.net/5cbc6e9e49ea8cecd35303f9e62bf27cda4edefa/687474703a2f2f692e696d6775722e636f6d2f496c76373352382e706e67)

A few weeks ago, on [Hacker News](http://news.ycombinator.com), I heard about a cool site called [CodeCombat](http://codecombat.com) which teaches kids some javascript and coding fundamentals.  There are a series of "challenges" that the kids have to go through, such as having their knight defeat a troll, move around a maze, and say various things in order.   Overall - the kids LOVED this game and had a lot of fun.  I think they didn't even realize that they were learning coding.  I heard from one parent that their kid had a lot of fun but didn't learn much. I think this was because they thought they were just playing a game.  But in order to play the game, you have to write a lot of javascript, understand logic flow and how to construct and debug a sophisticated program.  So, I considered it a success because it was a lot of fun.

That said, running the class reminded me of the game [Diner Dash](http://en.wikipedia.org/wiki/Diner_Dash) for a while. In that game, you are a waitress, and your job is to take and serve complex orders in a diner very quickly.  If you mess up the orders or take too long, customers get mad.  If you do everything right, you get points. I found that with 5 or 6 kids, especially as they get going, they are hitting roadblocks about every minute.   Most of these involved some sort of debugging of their javascript code.  They would say "It's not working" and I'd come over and try to help them figure out what's wrong.   If I spent too much time helping one student, the bugs would back up and I'd have a lot of kids unhappy.  If the kids were blocked for too long, they would get frustrated.  

One thing I am not sure about is how someone with no programming experience can help kids.  Most of the problems that I was solving for were debugging issues.  These are easy for developers to solve (sometimes) but sometimes they are not!  Some of these problems could be resolved with a more sophisticated user interface.  But making debugging "easy" is a famously hard problem in computer science.  One example of this problem is the [halting problem](http://en.wikipedia.org/wiki/Halting_problem)  Ie, trying to detect if a computer is stuck in an infinite loop.   I think this gets easier with visual programming languages since it's easier to stay "on the rails".  But, much of the power of coding is still in language based coding, so I want to balance out these two techniques.

That said, whenever the kids solved a problem on their own (ie, fixed a missing parentheses, semicolon, or capitalization), they would get very excited that they accomplished something.  CodeCombat also did a good job of helping them celebrate their victories by showing them a little animation of their knight crushing the enemy or winning.

## Browser Based Coding
CodeCombat uses two windows - a game and a javascript editor in a browser.  This does present some challenges.  The coding window loses focus a lot, and the kids expect when they start typing, sometimes nothing would happen.  The game would occasionally get stuck, or the browser would get wonky, and I'd have to reset the screen.   At this age (9 + 10 years old), this would be a tough game for the kids to learn without my help. 

The kids also needed to learn to type like a software developer would.  Learning how to type as a coder is different than typing words.  I am not teaching them to use advanced coding motions (ie, [vim](http://www.vim.org/) ) but there are a set of things that they need to code javascript.  For example, they need to know various characters - parentheses, semicolon, single and double quotes.  They need to know how to position the cursor on a line and insert a new line below it.  They need to know how to "pronounce" code.  ie, when I asked them to pronounce "this.moveNext();", they said "this period move next parentheses parentheses semicolon".   Teaching them how "talk in code" was a surprising thing that was important to teach.

## CodeClub Software
![CodeClub Software on ChromeCast](https://lh5.googleusercontent.com/-YV1ZHLB3uao/UnGDazlwlCI/AAAAAAAAYlE/K5tPI5iS5JM/w1623-h1217-no/20131030_150608.jpg)

I've built a little ASP.NET MVC website that gives them logins, lets them take notes, and then guides them through the class using the curriculum that I put on Github.   This mostly worked, but there was a bug in the first class where some of their notes didn't save.   This software is really valuable for parents to see what's going on, and it gives me a way to communicate and guide the class.  This code isn't available yet but I plan to put it online in a few weeks.

## Second Class
The goal of the next class is to introduce them to [MIT Scratch](http://scratch.mit.edu) which is a visual environment for learning to make games and animations.  I'm working on the curriculum now, so check back in a week or so to see how that went.
