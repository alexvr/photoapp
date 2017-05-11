import {Injectable, NgZone} from '@angular/core';
import {ImageWatermark} from '../../model/imageWatermark/ImageWatermark';
import {Observable} from 'rxjs/Observable';

let ipcRenderer;
if (typeof window['require'] !== 'undefined') {
  const electron = window['require']('electron');
  ipcRenderer = electron.ipcRenderer;
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

  /**
   * Gets the file-path of an image.
   * @return file-path of an image
   */
  getImage(): Observable<string> {
    return new Observable(observable => {

      this.hasIpc = (typeof ipcRenderer !== 'undefined');

      if (this.hasIpc) {
        ipcRenderer.send('async', 'get-watermark-image-path');
        ipcRenderer.on('async-get-watermark-image-path', (event, arg) => {
          observable.next(arg);
          observable.complete();
        });
      }
    });
  }

  /**
   * Converts a file-path into a imageDataURI.
   * @param path: File-path to convert.
   * @return ImageDataURI of the image.
   */
  getImageDataURI(path): Observable<string> {
    return new Observable(observable => {
      this.hasIpc = (typeof ipcRenderer !== 'undefined');

      if (this.hasIpc) {
        const imagearguments: string[] = ['get-watermark-image-dataURI', path];
        ipcRenderer.send('async', imagearguments);
        ipcRenderer.on('async-get-watermark-image-dataURI', (event, arg) => {
          observable.next(arg);
          observable.complete();
        });
      }
    });
  }
}
