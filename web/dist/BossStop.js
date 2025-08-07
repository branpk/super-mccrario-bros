import { Tile } from './Tile.js';
import { DebugInfo } from './DebugInfo.js';
import { Screen } from './Screen.js';
export class BossStop extends Tile {
    render(ctx) {
        if (DebugInfo.debug) {
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 1 / Screen.PIXELS_IN_WORLD;
            ctx.strokeRect(0, 0, 1, 1);
        }
    }
    isSolid() { return false; }
}
