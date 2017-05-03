import {Injectable} from "@angular/core";
import {ImageWatermark} from "../../model/imageWatermark/ImageWatermark";

@Injectable()
export class WatermarkConfigService {
  private printWatermark: ImageWatermark;
  private webWatermark: ImageWatermark;

  constructor() {
    this.printWatermark = new ImageWatermark();
    this.printWatermark = new ImageWatermark();
  }

  getPrintWatermark(): ImageWatermark {
    return this.printWatermark;
  }

  getWebWatermark(): ImageWatermark {
    return this.webWatermark;
  }

  setPrintWatermark(printwm: ImageWatermark) {
    this.printWatermark = printwm;
  }

  setWebWatermark(webwm: ImageWatermark) {
    this.webWatermark = webwm;
  }
}
