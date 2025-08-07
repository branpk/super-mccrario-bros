import { Entity } from './Entity.js';
import { Vector } from './Vector.js';
import { Size } from './Size.js';
import { Resources } from './Resources.js';
import { DebugInfo } from './DebugInfo.js';

export class Checkpoint extends Entity {
  constructor(pos: Vector) {
    super(pos, new Size(1.0,2.0), new Size(1.0,2.0));
    this.setImage(Resources.CHECKPOINT);
  }

  update(_dt:number) {}

  render(ctx: CanvasRenderingContext2D) {
    if (DebugInfo.debug) super.render(ctx);
  }

  collidesWithEntity(_ent: Entity): boolean { return false; }
  collidesWithTile(_tile: any): boolean { return false; }
  isSolid(): boolean { return false; }
}
