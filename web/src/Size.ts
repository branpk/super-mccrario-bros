import { Vector } from './Vector.js';

export class Size {
  constructor(public w: number, public h: number) {}

  clone(): Size {
    return new Size(this.w, this.h);
  }

  equals(s: Size): boolean {
    return this.w === s.w && this.h === s.h;
  }

  toVector(): Vector {
    return new Vector(this.w, this.h);
  }
}
