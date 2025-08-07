import { Vector } from './Vector.js';
import { Resources } from './Resources.js';
import { Level } from './Level.js';

export class Screen {
  static PIXELS_IN_WORLD = 50.0;
  static SCREEN_WIDTH = (650/43) * Screen.PIXELS_IN_WORLD;
  static SCREEN_HEIGHT = (450/650) * Screen.SCREEN_WIDTH;

  ctx: CanvasRenderingContext2D;
  private level?: Level;
  private paused = false;
  private bgImage?: HTMLImageElement;
  private logoScreen = false;

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context not available');
    this.ctx = ctx;
    canvas.width = Screen.SCREEN_WIDTH;
    canvas.height = Screen.SCREEN_HEIGHT;
  }

  static screenToWorld(x:number, y:number, camera: Vector): Vector {
    const world = new Vector(x,y);
    world.sub(new Vector(Screen.SCREEN_WIDTH/2, Screen.SCREEN_HEIGHT/2));
    world.x /= Screen.PIXELS_IN_WORLD;
    world.y /= -Screen.PIXELS_IN_WORLD;
    world.sub(new Vector(-0.5, -0.5));
    world.add(camera);
    return world;
  }

  setLevel(level: Level) {
    this.level = level;
    const name = level.getName();
    if (name === '1-1') this.bgImage = Resources.BG0;
    else if (name === '1-2') this.bgImage = Resources.BG1;
    else if (name === '1-3') this.bgImage = Resources.BG2;
    else if (name === '1-4') this.bgImage = Resources.BG3;
    else if (name === '1-B') this.bgImage = Resources.BG4;
    else this.bgImage = undefined;
  }

  showLogo(show:boolean){ this.logoScreen = show; }
  setPaused(p:boolean){ this.paused = p; }

  repaint() {
    const ctx = this.ctx;
    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    if (this.logoScreen) {
      const img = Resources.LOGO;
      if (img) {
        const width = this.canvas.width;
        const height = img.height * width / img.width;
        ctx.drawImage(img,0,this.canvas.height/2-height/2,width,height);
      }
      return;
    }
    if (this.bgImage) {
      let width = this.canvas.width;
      let height = this.bgImage.height * width / this.bgImage.width;
      if (height < this.canvas.height) {
        height = this.canvas.height;
        width = this.bgImage.width * height / this.bgImage.height;
      }
      ctx.drawImage(this.bgImage,0,0,width,height);
    }
    ctx.save();
    ctx.translate(this.canvas.width/2, this.canvas.height/2);
    ctx.scale(Screen.PIXELS_IN_WORLD, -Screen.PIXELS_IN_WORLD);
    ctx.translate(-0.5, -0.5);
    if (this.level) this.level.render(ctx);
    ctx.restore();
    if (this.paused) {
      ctx.fillStyle = 'rgba(128,128,128,0.5)';
      ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    }
  }
}
