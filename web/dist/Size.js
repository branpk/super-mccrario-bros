import { Vector } from './Vector.js';
export class Size {
    constructor(w, h) {
        this.w = w;
        this.h = h;
    }
    clone() {
        return new Size(this.w, this.h);
    }
    equals(s) {
        return this.w === s.w && this.h === s.h;
    }
    toVector() {
        return new Vector(this.w, this.h);
    }
}
