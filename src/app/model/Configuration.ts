import {PhotoQuality} from "./PhotoQuality";

export class Configuration {
  mediastorage: string;
  photoQuality: PhotoQuality;
  ftpIPAddress: string;
  ftpPort: number;
  ftpUsername: string;
  ftpPassword: string;
  printerName: string;
  printingEnabled: boolean;
  automaticPrinting: boolean;
  printerCopies: number;
  watermarkPrinting: boolean;
  watermarkImage: string;
  qrPrinting: boolean;
}
