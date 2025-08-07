import { Tile } from './Tile.js';
import { Resources } from './Resources.js';
import { DebugInfo } from './DebugInfo.js';
export class BrokenBrick extends Tile {
    constructor() {
        super();
        this.BREAKTIME = 0.75;
        this.broken = 0;
        this.breaking = false;
        this.halfway = false;
        this.setImage(Resources.BROKENBRICK0);
    }
    startBreaking() {
        if (!this.breaking) {
            this.setImage(Resources.BROKENBRICK1);
        }
        this.breaking = true;
    }
    update(dt) {
        if (this.breaking)
            this.broken += dt;
        if (this.broken > this.BREAKTIME / 2 && !this.halfway) {
            this.setImage(Resources.BROKENBRICK2);
            this.halfway = true;
        }
    }
    render(ctx) {
        if (DebugInfo.debug || this.broken < this.BREAKTIME)
            super.render(ctx);
    }
    isSolid() {
        return this.broken < this.BREAKTIME;
    }
}
