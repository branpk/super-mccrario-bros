import { Entity } from './Entity.js';
import { Size } from './Size.js';
import { Resources } from './Resources.js';
import { DebugInfo } from './DebugInfo.js';
export class Checkpoint extends Entity {
    constructor(pos) {
        super(pos, new Size(1.0, 2.0), new Size(1.0, 2.0));
        this.setImage(Resources.CHECKPOINT);
    }
    update(_dt) { }
    render(ctx) {
        if (DebugInfo.debug)
            super.render(ctx);
    }
    collidesWithEntity(_ent) { return false; }
    collidesWithTile(_tile) { return false; }
    isSolid() { return false; }
}
