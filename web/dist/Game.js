var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Resources } from './Resources.js';
import { Screen } from './Screen.js';
import { GameLoop } from './GameLoop.js';
import { Level } from './Level.js';
import { Input } from './Input.js';
export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.screen = new Screen(canvas);
        this.loop = new GameLoop(this.screen);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Resources.load();
            Input.init(this.canvas);
            this.screen.showLogo(true);
            this.screen.repaint();
            yield new Promise(r => setTimeout(r, 3000));
            this.screen.showLogo(false);
            this.runLevel('1-1', 0);
        });
    }
    runLevel(name, checkpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const level = yield Level.load(name, checkpoint);
            this.screen.setLevel(level);
            // Audio temporarily disabled
            this.loop.play(level, () => __awaiter(this, void 0, void 0, function* () {
                if (level.didWin()) {
                    const next = Game.nextLevelName(level.getName());
                    if (next) {
                        yield this.runLevel(next, 0);
                    }
                    else {
                        this.screen.showLogo(true);
                        this.screen.repaint();
                        yield new Promise(r => setTimeout(r, 3000));
                        this.screen.showLogo(false);
                        Game.stop();
                    }
                }
                else {
                    yield this.runLevel(level.getName(), level.getCheckpoint());
                }
            }));
        });
    }
    static nextLevelName(current) {
        const [worldStr, levelStr] = current.split('-');
        const world = parseInt(worldStr, 10);
        let lvl = levelStr === 'B' ? 5 : parseInt(levelStr, 10);
        lvl++;
        if (lvl > 5)
            return null;
        return `${world}-${lvl === 5 ? 'B' : lvl}`;
    }
    static stop() {
        // audio disabled
    }
}
