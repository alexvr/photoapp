import {PhotoQuality} from './PhotoQuality';
import {ImageWatermark} from './imageWatermark/ImageWatermark';

export class Configuration {
  mediaStorage: string;
  photoQuality: PhotoQuality;
  ftpIPAddress: string;
  ftpPort: number;
  ftpUsername: string;
  ftpPassword: string;
  printerName: string;
  printingEnabled: boolean;     // Necessary?
  automaticPrinting: boolean;   // Necessary?
  printerCopies: number;
  watermarkPrinting: boolean;
  watermarkImage: string;
  qrPrinting: boolean;
  qrImage: string;
  printWatermark: ImageWatermark;
  watermarkSharing: boolean;
  webWatermark: ImageWatermark;
}
