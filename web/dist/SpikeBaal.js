import { Baal } from './Baal.js';
import { Resources } from './Resources.js';
import { Size } from './Size.js';
import { opposite } from './Direction.js';
import { Player } from './Player.js';
export class SpikeBaal extends Baal {
    constructor(pos) {
        super(pos);
        this.setImage(Resources.SPIKEBAAL);
        this.setImageSize(new Size(1.2, 1.2));
        this.setHitSize(new Size(0.8, 0.8));
        this.setDistFromFloor(0.1);
    }
    collideEntity(ent, side, dist) {
        super.collideEntity(ent, side, dist);
        if (ent instanceof Player)
            ent.maybeDie(this, opposite(side));
    }
    maybeDie(ent, side) {
        ent.maybeDie(this, opposite(side));
    }
}
