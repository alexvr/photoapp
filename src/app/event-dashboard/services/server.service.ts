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
   * Start web sockets server on 127.0.0.1:3001
   */
  startServer(): boolean {
    let serverStarted = false;
    this.hasIpc = (typeof ipcRenderer != 'undefined');

    if (this.hasIpc) {
      // Send async message to start the server.
      ipcRenderer.send('async', 'start-server');

      // Listen to response from the main process.
      ipcRenderer.on('async-start-server', (event, arg) => {
        this.zone.run(() => {
          if (arg === "true") {
            serverStarted = true;
          }
        });
      });
    }

    return serverStarted;
  }

}
