import { Tile } from './Tile.js';

export class Air extends Tile {
  render(_ctx: CanvasRenderingContext2D) {}
  isSolid(): boolean { return false; }
}
