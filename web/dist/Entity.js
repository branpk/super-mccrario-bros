import { Vector } from './Vector.js';
import { Direction } from './Direction.js';
import { Physics } from './Physics.js';
import { Screen } from './Screen.js';
export class Entity {
    constructor(pos, hitSize, imageSize, vel) {
        this.distFromFloor = 0;
        this.distFromLeft = 0;
        this.facing = 1;
        this.onGround = false;
        this.alive = true;
        this.dying = false;
        this.pos = pos.clone();
        this.hitSize = hitSize.clone();
        this.imageSize = imageSize.clone();
        this.vel = vel ? vel.clone() : new Vector(0, 0);
        this.accelVec = new Vector(0, 0);
    }
    update(dt) {
        this.accelVec.y -= Physics.GRAVITY;
        if (this.accelVec.x === 0)
            this.vel.x -= this.vel.x * dt / 0.1;
        if (this.accelVec.y === 0)
            this.vel.y -= this.vel.y * dt / 0.1;
        this.vel.add(Vector.mul(this.accelVec, dt));
        if (this.vel.y < Physics.TERM_VEL)
            this.vel.y = Physics.TERM_VEL;
        this.pos.add(Vector.mul(this.vel, dt));
        this.accelVec.set(0, 0);
        this.onGround = false;
    }
    move(dt) {
        this.pos.add(Vector.mul(this.vel, dt));
    }
    render(ctx) {
        if (!this.image)
            return;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.translate(this.hitSize.w / 2, 0);
        ctx.translate(-this.imageSize.w / 2, this.imageSize.h);
        ctx.translate(0, -this.distFromFloor);
        ctx.translate(-this.distFromLeft * this.facing, 0);
        if (this.facing < 0) {
            ctx.translate(this.imageSize.w, 0);
            ctx.scale(-this.imageSize.w, -this.imageSize.h);
        }
        else {
            ctx.scale(this.imageSize.w, -this.imageSize.h);
        }
        ctx.drawImage(this.image, 0, 0, 1, 1);
        ctx.restore();
    }
    renderHitBox(ctx) {
        ctx.save();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1 / Screen.PIXELS_IN_WORLD;
        ctx.strokeRect(this.pos.x, this.pos.y, this.hitSize.w, this.hitSize.h);
        ctx.restore();
    }
    collideTile(side, dist) {
        switch (side) {
            case Direction.UP:
                this.pos.y += dist;
                if (this.vel.y > 0)
                    this.vel.y = 0;
                break;
            case Direction.DOWN:
                this.pos.y += dist;
                if (this.vel.y < 0)
                    this.vel.y = 0;
                break;
            case Direction.LEFT:
                this.pos.x += dist;
                if (this.vel.x < 0)
                    this.vel.x = 0;
                break;
            case Direction.RIGHT:
                this.pos.x += dist;
                if (this.vel.x > 0)
                    this.vel.x = 0;
                break;
        }
        if (side === Direction.DOWN)
            this.onGround = true;
    }
    collideEntity(ent, side, dist) {
        this.collideTile(side, dist);
    }
    maybeDie(ent, side) {
        this.die();
    }
    die() { this.dying = true; }
    dieInstantly() { this.dying = false; this.alive = false; }
    playDeathAnimation(dt) { this.dieInstantly(); }
    miraculouslyRecover() { this.alive = true; this.dying = false; }
    lethalCliff(side, dist) { }
    fly() { this.accel(new Vector(0, Physics.GRAVITY)); }
    accel(v) { this.accelVec.add(v); }
    isOnGround() { return this.onGround; }
    collidesWithTile(tile) { return tile.isSolid(); }
    collidesWithEntity(ent) { return ent.isSolid(); }
    isSolid() { return true; }
    setFaceDirection(f) { this.facing = f; }
    getPos() { return this.pos.clone(); }
    getVel() { return this.vel.clone(); }
    stop() { this.vel.set(0, 0); }
    getHitSize() { return this.hitSize.clone(); }
    getImageSize() { return this.imageSize.clone(); }
    getFaceDirection() { return this.facing; }
    setImage(img) { this.image = img; }
    setHitSize(size) { this.hitSize = size; }
    setImageSize(size) { this.imageSize = size; }
    setDistFromFloor(d) { this.distFromFloor = d; }
    setDistFromLeft(d) { this.distFromLeft = d; }
    displace(v) { this.pos.add(v); }
    isAlive() { return this.alive; }
    isDying() { return this.dying; }
}
