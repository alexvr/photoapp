import { Injectable, NgZone } from '@angular/core';
import { Event } from '../../model/Event';
import { Observable } from 'rxjs/Observable';
import { DetailLayout } from '../../model/layout/DetailLayout';
import { OverviewLayout } from '../../model/layout/OverviewLayout';

// Inter Process Communication
let ipcRenderer;
if (typeof window['require'] !== 'undefined') {
  const electron = window['require']('electron');
  ipcRenderer = electron.ipcRenderer;
}

@Injectable()
export class TestEventService {

  private hasIpc: boolean;
  private testEvent: Event;

  constructor(zone: NgZone) {
    const overviewLayout: OverviewLayout = new OverviewLayout();
    overviewLayout.backgroundColor = 'green';

    const detailLayout: DetailLayout = new DetailLayout();
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
  testSendLayout(overviewLayout: OverviewLayout, detailLayout: DetailLayout): Observable<any> {
    return new Observable(() => {
      this.hasIpc = (typeof ipcRenderer !== 'undefined');

      if (this.hasIpc) {
        // Send async message to send OverviewLayout to all connected clients.
        const overviewLayoutArguments: any[] = ['send-layout', overviewLayout, detailLayout];
        ipcRenderer.send('async', overviewLayoutArguments);

        // Listen for async-reply to sent layout.
        ipcRenderer.on('async-send-layout', (event, arg) => {
          console.log(arg);
        });
      }
    });
  }

  /**
   * Send a test photo to all connected clients.
   * @returns {Observable}
   */
  testSendPhoto(): Observable<any> {
    return new Observable(() => {
      this.hasIpc = (typeof ipcRenderer !== 'undefined');

      if (this.hasIpc) {
        // Send async message to send a test-photo to all connected clients.
        ipcRenderer.send('async', 'send-test-photo');

        // Listen for async-reply to sent photo.
        ipcRenderer.on('async-send-test-photo', (event, arg) => {
          console.log(arg);
        });
      }
    });
  }

}
