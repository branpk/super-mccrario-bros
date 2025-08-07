export class Vector {
  constructor(public x: number, public y: number) {}

  clone(): Vector {
    return new Vector(this.x, this.y);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static add(a: Vector, b: Vector): Vector {
    return new Vector(a.x + b.x, a.y + b.y);
  }

  static sub(a: Vector, b: Vector): Vector {
    return new Vector(a.x - b.x, a.y - b.y);
  }

  static mul(a: Vector, b: number): Vector {
    return new Vector(a.x * b, a.y * b);
  }

  static div(a: Vector, b: number): Vector {
    return new Vector(a.x / b, a.y / b);
  }

  add(v: Vector) {
    this.x += v.x;
    this.y += v.y;
  }

  sub(v: Vector) {
    this.x -= v.x;
    this.y -= v.y;
  }

  mulSelf(s: number) {
    this.x *= s;
    this.y *= s;
  }

  divSelf(s: number) {
    this.x /= s;
    this.y /= s;
  }

  static dot(a: Vector, b: Vector): number {
    return a.x * b.x + a.y * b.y;
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  sqrMag(): number {
    return this.x * this.x + this.y * this.y;
  }

  static unit(v: Vector): Vector {
    const m = v.mag();
    return m === 0 ? new Vector(0, 0) : Vector.div(v, m);
  }

  normalize() {
    const m = this.mag();
    if (m !== 0) this.divSelf(m);
  }

  static perpL(v: Vector): Vector {
    return new Vector(-v.y, v.x);
  }

  static perpR(v: Vector): Vector {
    return new Vector(v.y, -v.x);
  }

  static neg(v: Vector): Vector {
    return new Vector(-v.x, -v.y);
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;
  }
}
