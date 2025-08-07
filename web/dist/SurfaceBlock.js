import { Tile } from './Tile.js';
import { Resources } from './Resources.js';
export class SurfaceBlock extends Tile {
    constructor() {
        super();
        this.setImage(Resources.SURFACEBLOCK);
    }
}
