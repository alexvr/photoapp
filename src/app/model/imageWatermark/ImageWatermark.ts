export class ImageWatermark {
  print: boolean;
  height: number;
  width: number;
  logoLocation: string;
  logoX: number;
  logoY: number;
  logoScale: number;
  overlayLocation: string;
  overlayX: number;
  overlayY: number;
  overlayScale: number;
  imageX: number;
  imageY: number;
  imageScale: number;

  constructor() {
    this.width = 500;
    this.height = 700;

    this.logoX = 0;
    this.logoY = 0;
    this.logoScale = 100;

    this.overlayX = 0;
    this.overlayY = 0;
    this.overlayScale = 100;

    this.imageX = 0;
    this.imageY = 0;
    this.imageScale = 100;
  }
}
