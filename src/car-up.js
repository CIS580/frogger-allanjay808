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
