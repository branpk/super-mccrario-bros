export class Resources {
  static BAAL: HTMLImageElement;
  static MCCRARIO0: HTMLImageElement;
  static SPIKEBAAL: HTMLImageElement;
  static BAALOON: HTMLImageElement;
  static STOPPER: HTMLImageElement;
  static CHECKPOINT: HTMLImageElement;
  static BOSSBAAL: HTMLImageElement;
  static THANKS: HTMLImageElement;

  static SURFACEBLOCK: HTMLImageElement;
  static UNDERGROUNDBRICK: HTMLImageElement;
  static BROKENBRICK0: HTMLImageElement;
  static BROKENBRICK1: HTMLImageElement;
  static BROKENBRICK2: HTMLImageElement;
  static GRASSBLOCK: HTMLImageElement;

  static BG0: HTMLImageElement;
  static BG1: HTMLImageElement;
  static BG2: HTMLImageElement;
  static BG3: HTMLImageElement;
  static BG4: HTMLImageElement;

  static LOGO: HTMLImageElement;

  static async load() {
    this.BAAL = await this.loadImage('baal.png');
    this.MCCRARIO0 = await this.loadImage('mccrario0.png');
    this.SPIKEBAAL = await this.loadImage('spikebaal.png');
    this.BAALOON = await this.loadImage('baaloon.png');
    this.STOPPER = await this.loadImage('stopper.png');
    this.CHECKPOINT = await this.loadImage('checkpoint.png');
    this.BOSSBAAL = await this.loadImage('bossbaal.png');
    this.THANKS = await this.loadImage('thanks.png');

    this.SURFACEBLOCK = await this.loadImage('surfaceblock.jpg');
    this.UNDERGROUNDBRICK = await this.loadImage('undergroundbrick.jpg');

    this.BROKENBRICK0 = await this.loadImage('brokenbrick0.png');
    this.BROKENBRICK1 = await this.loadImage('brokenbrick1.png');
    this.BROKENBRICK2 = await this.loadImage('brokenbrick2.png');

    this.GRASSBLOCK = await this.loadImage('grassblock.jpg');

    this.BG0 = await this.loadImage('bg0.jpg');
    this.BG1 = await this.loadImage('bg1.jpg');
    this.BG2 = await this.loadImage('bg2.jpg');
    this.BG3 = await this.loadImage('bg3.jpg');
    this.BG4 = await this.loadImage('bg4.jpg');

    this.LOGO = await this.loadImage('logo.png');
  }

  private static async loadImage(filename: string): Promise<HTMLImageElement> {
    const response = await fetch(`resources/textures/${filename}`);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = URL.createObjectURL(blob);
    });
  }
}
