import { Tile } from './Tile.js';
import { Resources } from './Resources.js';
import { DebugInfo } from './DebugInfo.js';

export class BrokenBrick extends Tile {
  private readonly BREAKTIME = 0.75;
  private broken = 0;
  private breaking = false;
  private halfway = false;

  constructor() {
    super();
    this.setImage(Resources.BROKENBRICK0);
  }

  startBreaking() {
    if (!this.breaking) {
      this.setImage(Resources.BROKENBRICK1);
    }
    this.breaking = true;
  }

  update(dt: number) {
    if (this.breaking) this.broken += dt;
    if (this.broken > this.BREAKTIME / 2 && !this.halfway) {
      this.setImage(Resources.BROKENBRICK2);
      this.halfway = true;
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    if (DebugInfo.debug || this.broken < this.BREAKTIME) super.render(ctx);
  }

  isSolid(): boolean {
    return this.broken < this.BREAKTIME;
  }
}
