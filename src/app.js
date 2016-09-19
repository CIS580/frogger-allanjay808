"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');

/* Global variables */
var canvas = document.getElementById('screen');
var ctx = canvas.getContext('2d');
var game = new Game(canvas, update, render);
var player = new Player({x: 0, y: 240})

var image = new Image();
image.src = "./assets/game_background.png";

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
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
  player.update(elapsedTime);
  // TODO: Update the game objects
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  // ctx.fillStyle = "lightblue";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.drawImage(drawImage, 0, 0);
  ctx.drawImage(image,90,130,50,60,10,10,50,60);
  player.render(elapsedTime, ctx);
}
