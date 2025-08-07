import { Vector } from './Vector.js';
import { Size } from './Size.js';
import { Direction } from './Direction.js';
import { Tile } from './Tile.js';
import { Physics } from './Physics.js';
import { Screen } from './Screen.js';

export abstract class Entity {
  private pos: Vector;
  private vel: Vector;
  private accelVec: Vector;
  private hitSize: Size;
  private imageSize: Size;
  private image?: HTMLImageElement;
  private distFromFloor = 0;
  private distFromLeft = 0;
  private facing = 1;
  private onGround = false;
  private alive = true;
  private dying = false;

  constructor(pos: Vector, hitSize: Size, imageSize: Size, vel?: Vector) {
    this.pos = pos.clone();
    this.hitSize = hitSize.clone();
    this.imageSize = imageSize.clone();
    this.vel = vel ? vel.clone() : new Vector(0,0);
    this.accelVec = new Vector(0,0);
  }

  update(dt: number) {
    this.accelVec.y -= Physics.GRAVITY;
    if (this.accelVec.x === 0) this.vel.x -= this.vel.x * dt/0.1;
    if (this.accelVec.y === 0) this.vel.y -= this.vel.y * dt/0.1;
    this.vel.add(Vector.mul(this.accelVec, dt));
    if (this.vel.y < Physics.TERM_VEL) this.vel.y = Physics.TERM_VEL;
    this.pos.add(Vector.mul(this.vel, dt));
    this.accelVec.set(0,0);
    this.onGround = false;
  }

  move(dt:number){
    this.pos.add(Vector.mul(this.vel, dt));
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.image) return;
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.translate(this.hitSize.w/2, 0);
    ctx.translate(-this.imageSize.w/2, this.imageSize.h);
    ctx.translate(0, -this.distFromFloor);
    ctx.translate(-this.distFromLeft * this.facing, 0);
    if (this.facing < 0) {
      ctx.translate(this.imageSize.w, 0);
      ctx.scale(-this.imageSize.w, -this.imageSize.h);
    } else {
      ctx.scale(this.imageSize.w, -this.imageSize.h);
    }
    ctx.drawImage(this.image, 0,0,1,1);
    ctx.restore();
  }

  renderHitBox(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1 / Screen.PIXELS_IN_WORLD;
    ctx.strokeRect(this.pos.x, this.pos.y, this.hitSize.w, this.hitSize.h);
    ctx.restore();
  }

  collideTile(side: Direction, dist: number) {
    switch(side){
      case Direction.UP:
        this.pos.y += dist;
        if (this.vel.y > 0) this.vel.y = 0;
        break;
      case Direction.DOWN:
        this.pos.y += dist;
        if (this.vel.y < 0) this.vel.y = 0;
        break;
      case Direction.LEFT:
        this.pos.x += dist;
        if (this.vel.x < 0) this.vel.x = 0;
        break;
      case Direction.RIGHT:
        this.pos.x += dist;
        if (this.vel.x > 0) this.vel.x = 0;
        break;
    }
    if (side === Direction.DOWN) this.onGround = true;
  }

  collideEntity(ent: Entity, side: Direction, dist: number) {
    this.collideTile(side, dist);
  }

  maybeDie(ent: Entity, side: Direction) {
    this.die();
  }

  die() { this.dying = true; }

  dieInstantly() { this.dying = false; this.alive = false; }

  playDeathAnimation(dt:number) { this.dieInstantly(); }

  miraculouslyRecover(){ this.alive=true; this.dying=false; }

  lethalCliff(side: Direction, dist: number) {}

  fly(){ this.accel(new Vector(0, Physics.GRAVITY)); }

  accel(v: Vector){ this.accelVec.add(v); }

  isOnGround(): boolean { return this.onGround; }

  collidesWithTile(tile: Tile): boolean { return tile.isSolid(); }

  collidesWithEntity(ent: Entity): boolean { return ent.isSolid(); }

  isSolid(): boolean { return true; }

  setFaceDirection(f: number){ this.facing = f; }

  getPos(): Vector { return this.pos.clone(); }
  getVel(): Vector { return this.vel.clone(); }
  stop(){ this.vel.set(0,0); }
  getHitSize(): Size { return this.hitSize.clone(); }
  getImageSize(): Size { return this.imageSize.clone(); }
  getFaceDirection(){ return this.facing; }
  setImage(img: HTMLImageElement){ this.image = img; }
  setHitSize(size: Size){ this.hitSize = size; }
  setImageSize(size: Size){ this.imageSize = size; }
  setDistFromFloor(d:number){ this.distFromFloor = d; }
  setDistFromLeft(d:number){ this.distFromLeft = d; }
  displace(v: Vector){ this.pos.add(v); }
  isAlive(){ return this.alive; }
  isDying(){ return this.dying; }
}
