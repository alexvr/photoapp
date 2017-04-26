import {Injectable, NgZone} from "@angular/core";
import {Observable} from "rxjs";

// Inter Process Communication
let ipcRenderer;
if (typeof window['require'] !== "undefined") {
  let electron = window['require']("electron");
  ipcRenderer = electron.ipcRenderer;
  //console.log("ipc renderer", ipcRenderer);
}
@Injectable()
export class QrCodeService {

  private hasIpc: boolean;

  constructor(private zone: NgZone) {
  }

  getQrCode(): Observable<string> {
    return new Observable(observer => {
        let qrcode: Observable<string>;
        this.hasIpc = (typeof ipcRenderer != 'undefined');

        // Set listener
        if (this.hasIpc) {
          // Send async message to get all installed printers.
          ipcRenderer.send('async', 'get-qr-code');

          // Listen for async-reply to get all installed printers.
          // NgZone is required because printers are updated asynchronously outside Angular's zone.
          ipcRenderer.on('async-get-qr-code', (event, arg) => {
            this.zone.run(() => {
              qrcode = arg;
                console.log('this one? ' + qrcode);
                observer.next(qrcode);
                observer.complete();
            });
          });
        }
      }
    );
  }
}
