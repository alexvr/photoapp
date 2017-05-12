import {PhotoQuality} from './PhotoQuality';
import {ImageWatermark} from './imageWatermark/ImageWatermark';

export class Configuration {
  mediaStorage: string;
  photoQuality: PhotoQuality;
  printerName: string;
  printerCopies: number;
  watermarkPrinting: boolean;
  watermarkImage: string;
  qrPrinting: boolean;
  qrImage: string;
  watermarkSharing: boolean;
  printWatermark: ImageWatermark;
  webWatermark: ImageWatermark;

  constructor() {
    this.mediaStorage = '';
    this.photoQuality = PhotoQuality.HIGH;
    this.printerName = '';
    this.printerCopies = 1;
    this.watermarkPrinting = false;
    this.watermarkImage = '';
    this.qrPrinting = false;
    this.watermarkSharing = false;
    this.printWatermark = new ImageWatermark();
    this.webWatermark = new ImageWatermark();
  }
}
