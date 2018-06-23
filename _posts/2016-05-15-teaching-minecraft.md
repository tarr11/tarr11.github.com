---
layout: post
title: Teaching Minecraft
published: true
og_image: http://www.douglastarr.com/images/teaching_mc.png
category: mvcoder
---

This is a technical description of some of the work we've done to make it easier to teach Minecraft at [MV Code Club](https://www.mvcodeclub.com)

About half of the kids in MV Code Club love Minecraft and come to us wanting to learn to code mods and plugins because of Minecraft.  About two years ago, we made the decision to start building out infrastructure for Minecraft.

<iframe frameborder="0" style="border:none; border: 0; overflow: hidden; width:500px; height: 375px" src="/games/2dmc">
</iframe>

Well, let me tell you about the joy that is Minecraft Development for Kids.  


It is very challenging to get a frictionless programming environment for Minecraft.  You have to install [Eclipse](https://eclipse.org/downloads/) (200+MB) (or [IntelliJ](https://www.jetbrains.com/idea/) )), you have to run an altered build of your server using [Spigot](https://www.spigotmc.org/) (which used to be called [Bukkit](https://bukkit.org/) ) using undocumented APIs.  You have to run this server on just the right JVM on your client.   You have to teach them how to copy files to just the right directory.  Reboot, restart, Reboot.
]

And then, you have to teach 10 year olds Java.  And editing YML files.  Usually these are kids who have never programmed before.  I know graybeards who won’t touch Java or Eclipse.  Entire families of programming languages have evolved to fix the deficiencies of Java.    And 10 year olds think they know everything and have no patience.

And that’s just the Minecraft (server) plugins, which are the easy part.  Then there are the client mods (which change the fundamental look and feel of Minecraft).  Those are even more complex.  They actually inject code into the Minecraft runtime and use a modded client package to install things.  Running mods is more complicated than installing linux.  We are teaching some mods in some summer camps this year, though, to see how that goes.

## Initial Take: 
We started, like everyone else, with the most obvious solution - A [step by step tutorial](https://www.mvcode.co/lessons/how-to-make-a-minecraft-plugin) in a very controlled environment building server plugins using Bukkit / Spigot.

We had hired [Jonathan](https://www.mvcode.co/user/jce) - a smart high school student from [Redwood High School](http://www.tamdistrict.org/redwood) who had a side job doing builds for popular Minecraft youtubers.  He had written some Bukkit plugins and wrote a series of tutorials on our website on how to use them.   Jonathan has since graduated and is traveling the world, but his work helped us a lot.

This got us off the ground.  Kids didn’t have much agency or creativity in this process.  They were copying a lot of code, and in the end they made a working plugin.  But only a small group of them could make it again.  Instructors would help debug intricate java errors in Eclipse that were beyond the ken of the kids.  We ran into endless IT issues with JVM versioning.  

In the end, the kids still loved it.  They accomplished something, they could make small tweaks to their plugins, and had been exposed to some sophisticated programming.

## Improvement: Make it web based and use hosted servers (2014)
One of our first improvements was to remove Eclipse and avoid hosting on kids machines.  We did this by writing a web based environment (using the [ACE editor](https://ace.c9.io/#nav=about) ) and then compiling on the back end using a javac in a worker process in our Rails app.  We would push the errors back to the client.    This restricted what they could do, but it made it easier for us to write integrated lessons (using our lesson tool) and also eliminated problems with multiple versions of the JVM.  

We also eliminated running the server process on kids machines.  Instead, we started hosting with [Endermite](https://endermite.com/), a Minecraft hosting provider who let us run lots of servers, and we used [Multicraft](http://www.multicraft.org/) to manage the servers.  Multicraft lets you manage multiple minecraft server instances from a web interface.  We gave the kids smallish servers (that could play up to 5 people) but that was fine for teaching coding.

This was better - we could teach Minecraft in more places now, and we didn’t have a huge client install.  Kids could also play their plugins at home with their friends.

## Improvement:  Use Javascript instead of Java (2015)
We do a lot of our early coding lessons using [ProcessingJS (PJS)](http://processingjs.org/)   We like this environment because it’s a great way to teach coding in a web based environment.  We like javascript as it’s a very portable and accessible language and lets you do pretty much anything.  Processing is a simpler graphics library, and has a bit of the simpler feel of Python.  So, for us, this was a nice trade off than trying to teach Python (which is a common standard language to teach kids)  We have many [ProcessingJS courses](https://www.mvcode.co/platforms/javascript) available for free as well.

[Aaron](https://www.mvcode.co/user/aaron) discovered a github project called [Scriptcraft](http://scriptcraftjs.org/) which hosted the Javascript Runtime in Java.  This effectively masked the complexity of Java, and let us create a lot easier to write plugins.  So, we adopted ScriptCraft and installed the ScriptCraft jar on all of our hosted servers at Endermite   Aaron contributed a bunch of pull requests to ScriptCraft as well.

This was a little bit better again - we had lots of kids who knew Javascript and could learn to code Minecraft plugins.

## Improvement: Use AWS and Docker to host our servers (2016)
The servers we hosted were a bit of a pain. They would crash a lot, they weren’t secure.  The last straw was when someone came in and hacked the entire server, destroying all of our kids work.  This was really bad - kids were upset and there was nothing we could do.  I frantically reached out to [Ken](https://www.demaria.net/Ken_DeMaria/Welcome.html), who used to do all of our IT when I was at [PayScale](https://www.payscale.com), and we tried to do a forensic analysis of what happened.  

Turns out, our servers were just not patched up, and a pretty common script kiddie just came in and owned us.  

Ken, like all good IT guys, has a rack of servers in his basement.   He graciously offered to host our Minecraft instances for a few months 

At this point, we hired [Spenser](https://www.mvcode.co/user/spenserw25), who was a recent high school graduate from [San Rafael High School](http://sanrafael.srcs.org/).   One of the things we’ve noticed is that there are pretty good number of non-traditional programmers (esp students) who we can tap into and help us.   Turns out San Rafael HS has some amazing kids coming out of their and has become one of our main recruiting channels for instructors.   I know there is a group of specific individuals and teachers there that have made this happen.   It seems like this is the way education works - it's always one or two amazing teachers who can make all the difference.

We had Spenser investigate moving us off of Endermite onto something more secure.  AWS had come out with a [hosted Docker service](http://aws.amazon.com/documentation/ecs/) called ECS, which we thought would be appropriate.  By using Docker, we could sandbox our server instances, and spin up minecraft servers on demand.  So, Spenser set this up and spent a few months bullet proofing the environment.   Spenser is just finishing up with us and is hoping to find a new company  to join soon as a developer.  (Thanks Spenser!)

Spenser also added a cool way for kids to provision their own servers from our website (which is a Rails App).  Now, if they want to launch a server, they just click a button, which spins up a docker instance for a certain amount of time.  It’s really cool.
![Minecraft Console Interface](/images/mc_screenshot.png)

So, this was better again.  AWS Docker is a bit more expensive than hosting via Endermite but as we scale up, the costs will move favorably in our direction.  

Our Minecraft servers are more scalable, more secure, and more automated now.

## Improvement: Minecraft Courses
We’ve built several [Minecraft Courses](https://www.mvcode.co/platforms/minecraft) using our the Learning Management System we've built for ourselves.   All of our lessons and courses (on all platforms) are available for free with no registration or cost for students and teachers.    We’ve split off our content and creation tools into a separate website ([MVCode.co](https://www.mvcode.co)) from [MV Code Club](https://www.mvcodeclub.com) (which is about the clubs we run and the programs we run at schools)

It takes us a long time to build lessons and courses, but I do not really think content is something that people should pay for and should be as accessible as possible, which will allow us to find problems with it and make it better.   We are also starting to offer our [coding lesson building and publishing tools for teachers](https://www.mvcode.co) for no cost and [coding modules for schools](https://www.mvcode.co/teach) that lets you do classroom management, track students for a $29 monthly fee (charged per teacher, not student)  This paid tool is optional -  you can access all of our content without ever even signing up, but it can be a bit of a pain to manage lots of kids.  The idea is to avoid making this prohibitively expensive and more accessible to teachers, students and schools regardless of their finances.  I have some more thoughts on this that I will include in a later blog post.

We don’t currently offer any Minecraft hosting for teachers but we would consider it if there’s enough demand.  That said, spooling up your own Spigot servers with Scriptcraft isn’t that hard and if you are a teacher on a tight budget (or a student with no budget) than setting up this server is a worthwhile exercise.

