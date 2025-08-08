import { Resources } from './Resources.js';
import { Screen } from './Screen.js';
import { GameLoop } from './GameLoop.js';
import { Level } from './Level.js';
import { Input } from './Input.js';
import { Speedrun } from './Speedrun.js';

export class Game {
  private screen: Screen;
  private loop: GameLoop;

  constructor(private canvas: HTMLCanvasElement) {
    this.screen = new Screen(canvas);
    this.loop = new GameLoop(this.screen);
  }

  async start() {
    await Resources.load();

    Input.init(this.canvas);
    this.screen.showLogo(true);
    this.screen.repaint();
    await new Promise(r => setTimeout(r, 3000));
    this.screen.showLogo(false);

      Speedrun.reset();
      this.runLevel('1-1', 0);
  }

    private async runLevel(name: string, checkpoint: number, restart = false) {
      if (!restart) Speedrun.startLevel(Game.levelIndex(name));
      const level = await Level.load(name, checkpoint);
      level.switchDebugMode();
      this.screen.setLevel(level);
      // Audio temporarily disabled
      this.loop.play(level, async () => {
        if (level.didWin()) {
          Speedrun.finishLevel();
          const next = Game.nextLevelName(level.getName());
          if (next) {
            await this.runLevel(next, 0);
          } else {
            Speedrun.finishGame();
            this.screen.showLogo(true);
            this.screen.repaint();
            await new Promise(r => setTimeout(r, 3000));
            this.screen.showLogo(false);
            Game.stop();
          }
        } else {
          await this.runLevel(level.getName(), level.getCheckpoint(), true);
        }
      });
    }

    private static levelIndex(name: string): number {
      switch (name) {
        case '1-1':
          return 0;
        case '1-2':
          return 1;
        case '1-3':
          return 2;
        case '1-4':
          return 3;
        case '1-B':
          return 4;
        default:
          return -1;
      }
    }

  private static nextLevelName(current: string): string | null {
    const [worldStr, levelStr] = current.split('-');
    const world = parseInt(worldStr, 10);
    let lvl = levelStr === 'B' ? 5 : parseInt(levelStr, 10);
    lvl++;
    if (lvl > 5) return null;
    return `${world}-${lvl === 5 ? 'B' : lvl}`;
  }

  static stop() {
    // audio disabled
  }
}
