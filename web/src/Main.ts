import { Game } from './Game.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  const game = new Game(canvas);
  game.start();
});
