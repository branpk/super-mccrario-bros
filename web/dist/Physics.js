import { Direction, opposite } from './Direction.js';
import { BrokenBrick } from './BrokenBrick.js';
import { Player } from './Player.js';
export class Physics {
    static check(ent, tiles, tileL, tileD) {
        const r = tileD;
        const c = tileL;
        const tile = tiles[r][c];
        if (!ent.collidesWithTile(tile))
            return;
        const bufL = tileL - ent.getHitSize().w - ent.getPos().x;
        const bufR = tileL + 1 - ent.getPos().x;
        const bufD = tileD - ent.getHitSize().h - ent.getPos().y;
        const bufU = tileD + 1 - ent.getPos().y;
        let side = Direction.LEFT;
        let dist = bufR;
        if (Math.abs(bufL) < Math.abs(dist)) {
            side = Direction.RIGHT;
            dist = bufL;
        }
        if (Math.abs(bufD) < Math.abs(dist)) {
            side = Direction.UP;
            dist = bufD;
        }
        if (Math.abs(bufU) < Math.abs(dist)) {
            side = Direction.DOWN;
            dist = bufU;
        }
        if (side === Direction.LEFT && c < tiles[0].length - 1 && ent.collidesWithTile(tiles[r][c + 1]))
            return;
        if (side === Direction.RIGHT && c > 0 && ent.collidesWithTile(tiles[r][c - 1]))
            return;
        if (side === Direction.DOWN && r < tiles.length - 1 && ent.collidesWithTile(tiles[r + 1][c]))
            return;
        if (side === Direction.UP && r > 0 && ent.collidesWithTile(tiles[r - 1][c]))
            return;
        ent.collideTile(side, dist);
        if (tile instanceof BrokenBrick && ent instanceof Player && side === Direction.DOWN) {
            tile.startBreaking();
        }
    }
    static testPoint(p, ent) {
        return p.x >= ent.getPos().x &&
            p.x <= ent.getPos().x + ent.getHitSize().w &&
            p.y >= ent.getPos().y &&
            p.y <= ent.getPos().y + ent.getHitSize().h;
    }
    static checkEntities(entA, entB) {
        if (!entA.collidesWithEntity(entB) || !entB.collidesWithEntity(entA))
            return;
        if (entA.getPos().x + entA.getHitSize().w <= entB.getPos().x)
            return;
        if (entB.getPos().x + entB.getHitSize().w <= entA.getPos().x)
            return;
        if (entA.getPos().y + entA.getHitSize().h <= entB.getPos().y)
            return;
        if (entB.getPos().y + entB.getHitSize().h <= entA.getPos().y)
            return;
        const bufL = entB.getPos().x - entA.getHitSize().w - entA.getPos().x;
        const bufR = entB.getPos().x + entB.getHitSize().w - entA.getPos().x;
        const bufD = entB.getPos().y - entA.getHitSize().h - entA.getPos().y;
        const bufU = entB.getPos().y + entB.getHitSize().h - entA.getPos().y;
        let side = Direction.LEFT;
        let dist = bufR;
        if (Math.abs(bufL) < Math.abs(dist)) {
            side = Direction.RIGHT;
            dist = bufL;
        }
        if (Math.abs(bufD) < Math.abs(dist)) {
            side = Direction.UP;
            dist = bufD;
        }
        if (Math.abs(bufU) < Math.abs(dist)) {
            side = Direction.DOWN;
            dist = bufU;
        }
        entA.collideEntity(entB, side, dist / 2);
        entB.collideEntity(entA, opposite(side), -dist / 2);
    }
}
Physics.GRAVITY = 50.0;
Physics.TERM_VEL = -50.0;
