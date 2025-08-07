import { Entity } from './Entity.js';
import { Vector } from './Vector.js';
import { Size } from './Size.js';
import { Resources } from './Resources.js';
import { Direction, opposite } from './Direction.js';
import { Player } from './Player.js';
export class Baal extends Entity {
    constructor(pos) {
        super(pos.clone(), new Size(0.9, 0.9), new Size(1.0, 1.0));
        this.setImage(Resources.BAAL);
        this.setFaceDirection(-1);
    }
    update(dt) {
        const ROLL_SPEED = 0.4;
        const ROLL_ACCEL = 64.0;
        if (this.getFaceDirection() < 0) {
            if (this.getVel().x > -ROLL_SPEED)
                this.accel(new Vector(-ROLL_ACCEL, 0));
        }
        else {
            if (this.getVel().x < ROLL_SPEED)
                this.accel(new Vector(ROLL_ACCEL, 0));
        }
        super.update(dt);
    }
    collideTile(side, dist) {
        if (side === Direction.LEFT)
            this.setFaceDirection(1);
        else if (side === Direction.RIGHT)
            this.setFaceDirection(-1);
        super.collideTile(side, dist);
    }
    collideEntity(ent, side, dist) {
        super.collideEntity(ent, side, dist);
        if (ent instanceof Player && side !== Direction.UP)
            ent.maybeDie(this, opposite(side));
    }
    maybeDie(ent, side) {
        if (side === Direction.UP)
            this.die();
        else
            ent.maybeDie(this, opposite(side));
    }
    lethalCliff(side, dist) {
        this.collideTile(side, dist);
    }
}
