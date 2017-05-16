import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';

// Inter Process Communication
let ipcRenderer;
if (typeof window['require'] !== 'undefined') {
  const electron = window['require']('electron');
  ipcRenderer = electron.ipcRenderer;
}

@Injectable()
export class ServerService {

  private hasIpc: boolean;

  constructor(private zone: NgZone) {
  }

  /**
   * Starts a server on the current network IP4 address on port 3001 and watches the given mediafolder.
   * @returns {number} Network IP4 address
   */
  public startServer(mediaFolder: string): Observable<number> {
    return new Observable(observer => {
      let serverHost = '127.0.0.1';
      this.hasIpc = (typeof ipcRenderer !== 'undefined');

      if (this.hasIpc) {
        // Send async message to start the server.
        const serverArguments: string[] = ['start-server', mediaFolder];
        ipcRenderer.send('async', serverArguments);

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

  /**
   * Returns the IP addresses of connected clients.
   * @returns {Observable}
   */
  public receiveConnectedClients(): Observable<any> {
    return new Observable(o => {
      // Listen to connected clients.
      ipcRenderer.on('async-client-connect', (event, arg) => {
        console.log(arg);
        o.next(arg);
      });
    });
  }

  public receiveDisconnectedClients(): Observable<any> {
    return new Observable(o => {
      // Listen to disconnected clients.
      ipcRenderer.on('async-client-disconnect', (event, arg) => {
        console.log(arg);
        o.next(arg);
      });
    });
  }

}
