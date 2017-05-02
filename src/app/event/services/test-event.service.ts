import { Injectable, NgZone } from '@angular/core';
import { Event }          from '../../model/Event';
import { Observable }     from "rxjs/Observable";
import { DetailLayout } from "../../model/layout/DetailLayout";
import { OverviewLayout } from "../../model/layout/OverviewLayout";

// Inter Process Communication
let ipcRenderer;
if (typeof window['require'] !== "undefined") {
  let electron = window['require']("electron");
  ipcRenderer = electron.ipcRenderer;
  //console.log("ipc renderer", ipcRenderer);
}

@Injectable()
export class TestEventService {

  private hasIpc: boolean;
  private testEvent: Event;

  constructor(zone: NgZone) {
    let overviewLayout: OverviewLayout = new OverviewLayout();
    overviewLayout.backgroundColor = 'green';

    let detailLayout: DetailLayout = new DetailLayout();
    detailLayout.backgroundColor = 'yellow';

    this.testEvent = new Event();
    this.testEvent.eventName = 'Chaumet';
    this.testEvent.overviewLayout = overviewLayout;
    this.testEvent.detailLayout = detailLayout;
  }

  /**
   * Get event by name.
   * @param eventName
   * @returns {Observable}
   */
  getEventByName(eventName: string): Observable<any> {
    return new Observable(o => {
      o.next(this.testEvent);
      o.complete();
    });
  }

  /**
   * Send the OverviewLayout and DetailLayout to all connected clients.
   * @param overviewLayout
   * @param detailLayout
   * @returns {Observable}
   */
  sendLayout(overviewLayout: OverviewLayout, detailLayout: DetailLayout): Observable<any> {
    return new Observable(() => {
      this.hasIpc = (typeof ipcRenderer != 'undefined');

      if (this.hasIpc) {
        // Send async message to send OverviewLayout to all connected clients.
        let overviewLayoutArguments: any[] = ['send-layout', overviewLayout, detailLayout];
        ipcRenderer.send('async', overviewLayoutArguments);

        // Listen for async-reply to sent layout.
        ipcRenderer.on('async-send-layout', (event, arg) => {
          console.log(arg);
        });
      }
    });
  }

}
