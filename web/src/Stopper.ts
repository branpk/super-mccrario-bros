import { Entity } from './Entity.js';
import { Vector } from './Vector.js';
import { Size } from './Size.js';
import { Resources } from './Resources.js';
import { DebugInfo } from './DebugInfo.js';

export class Stopper extends Entity {
  constructor(pos: Vector) {
    super(pos, new Size(1.0,0.3), new Size(1.0,1.0));
    this.setImage(Resources.STOPPER);
    this.setDistFromFloor(0.5);
  }

  update(_dt: number) {}

  render(ctx: CanvasRenderingContext2D) {
    if (DebugInfo.debug) super.render(ctx);
  }

  collideEntity(ent: Entity, side: any, dist: number) {}

  isSolid(): boolean { return false; }
}
