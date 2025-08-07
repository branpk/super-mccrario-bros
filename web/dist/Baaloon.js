import { Entity } from './Entity.js';
import { Vector } from './Vector.js';
import { Size } from './Size.js';
import { Resources } from './Resources.js';
import { Direction, opposite } from './Direction.js';
import { Player } from './Player.js';
import { Stopper } from './Stopper.js';
export class Baaloon extends Entity {
    constructor(pos) {
        super(pos.clone(), new Size(0.9, 1.0), new Size(1.0, 1.3));
        this.direction = -1;
        this.setImage(Resources.BAALOON);
        this.setDistFromFloor(0.2);
        this.setFaceDirection(-1);
    }
    update(dt) {
        const FLY_SPEED = 1.0;
        const FLY_ACCEL = 64.0;
        if (this.direction < 0) {
            if (this.getVel().y > -FLY_SPEED)
                this.accel(new Vector(0, -FLY_ACCEL));
        }
        else {
            if (this.getVel().y < FLY_SPEED)
                this.accel(new Vector(0, FLY_ACCEL));
        }
        this.fly();
        super.update(dt);
    }
    collideTile(side, dist) {
        if (side === Direction.DOWN)
            this.direction = 1;
        else if (side === Direction.UP)
            this.direction = -1;
        super.collideTile(side, dist);
    }
    collideEntity(ent, side, dist) {
        if (super.collidesWithEntity(ent))
            super.collideEntity(ent, side, dist);
        if (ent instanceof Player && side !== Direction.UP)
            ent.maybeDie(this, opposite(side));
        if (ent instanceof Stopper) {
            if (side === Direction.DOWN)
                this.direction = 1;
            else if (side === Direction.UP)
                this.direction = -1;
        }
    }
    collidesWithEntity(ent) {
        return super.collidesWithEntity(ent) || ent instanceof Stopper;
    }
    maybeDie(ent, side) {
        if (side === Direction.UP)
            this.die();
        else
            ent.maybeDie(this, opposite(side));
    }
}
