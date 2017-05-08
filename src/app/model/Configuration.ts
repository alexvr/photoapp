import {PhotoQuality} from "./PhotoQuality";
import {ImageWatermark} from "./imageWatermark/ImageWatermark";

export class Configuration {
  mediastorage: string;
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
  printWatermark: ImageWatermark;
  webWatermark: ImageWatermark;
}
