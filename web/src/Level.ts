import { Vector } from './Vector.js';
import { Entity } from './Entity.js';
import { Tile } from './Tile.js';
import { Player } from './Player.js';
import { FlyingPlayer } from './FlyingPlayer.js';
import { Baal } from './Baal.js';
import { SpikeBaal } from './SpikeBaal.js';
import { Baaloon } from './Baaloon.js';
import { Stopper } from './Stopper.js';
import { Checkpoint } from './Checkpoint.js';
import { BossBaal } from './BossBaal.js';
import { ThanksForPlaying } from './ThanksForPlaying.js';
import { Air } from './Air.js';
import { SurfaceBlock } from './SurfaceBlock.js';
import { UndergroundBrick } from './UndergroundBrick.js';
import { GoalTile } from './GoalTile.js';
import { BrokenBrick } from './BrokenBrick.js';
import { GrassBlock } from './GrassBlock.js';
import { BossBrick } from './BossBrick.js';
import { BossStop } from './BossStop.js';
import { Direction } from './Direction.js';
import { Screen } from './Screen.js';
import { Physics } from './Physics.js';
import { DebugInfo } from './DebugInfo.js';
import { Input } from './Input.js';

const TILE_CLASSES = [Air, SurfaceBlock, UndergroundBrick, GoalTile, BrokenBrick, GrassBlock, BossBrick, BossStop];
const ENTITY_CLASSES = [Player, Baal, SpikeBaal, Baaloon, Stopper, Checkpoint, BossBaal, ThanksForPlaying];

type TileConstructor = new () => Tile;
type EntityConstructor = new (pos: Vector) => Entity;

class EntitySeed {
  constructor(public type: EntityConstructor | TileConstructor, public pos: Vector) {}
  instantiate(): Entity { return new (this.type as EntityConstructor)(this.pos.clone()); }
  instantiateAsTile(): Tile { return new (this.type as TileConstructor)(); }
}

export class Level {
  private running = true;
  private won = false;
  private entities: Entity[] = [];
  private tiles: Tile[][] = [];
  private camera = new Vector(0,0);
  private checkpoint: number;
  private name: string;
  private contMode = false;
  private contTime = 0;
  private entitySeeds: EntitySeed[] = [];
  private toSpawn: EntitySeed[] = [];

  private constructor(name: string, checkpoint: number) {
    this.name = name;
    this.checkpoint = checkpoint;
  }

  static async load(name: string, checkpoint: number): Promise<Level> {
    const lvl = new Level(name, checkpoint);
    await lvl.loadLevel(name);
    return lvl;
  }

  private async loadLevel(level: string) {
    const response = await fetch(`resources/levels/${level}.lvl`);
    const buffer = await response.arrayBuffer();
    const view = new DataView(buffer);
    let offset = 0;
    const rows = view.getInt32(offset); offset += 4;
    const cols = view.getInt32(offset); offset += 4;
    this.tiles = Array.from({length: rows}, () => new Array<Tile>(cols));
    for (let r=0;r<rows;r++){
      for (let c=0;c<cols;c++){
        const idx = view.getUint8(offset++);
        const Cls = TILE_CLASSES[idx];
        this.tiles[r][c] = new Cls();
      }
    }
    this.entitySeeds = [];
    while (offset < view.byteLength) {
      const b = view.getInt8(offset++);
      if (b === -1) break;
      const entClass = ENTITY_CLASSES[b];
      const x = view.getFloat32(offset); offset += 4;
      const y = view.getFloat32(offset); offset += 4;
      this.entitySeeds.push(new EntitySeed(entClass as any, new Vector(x,y)));
    }
    this.entities = [];
    this.toSpawn = [...this.entitySeeds];

    // determine spawn point
    let point = new Vector(0,0);
    for (const seed of this.entitySeeds) {
      if (seed.type === Player) { point = seed.pos.clone(); break; }
    }
    let check = 0;
    for (const seed of this.entitySeeds) {
      if (check >= this.checkpoint) break;
      if (seed.type === Checkpoint) { point = seed.pos.clone(); check++; }
    }
    let k = 0;
    for (let i=0; i<this.toSpawn.length && k<check; ++i) {
      if (this.toSpawn[i].type === Checkpoint) { this.toSpawn.splice(i--,1); k++; }
    }
    for (let i=0; i<this.toSpawn.length; ++i) {
      if (this.toSpawn[i].type === Player) {
        this.toSpawn[i] = new EntitySeed(Player, point.clone());
      }
    }
    this.camera = point.clone();
    // spawn initial entities (player)
    this.spawnEntities();
  }

  update(dt:number) {
    if (DebugInfo.debug && Input.isKeyDown('Backspace')) {
      Input.overrideKey('Backspace');
      this.checkpoint = 0;
    }

    if (this.contMode) {
      for (const ent of this.entities) ent.move(dt);
      this.contTime += dt;
      if (this.contTime > 1.0) this.running = false;
      return;
    }

    for (const ent of this.entities) {
      if (ent.isDying()) { ent.playDeathAnimation(dt); continue; }
      ent.update(dt);

      let leftX = Math.floor(ent.getPos().x);
      let rightX = Math.floor(ent.getPos().x + ent.getHitSize().w);
      let downY = Math.floor(ent.getPos().y);
      let upY = Math.floor(ent.getPos().y + ent.getHitSize().h);

      if (leftX < 0) {
        leftX = 0;
        ent.collideTile(Direction.LEFT, -ent.getPos().x);
      }
      if (rightX >= this.tiles[0].length) {
        rightX = this.tiles[0].length - 1;
        ent.collideTile(Direction.RIGHT, this.tiles[0].length - ent.getHitSize().w - ent.getPos().x);
      }
      if (downY < 0) downY = 0;
      if (upY >= this.tiles.length) upY = this.tiles.length - 1;

      if (ent.getVel().x < 0 && leftX < this.tiles[0].length) {
        let isAir = true;
        for (let r=0; r<=upY && r<this.tiles.length; ++r) {
          if (ent.collidesWithTile(this.tiles[r][leftX])) { isAir = false; break; }
        }
        if (isAir) ent.lethalCliff(Direction.LEFT, leftX + 1 - ent.getPos().x);
      } else if (ent.getVel().x > 0 && rightX >= 0) {
        let isAir = true;
        for (let r=0; r<=upY && r<this.tiles.length; ++r) {
          if (ent.collidesWithTile(this.tiles[r][rightX])) { isAir = false; break; }
        }
        if (isAir) ent.lethalCliff(Direction.RIGHT, rightX - ent.getHitSize().w - ent.getPos().x);
      }

      let toCheck = false;
      for (const entB of this.entities) {
        if (toCheck && !entB.isDying()) Physics.checkEntities(ent, entB);
        if (ent instanceof Player && entB instanceof Checkpoint &&
            ent.getPos().x + ent.getHitSize().w > entB.getPos().x &&
            ent.getPos().x < entB.getPos().x + entB.getHitSize().w) {
          this.checkpoint++;
          entB.die();
        }
        if (ent === entB) toCheck = true;
      }

      for (let r=downY; r<=upY; ++r) {
        for (let c=leftX; c<=rightX; ++c) {
          Physics.check(ent, this.tiles, c, r);
          if (ent instanceof Player) {
            const tile = this.tiles[r][c];
            if (tile instanceof GoalTile) { this.contMode = true; this.won = true; }
            else if (tile instanceof BossStop) { this.won = true; }
          }
        }
      }
    }

    for (let i=0; i<this.entities.length; ++i) {
      const ent = this.entities[i];
      if (ent.getPos().y + ent.getImageSize().h < -0.5 && !(ent instanceof BossBaal) && !( (DebugInfo.debug || this.contMode) && ent instanceof Player))
        ent.die();
      if (!ent.isAlive()) {
        if (ent instanceof Player) this.running = false;
        this.entities.splice(i--,1);
      }
    }

    const player = this.entities.find(e => e instanceof Player);
    if (player) {
      const HBUFF = 0.4;
      const VBUFF = 0.3;
      const l = Screen.SCREEN_WIDTH * HBUFF;
      const r = Screen.SCREEN_WIDTH * (1 - HBUFF);
      const d = Screen.SCREEN_HEIGHT * (1 - VBUFF);
      const u = Screen.SCREEN_HEIGHT * VBUFF;

      const ru = Screen.screenToWorld(r, u, this.camera);
      if (player.getPos().x + player.getHitSize().w > ru.x)
        this.camera.x += player.getPos().x + player.getHitSize().w - ru.x;
      if (player.getPos().y + player.getHitSize().h > ru.y)
        this.camera.y += player.getPos().y + player.getHitSize().h - ru.y;

      const dl = Screen.screenToWorld(l, d, this.camera);
      if (player.getPos().x < dl.x)
        this.camera.x += player.getPos().x - dl.x;
      if (player.getPos().y < dl.y)
        this.camera.y += player.getPos().y - dl.y;
    }

    const ru = Screen.screenToWorld(Screen.SCREEN_WIDTH, 0, this.camera);
    if (ru.x >= this.tiles[0].length) this.camera.x -= ru.x - this.tiles[0].length;
    if (ru.y >= this.tiles.length) this.camera.y -= ru.y - this.tiles.length;
    const ld = Screen.screenToWorld(0, Screen.SCREEN_HEIGHT, this.camera);
    if (ld.x < 0) this.camera.x -= ld.x;
    if (ld.y < 0) this.camera.y -= ld.y;

    this.spawnEntities();

    for (const row of this.tiles)
      for (const tile of row)
        if (tile instanceof BrokenBrick) tile.update(dt);

    const bossExists = this.entities.some(e => e instanceof BossBaal);
    for (const row of this.tiles)
      for (const tile of row)
        if (tile instanceof BossBrick) tile.setExists(bossExists);

    if (player)
      for (const ent of this.entities)
        if (ent instanceof BossBaal) ent.setPlayerPos(player.getPos());
  }

  switchDebugMode() {
    for (let i = 0; i < this.entities.length; ++i) {
      const ent = this.entities[i];
      if (DebugInfo.debug && ent instanceof Player) {
        const pos = ent.getPos().clone();
        this.entities[i] = new FlyingPlayer(pos);
      } else if (!DebugInfo.debug && ent instanceof FlyingPlayer) {
        const pos = ent.getPos().clone();
        this.entities[i] = new Player(pos);
      }
    }
  }

  private spawnEntities() {
    for (let i=0; i<this.toSpawn.length; ++i) {
      const ent = this.toSpawn[i].instantiate();
      const entRU = Vector.add(ent.getPos(), ent.getImageSize().toVector());
      if (this.isOnScreen(ent.getPos(), entRU) || ent instanceof Player || ent instanceof Stopper) {
        this.entities.push(ent);
        this.toSpawn.splice(i--,1);
      }
    }
  }

  private isOnScreen(ld: Vector, ru: Vector): boolean {
    const scrLD = Screen.screenToWorld(0, Screen.SCREEN_HEIGHT, this.camera);
    const scrRU = Screen.screenToWorld(Screen.SCREEN_WIDTH, 0, this.camera);
    return ru.x > scrLD.x && ld.x < scrRU.x && ru.y > scrLD.y && ld.y < scrRU.y;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(-this.camera.x, -this.camera.y);
    const ld = Screen.screenToWorld(0, Screen.SCREEN_HEIGHT, this.camera);
    const ru = Screen.screenToWorld(Screen.SCREEN_WIDTH, 0, this.camera);
    const rTile = Math.min(Math.floor(ru.x)+1, this.tiles[0].length);
    const lTile = Math.max(Math.floor(ld.x),0);
    const uTile = Math.min(Math.floor(ru.y)+1, this.tiles.length);
    const dTile = Math.max(Math.floor(ld.y),0);
    ctx.save();
    ctx.translate(lTile, dTile);
    for (let r=dTile;r<uTile;r++){
      ctx.save();
      for (let c=lTile;c<rTile;c++){
        this.tiles[r][c].render(ctx);
        ctx.translate(1,0);
      }
      ctx.restore();
      ctx.translate(0,1);
    }
    ctx.restore();
    for (const ent of this.entities){
      const entLD = ent.getPos();
      const entRU = Vector.add(ent.getPos(), ent.getImageSize().toVector());
      if (entRU.x <= ld.x || entLD.x >= ru.x || entRU.y <= ld.y || entLD.y >= ru.y) continue;
      ctx.save();
      ent.render(ctx);
      if (DebugInfo.debug) ent.renderHitBox(ctx);
      ctx.restore();
    }
    ctx.restore();
  }

  isRunning(){ return this.running; }
  didWin(){ return this.won; }
  getName(){ return this.name; }
  getCheckpoint(){ return this.checkpoint; }
  continueRunning() { this.running = true; }
}
