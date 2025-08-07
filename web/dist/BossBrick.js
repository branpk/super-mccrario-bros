import { Tile } from './Tile.js';
import { Resources } from './Resources.js';
import { DebugInfo } from './DebugInfo.js';
import { Screen } from './Screen.js';
export class BossBrick extends Tile {
    constructor() {
        super();
        this.exists = false;
        this.setImage(Resources.SURFACEBLOCK);
    }
    setExists(exists) { this.exists = exists; }
    render(ctx) {
        if (this.exists)
            super.render(ctx);
        if (DebugInfo.debug) {
            super.render(ctx);
            ctx.strokeStyle = 'red';
            ctx.lineWidth = 1 / Screen.PIXELS_IN_WORLD;
            ctx.strokeRect(0, 0, 1, 1);
        }
    }
    isSolid() { return this.exists; }
}
