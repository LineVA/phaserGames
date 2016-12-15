/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload: preload, create: create, update: update});

function preload() {
    game.load.image('star', 'assets/star.png');
    game.load.image('platform', 'assets/platformIndustrial_003.png');
    game.load.image('sky', 'assets/sky.png');
    game.load.image('character', 'assets/robot_greenDrive1.png');
}

var platforms;
var player;
var stars;
var score = 0;
var scoreText;
var life = 30;
var lifeText;
var gameOver = false;

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    var sky = game.add.sprite(0, 0, 'sky');
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'platform');
    ground.scale.setTo(12, 2);
    ground.body.immovable = true;
    var ledge = platforms.create(400, 400, 'platform');
    ledge.body.immovable = true;
    ledge.scale.setTo(1, 0.5);
    ledge = platforms.create(150, 250, 'platform');
    ledge.body.immovable = true;
    ledge.scale.setTo(1, 0.5);
    player = game.add.sprite(32, game.world.height - 150, 'character');
    player.scale.setTo(0.3, 0.3);
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.0;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
//    player.animations.add('left', [0, 1, 2, 3], 10, true);
//    player.animations.add('right', [5, 6, 7, 8], 10, true);
    scoreText = game.add.text(16, 16, 'Score: 0', {fontSize: '32px', fill: '#000'});
    lifeText = game.add.text(game.world.height - 50, 16, 'Life: 10', {fontSize: '32px', fill: '#000'});
    createStars();
}

function createStars() {
    stars = game.add.group();
    stars.enableBody = true;
    var star = stars.create(20, 40, 'star');
//    star.body.immovable = true;
}

function update() {
    var hitPlatform = game.physics.arcade.collide(player, platforms);
    if (!gameOver) {
        keyControls(hitPlatform);
    }
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
}

function collectStar(player, star) {
    score += 10;
    scoreText.text = "Score : " + score;
    lifeText.text = "WON";
    star.kill();
}

function jump() {
    life -= 10;
    lifeText.text = "Life : " + life;
    die();
}

function die() {
    if (life === 0) {
        lifeText.text = "GAME OVER";
        gameOver = true;
    }
}

function keyControls(hitPlatform) {
    cursors = game.input.keyboard.createCursorKeys();
    player.body.velocity.x = 0;
    if (cursors.left.isDown) {
        //  Move to the left
        player.body.velocity.x = -350;
        player.animations.play('left');
    }
    else if (cursors.right.isDown) {
        //  Move to the right
        player.body.velocity.x = 350;
        player.animations.play('right');
    }
    else {
        //  Stand still
        player.animations.stop();
        player.frame = 4;
    }
    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        jump();
        player.body.velocity.y = -350;
    }
}
