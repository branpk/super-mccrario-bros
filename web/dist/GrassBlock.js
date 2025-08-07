import { Tile } from './Tile.js';
import { Resources } from './Resources.js';
export class GrassBlock extends Tile {
    constructor() {
        super();
        this.setImage(Resources.GRASSBLOCK);
    }
}
