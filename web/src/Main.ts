import { Game } from './Game.js';
import { Speedrun } from './Speedrun.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  Speedrun.init();
  const game = new Game(canvas);
  game.start();
});
