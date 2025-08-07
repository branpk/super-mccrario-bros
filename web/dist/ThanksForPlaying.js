import { Entity } from './Entity.js';
import { Size } from './Size.js';
import { Resources } from './Resources.js';
export class ThanksForPlaying extends Entity {
    constructor(pos) {
        super(pos, new Size(1.0, 1.0), new Size(10.0, 1.0));
        this.setImage(Resources.THANKS);
    }
    update(_dt) { }
    collideEntity(ent, side, dist) { }
    isSolid() { return false; }
}
