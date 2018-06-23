---
layout: post
title: "Clones and variables - Coding Class Week 6"
date: 2013-12-06 08:58
comments: true
category: mvcode
---

This week was a bit of a stretch.  I wanted to teach the kids about clones.  This is a concept that's used fairly extensively in video games.  

## Video
We watched this video - someone basically modeled minecraft in a 3D toolkit.  I wanted them to see clones and physics in action.
<iframe width="420" height="315" src="//www.youtube.com/embed/o702In0aI5E" frameborder="0" allowfullscreen></iframe>

## Clones
![Clones](/images/clones.jpg)

Clones are copies of things.  The kids have been learning to make a game, but the games tend to have very few characters, and they have to script them out individually.  This can be tedious and still feel fairly manual.  

Part of the magic of coding is when you start building lots of objects that interact with each other.   Much of this involves math and physics, so that you can simulate bouncing, gravity, and other real world phenomena.

However, I figured that the kids would be far enough along that they could try.  

## Shoot the Penguin
![Shoot the penguin](/images/shoot-the-penguin.png)

We were going to make a simple game  - I just called it "Shoot the Penguin".  Make a gun, make a bullet, make a penguin.   If the bullet touches the penguin, the penguin dies.

I gave them an example of a gun that shoots a bullet.  Some of the kids had previously figured out how to do this; They had a gun sprite and a bullet sprite and when they hit the space bar, the bullet sprite started moving until it hit the edge.

## Direction, Position, and Variables
At some point, most of the kids had figured out how to make the gun shoot a bullet, and even kill the penguin.

Then, the next goal was to aim the gun.   This was useful because the kids naturally start complaining that their gun doesn't work too well, since it won't aim, and the bullet sometimes doesn't shoot out of the gun.  So, we had to create some global variables to store the position of the gun, and then copy those to the bullet so that the bullet knew which direction to go.

## Scratch Limitations, and Bugs
Scratch is very "opionated", and only comes with a subset of features available in modern programming languages.  It'd be better if it was more object oriented, such that I could query the gun's position, instead of copying into a global variable.  This would have been more natural for the kids to understand.  Copying around variables around is a little bit confusing and messy.

We also ran into some bugs - sprites would just simply not rotate correctly sometimes, and we had to delete them and re-add them.  It was also common for kids to build a complicated sprite, but put it in the wrong place (ie, as a backdrop or as a costume attached to a different sprite)  When they finally realized they did it wrong, they had no idea how to move it.

We finally figured out that you do it by downloading the sprite to your local computer, then uploading again.  Copy/paste would have been better.

Also, renaming variables and sprites tends to break script blocks, which don't update their references always.  So, either name your variables and sprites up front, or don't bother.

## Next Week
I keep meaning to let the kids just build in class, and not really teach them anything.  I think for the last 2 weeks, that's what we'll do.  They can be creative, and I'll just help them as they finish their "final projects".
