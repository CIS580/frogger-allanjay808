"use strict;"

/* Classes */
const Game = require('./game.js');
const EntityManager = require('./entity-manager.js');
const Player = require('./player.js');
const CarDown = require('./car-down.js');
const CarUp = require('./car-up.js');
const Log = require('./log.js');

/* Global variables */
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');
var game = new Game(canvas, update, render);
var gameIsOver = false;
var score = 0;
var lives = 3;
var level = 0;
var carDown = new CarDown({x: 128, y: -128});
var carDown2 = new CarDown({x: 320, y: -128});
var carUp = new CarUp({x: 192, y: 640});
var carUp2 = new CarUp({x: 384, y: 640});
var player = new Player({x: 0, y: 320});

carDown2.setSpeed(18);
carUp2.setSpeed(20);

var carsDown = [];
var carsUp = [];
carsDown.push(carDown);
carsDown.push(carDown2);
carsUp.push(carUp);
carsUp.push(carUp2);

var arrLogsDown = [];
var arrLogsDown2 = [];
var arrLogsUp = [];

// Create first set of logs going down
var logx = 512;
var logy = -128;
for (var i = 0; i < 3; i++) {
  var log = new Log({x: logx, y: logy});
  arrLogsDown.push(log);
  logy += 256;
}

// Create second set of logs going down
logx = 640;
logy = -128;
for (var i = 0; i < 3; i++) {
  var log = new Log({x: logx, y: logy});
  arrLogsDown2.push(log);
  logy += 256;
}

// Create set of logs going up
logx = 576;
logy = 640;
for (var i = 0; i < 3; i++) {
  var log = new Log({x: logx, y: logy});
  arrLogsUp.push(log);
  logy -= 256;
}

// Set direction and speed of logs, leave first set at default
for (var i = 0; i < 3; i++) {
  arrLogsDown2[i].setDirection(true);
  arrLogsDown2[i].setSpeed(12);
  arrLogsUp[i].setDirection(false);
  arrLogsUp[i].setSpeed(10);

}

var allLogs = arrLogsDown.concat(arrLogsUp);
allLogs = allLogs.concat(arrLogsDown2);

var entities = new EntityManager(canvas.width, canvas.height, 64);

entities.addEntity(player);
entities.addEntity(carDown);
entities.addEntity(carUp);
entities.addEntity(carDown2);
entities.addEntity(carUp2);

var image = new Image();
image.src = "./assets/background.png";

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  if (!gameIsOver) {
    setTimeout(function() {
      game.loop(timestamp);
    }, 1000/16);
  }

  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  // Update cars
  for (var i = 0; i < 2; i++) {
    carsDown[i].update(elapsedTime);
    carsUp[i].update(elapsedTime);
    carsDown[i].isOffCanvas();
    carsUp[i].isOffCanvas();
  }

  // Update logs
  for (var i = 0; i < allLogs.length; i++) {
    allLogs[i].update(elapsedTime);
    allLogs[i].isOffCanvas();
  }

  // Update player
  player.update(elapsedTime);

  checkForCollisions();

  if (player.reachedEnd()) {
    score += 100;
    resetPlayerPosition();
    increaseLevelSpeed();
  }

  player.checkOnLog(allLogs);

  if (player.state == "idle" && (player.x >= 512  && player.x < 704)) {
    resetPlayerPosition();
    lives--;
  }

}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.drawImage(image, 0, 0);
  entities.renderCells(ctx);

  // Render objects
  for (var i = 0; i < 2; i++) {
    carsDown[i].render(elapsedTime, ctx);
    carsUp[i].render(elapsedTime, ctx);
  }
  for (var i = 0; i < allLogs.length; i++) {
    allLogs[i].render(elapsedTime, ctx);
  }
  player.render(elapsedTime, ctx);
  trackLevel();
  trackScore();
  trackLives();

  if (lives == 0) {
    isGameOver();
  }
  }

/**
  * @function checkForCollisions
  */
function checkForCollisions() {
  // Update collisions
  entities.updateEntity(player);
  entities.updateEntity(carDown);
  entities.updateEntity(carDown2);
  entities.updateEntity(carUp);
  entities.updateEntity(carUp2);
  entities.collide(function(entity1, entity2) {
    lives--;
    resetPlayerPosition();
  });
}

/**
  * @function trackLevel()
  * Tracks current level
  */
function trackLevel() {
  ctx.font = "bold 16px Arial";
  ctx.fillStyle = "white";
  var levelText = "Level: " + (level + 1);
  ctx.fillText(levelText, 10, 20);
}

/**
  * @function trackScore
  * Track current score
  */
function trackScore() {
  ctx.font = "bold 16px Arial";
  ctx.fillStyle = "white";
  var scoreText = "Score: " + score;
  ctx.fillText(scoreText, 10, 40);
}

/**
  * @function trackLives
  * Track current lives
  */
function trackLives() {
  ctx.font = "bold 16px Arial";
  ctx.fillStyle = "red";
  var livesText = "Lives: " + lives;
  ctx.fillText(livesText, 10, 60);
}

/**
  * @function increaseLevelSpeed
  * Increase speed of game objects
  */
function increaseLevelSpeed() {
  level++;

  // Increase car spped
  for (var i = 0; i < 2; i++) {
    var curCarDownSpeed = carsDown[i].speed;
    var curCarUpSpeed = carsUp[i].speed;
    carsDown[i].setSpeed(curCarDownSpeed + level);
    carsUp[i].setSpeed(curCarUpSpeed + level);
  }

  for (var i = 0; i < allLogs.length; i++) {
    var logSpeed = allLogs[i].speed;
    allLogs[i].setSpeed(logSpeed + level);
  }
}

/**
  * @function resetPlayerPosition
  */
function resetPlayerPosition() {
  player.x = 0;
  player.y = 320;
}

/**
  * @function isGameOver
  */
function isGameOver() {
  if (lives == 0) {
    gameIsOver = true;
    lives = 0;
    trackLives();
    player.x = -64;
    player.y = -64;

    ctx.font = "bold 16px Arial";
    ctx.fillStyle = "white";
    var message = "Game Over! Click anywhere to Restart";
    ctx.fillText(message, 240, 240);
  }
}

document.onkeydown = function(event) {
  switch (event.keyCode) {
    case 13:
      if (gameIsOver == true) {
        gameIsOver = false;
        player.x = 0;
        player.y = 320;
        setTimeout(function() {
          game.loop(timestamp);
        }, 1000/16);
      }
      break;
    default:

  }
}
