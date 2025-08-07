import { Entity } from './Entity.js';
import { Vector } from './Vector.js';
import { Size } from './Size.js';
import { Resources } from './Resources.js';
import { Direction, opposite } from './Direction.js';
import { BossStop } from './BossStop.js';

export class BossBaal extends Entity {
  private playerPos: Vector;

  constructor(pos: Vector) {
    super(pos.clone(), new Size(1.0,2.8), new Size(1.5,3.0));
    this.setImage(Resources.BOSSBAAL);
    this.setDistFromFloor(0.1);
    this.setFaceDirection(-1);
    this.playerPos = pos;
  }

  update(dt: number) {
    const dir = Vector.unit(Vector.sub(this.playerPos, this.getPos()));
    let mov = Vector.mul(dir,16.0);
    mov.sub(Vector.mul(this.getVel(),1.5));
    this.accel(mov);
    this.fly();
    super.update(dt);
  }

  setPlayerPos(pos: Vector) {
    this.playerPos = pos;
    if (this.playerPos.x - this.getPos().x < 0)
      this.setFaceDirection(-1);
    else
      this.setFaceDirection(1);
  }

  collideEntity(ent: Entity, side: Direction, dist: number) {
    ent.maybeDie(this, opposite(side));
  }

  maybeDie(ent: Entity, side: Direction) {}

  collidesWithTile(tile: any): boolean {
    return tile instanceof BossStop;
  }
}
