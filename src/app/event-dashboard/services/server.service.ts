import {Injectable, NgZone} from '@angular/core';
import {Observable} from "rxjs/Observable";

// Inter Process Communication
let ipcRenderer;
if (typeof window['require'] !== "undefined") {
  let electron = window['require']("electron");
  ipcRenderer = electron.ipcRenderer;
  //console.log("ipc renderer", ipcRenderer);
}

@Injectable()
export class ServerService {

  private hasIpc: boolean;

  constructor(private zone: NgZone) {
  }

  /**
   * Starts a server on the current network IP4 address on port 3001.
   * @returns {number} Network IP4 address
   */
  startServer(): Observable<number> {
    return new Observable(observer => {
      let serverHost = 0;
      this.hasIpc = (typeof ipcRenderer != 'undefined');

      if (this.hasIpc) {
        // Send async message to start the server.
        ipcRenderer.send('async', 'start-server');

        // Listen to response from the main process.
        ipcRenderer.on('async-start-server', (event, arg) => {
          this.zone.run(() => {
            serverHost = arg;
            observer.next(serverHost);
            observer.complete();
          });
        });
      }
    });
  }

}
