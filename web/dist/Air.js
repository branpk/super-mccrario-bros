import { Tile } from './Tile.js';
export class Air extends Tile {
    render(_ctx) { }
    isSolid() { return false; }
}
