import { Entity } from './Entity.js';
import { Size } from './Size.js';
import { Resources } from './Resources.js';
import { DebugInfo } from './DebugInfo.js';
export class Stopper extends Entity {
    constructor(pos) {
        super(pos, new Size(1.0, 0.3), new Size(1.0, 1.0));
        this.setImage(Resources.STOPPER);
        this.setDistFromFloor(0.5);
    }
    update(_dt) { }
    render(ctx) {
        if (DebugInfo.debug)
            super.render(ctx);
    }
    collideEntity(ent, side, dist) { }
    isSolid() { return false; }
}
