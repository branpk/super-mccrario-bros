export class Tile {
    render(ctx) {
        if (this.image) {
            ctx.save();
            ctx.scale(1, -1);
            ctx.drawImage(this.image, 0, -1, 1, 1);
            ctx.restore();
        }
    }
    isSolid() {
        return true;
    }
    setImage(img) {
        this.image = img;
    }
}
