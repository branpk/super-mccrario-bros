import { Resources } from './Resources.js';
import { Screen } from './Screen.js';
import { GameLoop } from './GameLoop.js';
import { Level } from './Level.js';
import { Input } from './Input.js';

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

    this.runLevel('1-1', 0);
  }

  private async runLevel(name: string, checkpoint: number) {
    const level = await Level.load(name, checkpoint);
    this.screen.setLevel(level);
    // Audio temporarily disabled
    this.loop.play(level, async () => {
      if (level.didWin()) {
        const next = Game.nextLevelName(level.getName());
        if (next) {
          await this.runLevel(next, 0);
        } else {
          this.screen.showLogo(true);
          this.screen.repaint();
          await new Promise(r => setTimeout(r, 3000));
          this.screen.showLogo(false);
          Game.stop();
        }
      } else {
        await this.runLevel(level.getName(), level.getCheckpoint());
      }
    });
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
