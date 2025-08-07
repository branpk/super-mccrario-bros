import { Entity } from './Entity.js';
import { Vector } from './Vector.js';
import { Size } from './Size.js';
import { Resources } from './Resources.js';
import { Input } from './Input.js';
import { Direction } from './Direction.js';

export class Player extends Entity {
  private jumping = false;
  private jumpTime = 0;
  private bouncing = false;
  private bounceTime = 0;
  private deathAnim = 0;

  constructor(pos: Vector) {
    super(pos.clone(), new Size(0.5,0.8), new Size(0.8,1.0));
    this.setImage(Resources.MCCRARIO0);
    this.setDistFromLeft(-0.05);
  }

  update(dt:number) {
    if (this.isDying()) { this.playDeathAnimation(dt); return; }
    const WALK_SPEED = 7.0;
    const WALK_ACCEL = 32.0;
    const JUMP_TIME = 0.15;
    const JUMP_ACCEL = 165.0;
    const BOUNCE_TIME = 0.08;

    let dir = 0;
    if (Input.isKeyDown('KeyA') || Input.isKeyDown('ArrowLeft')) dir -= 1;
    if (Input.isKeyDown('KeyD') || Input.isKeyDown('ArrowRight')) dir += 1;
    if (Math.abs(this.getVel().x) > WALK_SPEED && (dir > 0) === (this.getVel().x > 0)) dir = 0;
    this.accel(new Vector(dir * WALK_ACCEL, 0));
    if (dir !== 0) this.setFaceDirection(dir);

    const jumpKey = Input.isKeyDown('KeyW') || Input.isKeyDown('ArrowUp');
    if (jumpKey && this.isOnGround()) {
      this.bouncing = false;
      this.jumping = true;
      this.jumpTime = 0;
    }
    if (jumpKey && this.bouncing) this.jumping = true;
    if (this.bouncing && this.bounceTime > BOUNCE_TIME) this.bouncing = false;
    if (this.jumping && (!jumpKey || this.jumpTime > JUMP_TIME)) this.jumping = false;

    if (this.jumping || this.bouncing) {
      this.accel(new Vector(0, JUMP_ACCEL));
      this.jumpTime += dt;
      this.bounceTime += dt;
    }

    super.update(dt);
  }

  collideEntity(ent: Entity, side: Direction, dist: number) {
    super.collideEntity(ent, side, dist);
    if (side === Direction.DOWN) {
      this.bouncing = true;
      this.bounceTime = 0;
      ent.maybeDie(this, Direction.UP);
    }
  }

  playDeathAnimation(dt:number) {
    super.update(dt);
    this.deathAnim += dt;
    if (this.deathAnim === dt) {
      this.stop();
    } else if (this.deathAnim < 0.3) {
      this.fly();
      this.accel(new Vector(0,40));
    } else if (this.deathAnim > 2.0) {
      this.dieInstantly();
    }
  }
}
