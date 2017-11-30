var gameProperties = {
    screenWidth: 640,
    screenHeight: 480,
};

var states = {
    game: "game",
};

var gameState = function(game){

};

gameState.prototype = {



    preload: function () {
      game.load.image("background","assets/background.gif")
      game.load.image("ground","assets/shz/2.png")
      game.load.spritesheet("sonic","assets/sonic.png",64,64,19)
      game.load.spritesheet("ring","assets/ring.png",64,64,16)
      game.load.audio("ringsound",["assets/ring.wav"])
      game.load.audio("jumpsound",["assets/jump.wav"])
    },



    create: function () {

      game.physics.startSystem(Phaser.Physics.ARCADE);//adds game's global physics
      background=game.add.sprite(0,0,"background");//adds background
      //The bg is not to scale,time to make it go to the size of the game.
      background.height= game.height;
      background.width= game.width;

      platforms=game.add.group();
      platforms.enableBody= true;
      var ground = platforms.create(0,game.world.height -64, "ground");
      ground.scale.setTo(3,1);
      ground.body.immovable= true;
      var ledge = platforms.create(500,400, "ground")
	    ledge.body.immovable  =true;
	    ledge = platforms.create(-300,300,"ground")
	    ledge.body.immovable = true;

      //sonic set-up
      sonic= game.add.sprite(32,game.world.height - 175, "sonic");
      game.physics.arcade.enable(sonic);//turns on physics for sonic
      sonic.body.bounce.y=0.1;
      sonic.body.gravity.y=200;
      sonic.body.collideWorldBounds= true;//this helps prevent sonic from falling
      sonic.anchor.setTo(.5,.5)

      //Time to set up animations for later use
      sonic.animations.add("idle",[0,1,2,3,4], 6, true)
      sonic.animations.add("run",[5,6,7,8,9,10,11,12,13],10,true)
      sonic.animations.add("jump",[14,15,16,17],10,false)
      //let's try the idle stance for sonic out.
      // sonic.animations.play("idle") works!

      //time to set up one ring
      ring= game.add.group();
      ring.enableBody= true;
      ring.create(500,300,"ring")
      //This is the only way to do animations on groups
      //              property         method        name             array of frames              fps  loopBoolean
      ring.callAll("animations.add", "animations", "spin", [0,1,2,3,4,5,5,7,8,9,10,11,12,13,14,15], 30, true);
      ring.callAll("play",null, "spin")
      //




      //Time to create controls scheme
      cursors = game.input.keyboard.createCursorKeys();

    },



    update: function () {
      // makes it so sonic won't fall through the platform
      var hitPlatform = game.physics.arcade.collide(sonic, platforms);

      sonic.body.velocity.x=0;
      //If I press the left button, sonic will move in that directio
      if (cursors.left.isDown){
        sonic.body.velocity.x=-300;
        sonic.animations.play("run");
        sonic.scale.x= -1
        // visa versa
      }else if (cursors.right.isDown){
        sonic.body.velocity.x=300;
        sonic.animations.play("run");
        sonic.scale.x= 1
      }else{
        sonic.animations.play("idle");
      }

      //jumping physics for sonic,ONLY APPLIES WHEN HE'S ON PLAYFORMS
      if (cursors.up.isDown && sonic.body.touching.down && hitPlatform){
        var snd= game.add.audio("jumpsound")
        snd.play()
        sonic.animations.play("jump");
      	sonic.body.velocity.y= -150;//how high he jumps
      }


        game.physics.arcade.collide(ring,platforms)
        game.physics.arcade.overlap(sonic,ring,collectRing,null,this);

        function collectRing(sonic,ring){
          var ringsound= game.add.audio("ringsound")
          ringsound.play()
          ring.kill();//destroys ring on contact

        }
    },
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);
