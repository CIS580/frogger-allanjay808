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
