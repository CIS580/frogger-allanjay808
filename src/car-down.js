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
  this.color = '#000000';
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
   ctx.strokeStyle = this.color;
   ctx.strokeRect(this.x, this.y, this.width, this.height);
 }

 CarDown.prototype.isOffCanvas = function() {
   if (this.y > 640) {
     this.y = -128;
   }
 }

 CarDown.prototype.setSpeed = function(speed) {
   this.speed = speed;
 }
