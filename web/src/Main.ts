import { Game } from './Game.js';
import { Speedrun } from './Speedrun.js';
import { Leaderboard } from './Leaderboard.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById('game') as HTMLCanvasElement;
  Speedrun.init();
  void Leaderboard.init();
  const game = new Game(canvas);
  game.start();
});
