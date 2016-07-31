var width = 500;
var height = 500;
var game = new Phaser.Game(width,height,Phaser.AUTO, 'game' ); 
var PhaserGame = function () { 
   
};
var isStarted = false;
var keyCount = 0;
var keyText;
var speedText;;
var dancer;
var drums;
var keysPerSecond = 0;
var lastDrums;
var anim;
var stopped = false;
var statusText;
var rank = 0;
var keys = "";
var achievements = [];
var lastChar = 0;
var score = 0;
var scoreText;
var bassPart;;
var kickPart;
var bleepLoop;
var speeds = [];
var startText;
var discoball;
var rcolor;
var titleText;
var filter;
var background;
PhaserGame.prototype = { 
    preload: function() { 
        this.load.crossOrigin = "Anonymous"; 
        this.load.spritesheet('dancer', 'dancer.png', 110, 126,-1 ,3, 2);
        this.load.spritesheet('discoball', 'discoball.png', 18, 18,-1 ,1);
        this.load.audio('drums', 'drums.mp3');
        this.load.script('filter', 'plasma.js');
    },
    create: function () { 

        background = this.add.sprite(0,0);
        background.width = width;
        background.height = height;
        filter = this.add.filter('Plasma', width, height);
        background.filters = [ filter ] ;

        var graphics = this.add.graphics(0, 0);
        graphics.beginFill(0xFF3300);
        graphics.lineStyle(10, 0xffd900, 1);

        // draw a shape
        graphics.moveTo(0,0);
        graphics.lineTo(width,0);
        graphics.lineTo(width, 50);
        graphics.lineTo(0, 50);
        graphics.lineTo(0, 0);
        graphics.endFill();
        rcolor = new RColor;
        //this.stage.backgroundColor = '#ff69b4';
        this.physics.startSystem(Phaser.Physics.ARCADE);

        scoreText  = this.add.text(50, 30, score);
        keyText = this.add.text(150,30, "KEYS: " + keyCount);
        speedText  = this.add.text(250, 30, keysPerSecond + " keys/sec");
        scoreText.anchor.set(0.5);
        scoreText.align = 'center';
        scoreText.fontSize = 14;
        scoreText.fill = "#43d637";
        keyText.anchor.set(0.5);
        keyText.align = 'center';
        keyText.fontSize = 14;
        speedText.anchor.set(0.5);
        speedText.align = 'center';
        speedText.fontSize = 14;
        statusText = this.add.text(400,30, "DANCE NOOB")
        statusText.align = 'right';
        statusText.anchor.set(0.5);
        statusText.fontSize = 14;
        statusText.visible = false;
        scoreText.visible = false;
        speedText.visible = false;
        keyText.visible = false;
        titleText  = this.add.text(this.world.centerX,this.world.height - 50, "KEYBOARD BOOGIE");
        titleText.anchor.set(0.5);
        titleText.align = 'center';
        titleText.font = 'Arial Black';
        titleText.fontSize = 40;
        titleText.fontWeight = 'bold';
        initTitleColor();
        var titletimer = game.time.create(false);
        titletimer.loop(500, changeTitleColor, this);
        titletimer.start();

        startText  = this.add.text(this.world.centerX, this.world.centerY, "SMASH SOME KEYS TO BOOGIE");
        startText.anchor.set(0.5);
        startText.align = 'center';
        dancer = this.add.sprite(200, 300, 'dancer');
        anim = dancer.animations.add('dance', [16, 17, 18, 19, 20, 21, 22, 23], 5, true);
        discoball = this.add.sprite(225, 100, "discoball");
        discoball.scale.setTo(3,3);
        discoball.visible = false;
        this.input.keyboard.onDownCallback = function (event) {
          if (!isStarted){
            isStarted = true;
            startGame();
          }
          keyCount++;
          keyText.setText(keyCount + " keys");
          keyChar = String.fromCharCode(event.keyCode);

          var c = rcolor.get(true);
          var charText = game.add.text(game.rnd.integerInRange(0,500), 100, keyChar);
          charText.addColor(c, 0);
          game.add.tween(charText).to( { y: 500 }, 500, "Linear", true);
          keys = keys.concat(keyChar);
          score++;
          updateScore();
        };
    }, 
    update: function() {
      filter.update();
    }
}

function initTitleColor(){
  var tcolor = new RColor;
  var c = tcolor.get(true);
  titleText.strokeThickness = 6;
  titleText.stroke = "000000";
  for(var i = 0; i < titleText.text.length; i++)
  {
    var tcolor = new RColor;
    var c = tcolor.get(true);
    titleText.addColor(c, i);
  }
}

function changeTitleColor(){
  var colors = titleText.colors.slice();
  for(var i = 1; i < titleText.text.length ; i++)
  {
    colors[i] = titleText.colors[i-1];
  }

  var tcolor = new RColor;
  var c = tcolor.get(true);
  colors[0] = c;
  for(var i = 0; i < titleText.text.length; i++)
  {
    titleText.addColor(colors[i], i);
  }

}

function startGame(){
  startText.visible = false;

  discoball.visible = true;
  statusText.visible = true
  speedText.visible = true;
  keyText.visible = true;
  scoreText.visible = true;
  timer = game.time.create(false);
  timer.loop(1000, checkSpeed, this);
  timer.start();
  var timer2 = game.time.create(false);
  timer2.loop(1000, checkAchievements, this);
  timer2.start();
  dancer.animations.play("dance");
  anim2 = discoball.animations.add('spin', [1,2,3,4,5], 5, true);
  discoball.play("spin");
  music();
}

function checkSpeed(){
  keysPerSecond = keyCount - lastDrums;
  lastDrums = keyCount;
  speedText.setText(keysPerSecond + " keys/sec");
  if (keysPerSecond > 0)
  {
    if (stopped)
      dancer.animations.play("dance");
    anim.speed = keysPerSecond;
  }
  else
  {
    stopped = true;
    dancer.animations.stop();
  }

  if (!isNaN(keysPerSecond))
  {
    speeds.push(keysPerSecond);
  }

  if (score > 2000){
    statusText.setText("DANCING MACHINE");
    rank++;
  }
  else if (score > 1000){
    statusText.setText("FANCY DANCER");
    rank++;

  }else if (score > 500){
    statusText.setText("SUPER DANCER");
    rank++;
  }else if (score > 100){
    statusText.setText("TINY DANCER");
    rank++;
  }

    var playBackRate = 1;
    if (keysPerSecond > 25)
      playBackRate = 16;
    else if (keysPerSecond > 10)
      playBackRate = 8;
    else if (keysPerSecond > 5)
      playBackRate = 4;
    else if (keysPerSecond > 2)
      playBackRate = 2;
    else
      playBackRate = 1;

    if (bassPart)
      bassPart.playbackRate = playBackRate;

    if (kickPart)
      kickPart.playbackRate = playBackRate;

    if (bleepLoop)
      bleepLoop.playbackRate = playBackRate;

};

function checkAchievements(){
  if (lastChar == keys.length)
    return;
  if (keys.endsWith("AAA")){
    addAchievement("TRIPLE-A", 3);
  }
  if (keys.endsWith("ABCDEFGHIJKLMNOPQRSTUVWXYZ")){
    addAchievement("ALPHABET", 20);
  }
  if (keys.endsWith("8)")){
    addAchievement("8)", 2);
  }

  if (speeds.length > 1)
  {
    var isFast = true;
    var streak = 5;
    for (var i = speeds.length - streak; i < speeds.length; i++)
    {
      if (speeds[i] < 20) {
        isFast = false;
        break;
      }

    }

    if (isFast)
      addAchievement("SUPER FAST", 20);
  }

  lastChar = keys.length;
}

function addAchievement(name, achievementScore){
  achievements.push(name);
  var text  = game.add.text(game.world.centerX, 100, name + "\n +" + achievementScore + " boogies!");
  game.add.tween(text).to( { y: height + 100 }, 2000, "Linear", true);
  text.font = 'Arial';
    text.fontWeight = 'bold';
    text.fontSize = 40;
    text.align = 'center';
        text.anchor.set(0.5);

    //  Here we create a linear gradient on the Text context.
    //  This uses the exact same method of creating a gradient as you do on a normal Canvas context.
    var grd = text.context.createLinearGradient(0, 0, 0, text.height);

    //  Add in 2 color stops
    grd.addColorStop(0, '#8ED6FF');   
    grd.addColorStop(1, '#004CB3');

    //  And apply to the Text
    text.fill = grd;
    score += achievementScore;
    updateScore();
}


function updateScore(){
  scoreText.setText(score + " boogies");
}

function startMusic(){
  drums.loopFull(0.6);
}


game.state.add('Game', PhaserGame, true);

function music() {

		//HATS
		//filtering the hi-hats a bit
		//to make them sound nicer
		var lowPass = new Tone.Filter({
		    "frequency": 14000,
		}).toMaster();
		//we can make our own hi hats with 
		//the noise synth and a sharp filter envelope


		var openHiHat = new Tone.NoiseSynth({
			"volume" : -10,
		    "filter": {
		        "Q": 1
		    },
		    "envelope": {
		        "attack": 0.01,
		        "decay": 0.3
		    },
		    "filterEnvelope": {
		        "attack": 0.01,
		        "decay": 0.03,
		        "baseFrequency": 4000,
		        "octaves": -2.5,
		        "exponent": 4,
		    }
		}).connect(lowPass);
		var openHiHatPart = new Tone.Part(function(time){
			openHiHat.triggerAttack(time);
		}, ["2*8n", "6*8n"]).start(0);
		var closedHiHat = new Tone.NoiseSynth({
			"volume" : -10,
		    "filter": {
		        "Q": 1
		    },
		    "envelope": {
		        "attack": 0.01,
		        "decay": 0.15
		    },
		    "filterEnvelope": {
		        "attack": 0.01,
		        "decay": 0.03,
		        "baseFrequency": 4000,
		        "octaves": -2.5,
		        "exponent": 4,
		    }
		}).connect(lowPass);
		var closedHatPart = new Tone.Part(function(time){
			closedHiHat.triggerAttack(time);
		}, ["0*8n", "1*16n", "1*8n", "3*8n", "4*8n", "5*8n", "7*8n", "8*8n"]).start(0);
		//BASS
		var bassEnvelope = new Tone.AmplitudeEnvelope({
		    "attack": 0.01,
		    "decay": 0.2,
		    "sustain": 0,
		    "release": 0,
		}).toMaster();
		var bassFilter = new Tone.Filter({
		    "frequency": 600,
		    "Q": 8
		});
		var bass = new Tone.PulseOscillator("A2", 0.4).chain(bassFilter, bassEnvelope);
		bass.start();
		bassPart = new Tone.Part(function(time, note){
			bass.frequency.setValueAtTime(note, time);
		    bassEnvelope.triggerAttack(time);
		}, [["0:0", "A1"],
			["0:2", "G1"],
			["0:2:2", "C2"],
			["0:3:2", "A1"]]).start(0);
		//BLEEP
		var bleepEnvelope = new Tone.AmplitudeEnvelope({
		    "attack": 0.01,
		    "decay": 0.4,
		    "sustain": 0,
		    "release": 0,
		}).toMaster();
		var bleep = new Tone.Oscillator("A4").connect(bleepEnvelope);
		bleep.start();
		bleepLoop = new Tone.Loop(function(time){
			 bleepEnvelope.triggerAttack(time);
		}, "2n").start(0);
		//KICK
		var kickEnvelope = new Tone.AmplitudeEnvelope({
		    "attack": 0.01,
		    "decay": 0.2,
		    "sustain": 0,
		    "release": 0
		}).toMaster();
		var kick = new Tone.Oscillator("A2").connect(kickEnvelope).start();
		kickSnapEnv = new Tone.FrequencyEnvelope({
		    "attack": 0.005,
		    "decay": 0.01,
		    "sustain": 0,
		    "release": 0,
		    "baseFrequency": "A2",
		    "octaves": 2.7
		}).connect(kick.frequency);
		kickPart = new Tone.Part(function(time){
			kickEnvelope.triggerAttack(time);
			kickSnapEnv.triggerAttack(time);
		}, ["0", "0:0:3", "0:2:0", "0:3:1"]).start(0);
		//TRANSPORT
		Tone.Transport.loopStart = 0;
		Tone.Transport.loopEnd = "1:0";
		Tone.Transport.loop = true;
    Tone.Transport.start();
}
