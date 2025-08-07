import { Entity } from './Entity.js';
import { Vector } from './Vector.js';
import { Size } from './Size.js';
import { Resources } from './Resources.js';

export class ThanksForPlaying extends Entity {
  constructor(pos: Vector) {
    super(pos, new Size(1.0,1.0), new Size(10.0,1.0));
    this.setImage(Resources.THANKS);
  }

  update(_dt:number) {}

  collideEntity(ent: Entity, side: any, dist: number) {}

  isSolid(): boolean { return false; }
}
