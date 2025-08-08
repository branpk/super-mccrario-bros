import { Player } from './Player.js';
import { Vector } from './Vector.js';
import { Input } from './Input.js';
import { Direction } from './Direction.js';
import { DebugInfo } from './DebugInfo.js';

export class FlyingPlayer extends Player {
  private isFlying = false;
  private flyDown = false;

  constructor(pos: Vector) {
    super(pos.clone());
  }

  update(dt:number) {
    if (Input.isKeyDown('KeyF')) {
      if (!this.flyDown) this.isFlying = !this.isFlying;
      this.flyDown = true;
    } else {
      this.flyDown = false;
    }
    if (!this.isFlying) {
      super.update(dt);
      return;
    }

    const FLY_SPEED = 10.0;
    const FLY_ACCEL = 100.0;

    let dir = new Vector(0,0);
    if (Input.isKeyDown('KeyA') || Input.isKeyDown('ArrowLeft')) dir.x -= 1;
    if (Input.isKeyDown('KeyD') || Input.isKeyDown('ArrowRight')) dir.x += 1;
    if (Input.isKeyDown('KeyW') || Input.isKeyDown('ArrowUp')) dir.y += 1;
    if (Input.isKeyDown('KeyS') || Input.isKeyDown('ArrowDown')) dir.y -= 1;
    if (Math.abs(this.getVel().x) >= FLY_SPEED && (dir.x > 0) === (this.getVel().x > 0)) dir.x = 0;
    if (Math.abs(this.getVel().y) >= FLY_SPEED && (dir.y > 0) === (this.getVel().y > 0)) dir.y = 0;
    this.accel(Vector.mul(dir, FLY_ACCEL));
    if (dir.x !== 0) this.setFaceDirection(dir.x);
    this.fly();
    super.update(dt);
  }

  collideTile(side: Direction, dist: number) {
    if (!this.isFlying) super.collideTile(side, dist);
  }

  collidesWithEntity(ent:any): boolean {
    if (this.isFlying) return false;
    return super.collidesWithEntity(ent);
  }

  playDeathAnimation(dt: number) {
    if (DebugInfo.debug) {
      this.miraculouslyRecover();
    } else {
      super.playDeathAnimation(dt);
    }
  }
}
