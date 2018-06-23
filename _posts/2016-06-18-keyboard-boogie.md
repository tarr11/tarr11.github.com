---
layout: post
title: Keyboard Boogie
published: true
og_image: http://www.douglastarr.com/images/keyboardboogie.png
category: games
---

I had this idea for a silly game - I wanted to learn about HTML5 Audio.   

I used [Tone.js](http://tonejs.org/) which is a javascript audio
synthesizer library.  I still don't really understand much of what I'm
doing with the synth library.  I mostly copy pasted some music code, and found it interesting that you
can vary tempo and beat with code.  

It is based on keyboard input, so won't work on your phone.

<iframe src="/games/keyboardboogie"
style="width: 600px; height: 600px;" frameBorder="0"></iframe>

I'm also interested in fun game mechanics.  As a developer, there is a
real pleasant joy to tapping the keyboard.  It provides nice tactile
feedback - I often wish I had more to say since I enjoy typing so much (this is part of the reason why I use [vim](http://www.vim.org/).

Additionally, I used [phaser.io](https://phaser.io) which is my favorite
js game engine because of it's ease of use and well designed API.

Generating a pleasing random color is slightly more challenging then just picking from the color space.  Rather than actually figuring it out, I used this [Random Color generator](https://github.com/sterlingwes/RandomColor) from github.

Finally, I grabbed the dancing sprite from the [Fruity Dance Plugin](https://www.image-line.com/support/FLHelp/html/plugins/Fruity%20Dance.htm) and the [Disco Ball](http://geno2925.deviantart.com/art/Super-Mario-World-Disco-Ball-415470107) from user [geno2925](http://geno2925.deviantart.com/) on DeviantArt

[Source for the game is on github](https://github.com/tarr11/tarr11.github.com/tree/master/games/keyboardboogie)
