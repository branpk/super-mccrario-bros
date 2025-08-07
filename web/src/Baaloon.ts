import { Entity } from './Entity.js';
import { Vector } from './Vector.js';
import { Size } from './Size.js';
import { Resources } from './Resources.js';
import { Direction, opposite } from './Direction.js';
import { Player } from './Player.js';
import { Stopper } from './Stopper.js';

export class Baaloon extends Entity {
  private direction = -1;

  constructor(pos: Vector) {
    super(pos.clone(), new Size(0.9,1.0), new Size(1.0,1.3));
    this.setImage(Resources.BAALOON);
    this.setDistFromFloor(0.2);
    this.setFaceDirection(-1);
  }

  update(dt:number){
    const FLY_SPEED = 1.0;
    const FLY_ACCEL = 64.0;
    if (this.direction < 0) {
      if (this.getVel().y > -FLY_SPEED) this.accel(new Vector(0,-FLY_ACCEL));
    } else {
      if (this.getVel().y < FLY_SPEED) this.accel(new Vector(0, FLY_ACCEL));
    }
    this.fly();
    super.update(dt);
  }

  collideTile(side: Direction, dist: number){
    if (side === Direction.DOWN) this.direction = 1;
    else if (side === Direction.UP) this.direction = -1;
    super.collideTile(side, dist);
  }

  collideEntity(ent: Entity, side: Direction, dist: number){
    if (super.collidesWithEntity(ent))
      super.collideEntity(ent, side, dist);
    if (ent instanceof Player && side !== Direction.UP)
      ent.maybeDie(this, opposite(side));
    if (ent instanceof Stopper){
      if (side === Direction.DOWN) this.direction = 1;
      else if (side === Direction.UP) this.direction = -1;
    }
  }

  collidesWithEntity(ent: Entity): boolean {
    return super.collidesWithEntity(ent) || ent instanceof Stopper;
  }

  maybeDie(ent: Entity, side: Direction){
    if (side === Direction.UP) this.die();
    else ent.maybeDie(this, opposite(side));
  }
}
