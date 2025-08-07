export class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    set(x, y) {
        this.x = x;
        this.y = y;
    }
    static add(a, b) {
        return new Vector(a.x + b.x, a.y + b.y);
    }
    static sub(a, b) {
        return new Vector(a.x - b.x, a.y - b.y);
    }
    static mul(a, b) {
        return new Vector(a.x * b, a.y * b);
    }
    static div(a, b) {
        return new Vector(a.x / b, a.y / b);
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
    }
    mulSelf(s) {
        this.x *= s;
        this.y *= s;
    }
    divSelf(s) {
        this.x /= s;
        this.y /= s;
    }
    static dot(a, b) {
        return a.x * b.x + a.y * b.y;
    }
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    sqrMag() {
        return this.x * this.x + this.y * this.y;
    }
    static unit(v) {
        const m = v.mag();
        return m === 0 ? new Vector(0, 0) : Vector.div(v, m);
    }
    normalize() {
        const m = this.mag();
        if (m !== 0)
            this.divSelf(m);
    }
    static perpL(v) {
        return new Vector(-v.y, v.x);
    }
    static perpR(v) {
        return new Vector(v.y, -v.x);
    }
    static neg(v) {
        return new Vector(-v.x, -v.y);
    }
    negate() {
        this.x = -this.x;
        this.y = -this.y;
    }
}
