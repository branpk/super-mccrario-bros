import { Tile } from './Tile.js';
import { DebugInfo } from './DebugInfo.js';
import { Screen } from './Screen.js';

export class GoalTile extends Tile {
  render(ctx: CanvasRenderingContext2D) {
    if (DebugInfo.debug) {
      ctx.strokeStyle = 'blue';
      ctx.lineWidth = 1 / Screen.PIXELS_IN_WORLD;
      ctx.strokeRect(0, 0, 1, 1);
    }
  }

  isSolid(): boolean { return false; }
}
