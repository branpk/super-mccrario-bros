import { Baal } from './Baal.js';
import { Vector } from './Vector.js';
import { Resources } from './Resources.js';
import { Size } from './Size.js';
import { Entity } from './Entity.js';
import { Direction, opposite } from './Direction.js';
import { Player } from './Player.js';

export class SpikeBaal extends Baal {
  constructor(pos: Vector) {
    super(pos);
    this.setImage(Resources.SPIKEBAAL);
    this.setImageSize(new Size(1.2,1.2));
    this.setHitSize(new Size(0.8,0.8));
    this.setDistFromFloor(0.1);
  }

  collideEntity(ent: Entity, side: Direction, dist: number) {
    super.collideEntity(ent, side, dist);
    if (ent instanceof Player) ent.maybeDie(this, opposite(side));
  }

  maybeDie(ent: Entity, side: Direction) {
    ent.maybeDie(this, opposite(side));
  }
}
