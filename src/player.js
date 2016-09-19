"use strict";

const MS_PER_FRAME = 1000/8;

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

  var self = this;
  window.onkeydown = function(event) {
    console.log("Key Down Event: ", event.keyCode);
    console.log("State on Key Down: ", self.state);
    switch (event.keyCode) {
      case 68:
        self.state = "hopping"
        break;
    }
  }

  window.onkeyup = function(event) {
    self.state = "idle";
  }
}




/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {
  console.log("State: ", this.state);
  switch(this.state) {
    case "idle":
      this.timer += time;
      if(this.timer > MS_PER_FRAME) {
        this.timer = 0;
        this.frame += 1;
        if(this.frame > 3) this.frame = 0;
      }
      break;
    // TODO: Implement your player's update by state
    case "hopping":
      this.timer += time;
      if (this.timer > MS_PER_FRAME) {
        this.frame = (this.frame + 1) % 4;
        this.timer = 0;
      }
      this.x += 12;
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
    case "idle":
      // console.log("Spritesheet: ", this.spritesheet);
      console.log("Frame: ", this.frame);
      // console.log("Width: ", this.width);
      // console.log("Height: ", this.height);
      // console.log("X: : ", this.x);
      // console.log("Y: ", this.y);
      ctx.drawImage(
        // image
        this.spritesheet,
        // source rectangle
        this.frame * 64, 64, this.width, this.height,
        // destination rectangle
        this.x, this.y, this.width, this.height
      );
      break;
    // TODO: Implement your player's redering according to state
    case "hopping":
      ctx.drawImage(
        this.spritesheet,
        this.frame * 64, 0, this.width, this.height,
        this.x, this.y, this.width, this.heigth
      );
      break;
  }
}
