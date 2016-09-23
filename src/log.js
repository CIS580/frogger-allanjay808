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
