export abstract class Tile {
  protected image?: HTMLImageElement;

  render(ctx: CanvasRenderingContext2D) {
    if (this.image) {
      ctx.save();
      ctx.scale(1, -1);
      ctx.drawImage(this.image, 0, -1, 1, 1);
      ctx.restore();
    }
  }

  isSolid(): boolean {
    return true;
  }

  setImage(img: HTMLImageElement) {
    this.image = img;
  }
}
