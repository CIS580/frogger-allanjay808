(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
var game;
var gameOver = false;
var score;
var lives;
var level;
var carDown;
var carDown2;
var carUp;
var carUp2;
var player;

var carsDown = [];
var carsUp = [];

var arrLogsDown = [];
var arrLogsDown2 = [];
var arrLogsUp = [];

var allLogs;

var entities;


  // game = new Game(canvas, update, render);
  //
  // carDown = new CarDown({x: 128, y: -128});
  // carDown2 = new CarDown({x: 320, y: -128});
  // carUp = new CarUp({x: 192, y: 640});
  // carUp2 = new CarUp({x: 384, y: 640});
  // player = new Player({x: 0, y: 320});
  //
  // carDown2.setSpeed(18);
  // carUp2.setSpeed(20);
  //
  // carsDown.push(carDown);
  // carsDown.push(carDown2);
  // carsUp.push(carUp);
  // carsUp.push(carUp2);
  //
  // score = 0;
  // lives = 3;
  // level = 0;
  //
  // // Create first set of logs going down
  // var logx = 512;
  // var logy = -128;
  // for (var i = 0; i < 3; i++) {
  //   var log = new Log({x: logx, y: logy});
  //   arrLogsDown.push(log);
  //   logy += 256;
  // }
  //
  // // Create second set of logs going down
  // logx = 640;
  // logy = -128;
  // for (var i = 0; i < 3; i++) {
  //   var log = new Log({x: logx, y: logy});
  //   arrLogsDown2.push(log);
  //   logy += 256;
  // }
  //
  // // Create set of logs going up
  // logx = 576;
  // logy = 640;
  // for (var i = 0; i < 3; i++) {
  //   var log = new Log({x: logx, y: logy});
  //   arrLogsUp.push(log);
  //   logy -= 256;
  // }
  //
  // // Set direction and speed of logs, leave first set at default
  // for (var i = 0; i < 3; i++) {
  //   arrLogsDown2[i].setDirection(true);
  //   arrLogsDown2[i].setSpeed(12);
  //   arrLogsUp[i].setDirection(false);
  //   arrLogsUp[i].setSpeed(10);
  // }
  //
  // allLogs = arrLogsDown.concat(arrLogsUp);
  // allLogs = allLogs.concat(arrLogsDown2);
  //
  // entities = new EntityManager(canvas.width, canvas.height, 64);
  //
  // entities.addEntity(player);
  // entities.addEntity(carDown);
  // entities.addEntity(carUp);
  // entities.addEntity(carDown2);
  // entities.addEntity(carUp2);

var image = new Image();
image.src = "./assets/background.png";

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  if (!gameOver) {
    setTimeout(function() {
      game.loop(timestamp);
    }, 1000/16);
  }

  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

function initialize() {

  game = new Game(canvas, update, render);

  carDown = new CarDown({x: 128, y: -128});
  carDown2 = new CarDown({x: 320, y: -128});
  carUp = new CarUp({x: 192, y: 640});
  carUp2 = new CarUp({x: 384, y: 640});
  player = new Player({x: 0, y: 320});

  carDown2.setSpeed(18);
  carUp2.setSpeed(20);

  carsDown.push(carDown);
  carsDown.push(carDown2);
  carsUp.push(carUp);
  carsUp.push(carUp2);

  score = 0;
  lives = 3;
  level = 0;

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

  allLogs = arrLogsDown.concat(arrLogsUp);
  allLogs = allLogs.concat(arrLogsDown2);

  entities = new EntityManager(canvas.width, canvas.height, 64);

  entities.addEntity(player);
  entities.addEntity(carDown);
  entities.addEntity(carUp);
  entities.addEntity(carDown2);
  entities.addEntity(carUp2);
}
initialize();

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {

  if (isGameOver()) {
    gameOver = true;
    return true;
  }

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

  if (gameOver) {
    displayGameOver();
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
  if (lives == -1) {
    lives = 0;
    trackLives();
    player.x = -64;
    player.y = -64;
    return true;
  }
}

/**
  * @function displayGameOver
  */
function displayGameOver() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 48px Arial";
  ctx.fillStyle = "red";
  var gameOverText = "Game Over!";
  var scoreText = "Score: " + score;
  var gameOverHelp = "Press 'Enter' to restart";
  ctx.fillText(gameOverText, 260, 300);
  ctx.fillText(scoreText, 280, 350);
  ctx.font = "bold 32px Arial";
  ctx.fillText(gameOverHelp, 220, 390);

}

// Restart game if game is over
document.onkeydown = function(event) {
  // Enter key
  switch (event.keyCode) {
    case 13:
      if (gameOver == true) {
        console.log('Enter');
        carsDown = [];
        carsUp = [];

        arrLogsDown = [];
        arrLogsDown2 = [];
        arrLogsUp = [];

        player.x = 0;
        player.y = 320;
        gameOver = false;
        initialize();
        masterLoop(performance.now());
        break;

      }
  }
}

},{"./car-down.js":2,"./car-up.js":3,"./entity-manager.js":4,"./game.js":5,"./log.js":6,"./player.js":7}],2:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/16;

/**
 * @module exports the CarDown class
 */
module.exports = exports = CarDown;

/**
 * @constructor CarDown
 * Creates a new CarDown object
 * @param {Postition} position object specifying an x and y
 */
 function CarDown(position) {
   this.state = "moving";
   this.x = position.x;
   this.y = position.y;
   this.width  = 64;
   this.height = 128;
   this.spritesheet  = new Image();
   this.spritesheet.src = encodeURI('assets/car-down.png');
   this.timer = 0;
   this.frame = 0;
   this.speed = 14;
 }

 /**
  * @function updates the CarDown object
  * {DOMHighResTimeStamp} time the elapsed time since the last frame
  */
CarDown.prototype.update = function(time) {
  switch (this.state) {
    case "moving" :
      this.timer += time;
      if (this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.y += this.speed;
      }
      break;
  }
}

/**
 * @function renders the CarDown into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
 CarDown.prototype.render = function(time, ctx) {
   ctx.drawImage(
     // image
     this.spritesheet,
     // source rectangle
     0, 0, this.width, this.height,
     // destination rectangle
     this.x, this.y, this.width, this.height
   );
 }

 CarDown.prototype.isOffCanvas = function() {
   if (this.y > 640) {
     this.y = -128;
   }
 }

 CarDown.prototype.setSpeed = function(speed) {
   this.speed = speed;
 }

},{}],3:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/16;

/**
 * @module exports the CarUp class
 */
module.exports = exports = CarUp;

/**
 * @constructor CarUp
 * Creates a new CarUp object
 * @param {Postition} position object specifying an x and y
 */
 function CarUp(position) {
   this.state = "moving";
   this.x = position.x;
   this.y = position.y;
   this.width  = 64;
   this.height = 128;
   this.spritesheet  = new Image();
   this.spritesheet.src = encodeURI('assets/car-up.png');
   this.timer = 0;
   this.frame = 0;
   this.speed = 16;
 }

 /**
  * @function updates the CarUp object
  * {DOMHighResTimeStamp} time the elapsed time since the last frame
  */
CarUp.prototype.update = function(time) {
  switch (this.state) {
    case "moving" :
      this.timer += time;
      if (this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.y -= this.speed;
      }
      break;
  }
}

/**
 * @function renders the CarUp into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
 CarUp.prototype.render = function(time, ctx) {
   ctx.drawImage(
     // image
     this.spritesheet,
     // source rectangle
     0, 0, this.width, this.height,
     // destination rectangle
     this.x, this.y, this.width, this.height
   );
 }


 CarUp.prototype.isOffCanvas = function() {
   if (this.y < -128) {
     this.y = 640;
   }
 }

 CarUp.prototype.setSpeed = function(speed) {
   this.speed = speed;
 }

},{}],4:[function(require,module,exports){
module.exports = exports = EntityManager;

function EntityManager(width, height, cellSize) {
  this.cellSize = cellSize;
  this.widthInCells = Math.ceil(width / cellSize);
  this.heightInCells = Math.ceil(height / cellSize);
  this.cells = [];
  this.numberOfCells = this.widthInCells * this.heightInCells;
  for(var i = 0; i < this.numberOfCells; i++) {
    this.cells[i] = [];
  }
  this.cells[-1] = [];
}

function getIndex(x, y) {
  var x = Math.floor(x / this.cellSize);
  var y = Math.floor(y / this.cellSize);
  if(x < 0 ||
     x >= this.widthInCells ||
     y < 0 ||
     y >= this.heightInCells
  ) return -1;
  return y * this.widthInCells + x;
}

EntityManager.prototype.addEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  this.cells[index].push(entity);
  entity._cell = index;
}

EntityManager.prototype.updateEntity = function(entity){
  var index = getIndex.call(this, entity.x, entity.y);
  // If we moved to a new cell, remove from old and add to new
  if(index != entity._cell) {
    var cellIndex = this.cells[entity._cell].indexOf(entity);
    if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
    this.cells[index].push(entity);
    entity._cell = index;
  }
}

EntityManager.prototype.removeEntity = function(entity) {
  var cellIndex = this.cells[entity._cell].indexOf(entity);
  if(cellIndex != -1) this.cells[entity._cell].splice(cellIndex, 1);
  entity._cell = undefined;
}

EntityManager.prototype.collide = function(callback) {
  var self = this;
  this.cells.forEach(function(cell, i) {
    // test for collisions
    cell.forEach(function(entity1) {
      // check for collisions with cellmates
      cell.forEach(function(entity2) {
        if(entity1 != entity2) checkForCollision(entity1, entity2, callback);

        // check for collisions in cell to the right
        if(i % (self.widthInCells - 1) != 0) {
          self.cells[i+1].forEach(function(entity2) {
            checkForCollision(entity1, entity2, callback);
          });
        }

        // check for collisions in cell below
        if(i < self.numberOfCells - self.widthInCells) {
          self.cells[i+self.widthInCells].forEach(function(entity2){
            checkForCollision(entity1, entity2, callback);
          });
        }

        // check for collisions diagionally below and right
        if(i < self.numberOfCells - self.withInCells && i % (self.widthInCells - 1) != 0) {
          self.cells[i+self.widthInCells + 1].forEach(function(entity2){
            checkForCollision(entity1, entity2, callback);
          });
        }
      });
    });
  });
}

function checkForCollision(entity1, entity2, callback) {
  var collides = !(entity1.x + entity1.width - 1 < entity2.x ||
                   entity1.x > entity2.x + entity2.width - 1 ||
                   entity1.y + entity1.height - 1 < entity2.y ||
                   entity1.y > entity2.y + entity2.height - 1);
  if(collides) {
    callback(entity1, entity2);
  }
}

EntityManager.prototype.renderCells = function(ctx) {
  for(var x = 0; x < this.widthInCells; x++) {
    for(var y = 0; y < this.heightInCells; y++) {
      // ctx.strokeStyle = '#333333';
      // ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
    }
  }
}

},{}],5:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],6:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/16;

/**
 * @module exports the Log class
 */
module.exports = exports = Log;

/**
 * @constructor Log
 * Creates a new Log object
 * @param {Postition} position object specifying an x and y
 */
 function Log(position) {
   this.state = "moving";
   this.x = position.x;
   this.y = position.y;
   this.width  = 64;
   this.height = 128;
   this.spritesheet  = new Image();
   this.spritesheet.src = encodeURI('assets/log.png');
   this.timer = 0;
   this.frame = 0;
   this.speed = 8;
   this.up = true;
 }

 /**
  * @function updates the Log object
  * {DOMHighResTimeStamp} time the elapsed time since the last frame
  */
Log.prototype.update = function(time) {
  switch (this.state) {
    case "moving" :
      this.timer += time;
      if (this.timer > MS_PER_FRAME) {
        this.timer = 0;
        if (this.up) {
          this.y -= this.speed;
        } else this.y += this.speed;
      }
      break;
  }
  this.color = '#000000';
}

/**
 * @function renders the Log into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
 Log.prototype.render = function(time, ctx) {
   ctx.drawImage(
     // image
     this.spritesheet,
     // source rectangle
     0, 0, this.width, this.height,
     // destination rectangle
     this.x, this.y, this.width, this.height
   );
   ctx.strokeStyle = this.color;
   ctx.strokeRect(this.x, this.y, this.width, this.height);
 }

  Log.prototype.isOffCanvas = function() {
    if (this.up) {
      if (this.y < -128) {
        this.y = 640;
      }
    } else {
      if (this.y > 640) {
        this.y = -128;
      }
    }
  }

  Log.prototype.setDirection = function(direction) {
    this.up = direction;
  }

  Log.prototype.setSpeed = function(speed) {
    this.speed = speed;
  }

},{}],7:[function(require,module,exports){
"use strict";

const MS_PER_FRAME = 1000/16;
const jumpDistance = 16;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position) {
  this.state = "idle";
  this.x = position.x;
  this.y = position.y;
  this.width  = 64;
  this.height = 64;
  this.spritesheet  = new Image();
  this.spritesheet.src = encodeURI('assets/PlayerSprite2.png');
  this.timer = 0;
  this.frame = 0;

  // Manage player direction
  this.up = false;
  this.down = false;
  this.left = false;
  this.right = false;

  this.logDirUp = true;
  this.yspeed = 0;
  self = this;
}

window.onkeydown = function(event) {
  if (self.state == "hopping") {
    // Can't move in middle of hop, he is not a super frog
    return;
  }
  switch (event.keyCode) {
    // Right
    case 68:
      self.right = true;
      isHopping();
      break;
    // Left
    case 65:
      self.left = true;
      isHopping();
      break;
    // Up
    case 87:
      self.up = true;
      isHopping();
      break;
    // Down
    case 83:
      self.down = true;
      isHopping();
      break;
  }
}

function isHopping() {
  self.frame = 0;
  self.state = "hopping";
  self.yspeed = 0;
}

/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  switch(this.state) {
    case "idle":
      resetDirection();
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
    case "hopping":

      this.timer += time;

      if (this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame++;
        move();
      }

      if (this.frame > 3) {
        this.timer = 0;
        this.frame = 0;
        this.state = "idle";
      }

      break;
    case "onLog" :

      if (this.logDirUp) {
        this.y -= this.yspeed;
      } else {
        this.y += this.yspeed;
      }

      this.timer += time;

      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  switch(this.state) {
    case "onLog" :
    case "idle" :
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    case "hopping" :
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 0, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;

  }
}

/**
  * @function checkOnLog
  * Check if player is on a log
  */
Player.prototype.checkOnLog = function(allLogs) {
  for (var i = 0; i < allLogs.length; i++) {
    var logX = allLogs[i].x;
    var logY = allLogs[i].y;
    var logDirection = allLogs[i].up;
    var logSpeed = allLogs[i].speed;
    if (this.x == logX && (this.y >= (logY - 48) && this.y <= (logY + 80)) && this.state != "hopping") {
      this.state = "onLog";
      this.logDirUp = logDirection;
      this.yspeed = logSpeed / 4;
      break;
    }
  }
}

/**
  * @function Check if player reaches end
  */
Player.prototype.reachedEnd = function() {
  if ((this.x + this.width) > 760) {
    return true;
  }
}

function move() {
  if (self.right) {
    self.x += jumpDistance;
  } else if (self.left) {
    self.x -= jumpDistance;
  } else if (self.up) {
    self.y -= jumpDistance;
  } else if (self.down) {
    self.y += jumpDistance;
  }
}

function resetDirection() {
  self.right = false;
  self.left = false;
  self.up = false;
  self.down = false;
}

},{}]},{},[1]);
