var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Resources {
    static load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.BAAL = yield this.loadImage('baal.png');
            this.MCCRARIO0 = yield this.loadImage('mccrario0.png');
            this.SPIKEBAAL = yield this.loadImage('spikebaal.png');
            this.BAALOON = yield this.loadImage('baaloon.png');
            this.STOPPER = yield this.loadImage('stopper.png');
            this.CHECKPOINT = yield this.loadImage('checkpoint.png');
            this.BOSSBAAL = yield this.loadImage('bossbaal.png');
            this.THANKS = yield this.loadImage('thanks.png');
            this.SURFACEBLOCK = yield this.loadImage('surfaceblock.jpg');
            this.UNDERGROUNDBRICK = yield this.loadImage('undergroundbrick.jpg');
            this.BROKENBRICK0 = yield this.loadImage('brokenbrick0.png');
            this.BROKENBRICK1 = yield this.loadImage('brokenbrick1.png');
            this.BROKENBRICK2 = yield this.loadImage('brokenbrick2.png');
            this.GRASSBLOCK = yield this.loadImage('grassblock.jpg');
            this.BG0 = yield this.loadImage('bg0.jpg');
            this.BG1 = yield this.loadImage('bg1.jpg');
            this.BG2 = yield this.loadImage('bg2.jpg');
            this.BG3 = yield this.loadImage('bg3.jpg');
            this.BG4 = yield this.loadImage('bg4.jpg');
            this.LOGO = yield this.loadImage('logo.png');
        });
    }
    static loadImage(filename) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`resources/textures/${filename}`);
            const blob = yield response.blob();
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.src = URL.createObjectURL(blob);
            });
        });
    }
}
