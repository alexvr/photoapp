import {Injectable, NgZone} from "@angular/core";
import {ImageWatermark} from "../../model/imageWatermark/ImageWatermark";
import {Observable} from "rxjs";
let ipcRenderer;
if (typeof window['require'] !== "undefined") {
  let electron = window['require']("electron");
  ipcRenderer = electron.ipcRenderer;
  //console.log("ipc renderer", ipcRenderer);
}

@Injectable()
export class WatermarkConfigService {
  private printWatermark: ImageWatermark;
  private webWatermark: ImageWatermark;

  private hasIpc: boolean;

  constructor(private zone: NgZone) {
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

  getImage(): Observable<string> {
    return new Observable(observable => {

      this.hasIpc = (typeof ipcRenderer != 'undefined');

      if (this.hasIpc) {
        ipcRenderer.send('async', 'get-watermark-image-asset');
        ipcRenderer.on('async-get-watermark-image-asset', (event, arg) => {
          observable.next(arg);
          observable.complete();
        });
      }
    });
  }
}
