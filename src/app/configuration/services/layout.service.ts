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

  constructor(private zone: NgZone) {

  }

  uploadLayoutAsset(path): Observable<string> {
    return new Observable(observable => {
      if (typeof ipcRenderer != 'undefined') {
        const params: string[] = ['upload-cloudinary-file', path];
        ipcRenderer.send('async', params);
        ipcRenderer.on('async-upload-cloudinary-file', (event, arg) => {
          console.log(arg);
          observable.next(arg.secure_url);
          observable.complete();
        });
      }
    });
  }

  deleteLayoutAsset(path) {
    if (typeof ipcRenderer != 'undefined') {
      const params: string[] = ['delete-cloudinary-file', path];
      ipcRenderer.send('async', params);
      ipcRenderer.on('async-delete-cloudinary-file', (event, arg) => {
        console.log(arg);
      })
    }
  }
}
