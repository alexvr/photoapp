import {Injectable, NgZone} from "@angular/core";
import {Observable} from "rxjs";

// Inter Process Communication
let ipcRenderer;
if (typeof window['require'] !== 'undefined') {
  const electron = window['require']('electron');
  ipcRenderer = electron.ipcRenderer;
}

@Injectable()
export class LayoutService {
  private hasIpc: boolean;

  constructor(private zone: NgZone) {

  }

  uploadLayoutAsset(path): Observable<string> {
    return new Observable(observable => {
      this.hasIpc = (typeof ipcRenderer != 'undefined');

      if (this.hasIpc) {
        let layoutArguments: string[] = ['upload-layout-asset', path];
        ipcRenderer.send('async', layoutArguments);
        ipcRenderer.on('async-upload-layout-asset', (event, arg) => {
          console.log(arg);
          observable.next(arg.secure_url);
          observable.complete();
        });
      }
    });
  }
}
