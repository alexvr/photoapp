import {Injectable, NgZone} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {OverviewLayout} from '../../model/layout/OverviewLayout';
import {DetailLayout} from '../../model/layout/DetailLayout';
import {ImageWatermark} from "../../model/imageWatermark/ImageWatermark";

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
   * Starts a server on the current network IP4 address on port 3001,
   * watches the given mediafolder and defines photo quality.
   * @param mediaFolder
   * @param imageQuality
   * @param eventId
   * @param eventName
   * @param printer
   * @param overviewLayout
   * @param detailLayout
   * @param printWatermark
   * @param useWatermark
   * @param webWatermark
   * @param useWebWatermark
   * @returns {number} Network IP4 address
   */
  public startServer(mediaFolder: string,
                     imageQuality: string,
                     eventId: string,
                     eventName: string,
                     printer: string,
                     overviewLayout: OverviewLayout,
                     detailLayout: DetailLayout,
                     printWatermark: ImageWatermark,
                     useWatermark: boolean,
                     webWatermark: ImageWatermark,
                     useWebWatermark: boolean): Observable<number> {
    return new Observable(observer => {
      let serverHost = '127.0.0.1';
      this.hasIpc = (typeof ipcRenderer !== 'undefined');

      if (this.hasIpc) {
        // Send async message to start the server.
        const overviewString: string = JSON.stringify(overviewLayout);
        const detailString: string = JSON.stringify(detailLayout);
        const printWatermarkString: string = JSON.stringify(printWatermark);
        const webWatermarkString: string = JSON.stringify(webWatermark);

        console.log("server-service");

        const serverArguments: string[] = ['start-server', mediaFolder, imageQuality, eventId, eventName, printer, overviewString, detailString, printWatermarkString, useWatermark.toString(), webWatermarkString, useWebWatermark.toString()];
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

  /**
   * Returns the IP addresses of disconnected clients.
   * @returns {Observable}
   */
  public receiveDisconnectedClients(): Observable<any> {
    return new Observable(o => {
      // Listen to disconnected clients.
      ipcRenderer.on('async-client-disconnect', (event, arg) => {
        console.log(arg);
        o.next(arg);
      });
    });
  }

  /**
   * Returns all the logs that have to do with the application.
   * @returns {Observable}
   */
  public receiveApplicationLogs(): Observable<any> {
    return new Observable(o => {
      // Listen to application logs.
      ipcRenderer.on('async-logs', (event, arg) => {
        console.log(arg);
        o.next(arg);
      });
    });
  }

  /**
   * Receives the count of all the event images.
   * @returns {Observable}
   */
  public receiveImageCount(): Observable<any> {
    return new Observable(o => {
      // Listen to application logs.
      ipcRenderer.on('async-image-count', (event, arg) => {
        console.log(arg);
        o.next(arg);
      });
    });
  }

  /**
   * Receives the count of all the print events.
   * @returns {Observable}
   */
  public receivePrintCount(): Observable<any> {
    return new Observable(o => {
      // Listen to application logs.
      ipcRenderer.on('async-print-count', (event, arg) => {
        console.log(arg);
        o.next(arg);
      });
    });
  }

}
