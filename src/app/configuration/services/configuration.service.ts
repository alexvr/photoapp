import {Injectable} from '@angular/core';
import {Event} from '../../model/Event';
import {Http, Headers, RequestOptions} from '@angular/http';
import {BACKEND_BASEURL} from '../../../assets/globals';
import {Observable} from 'rxjs/Observable';

let ipcRenderer;
if (typeof window['require'] !== 'undefined') {
  const electron = window['require']('electron');
  ipcRenderer = electron.ipcRenderer;
}

@Injectable()
export class ConfigurationService {

  private newEvent: boolean;
  private configuredEvent: Event;
  private hasIpc: boolean;

  constructor(public http: Http) {
    /*this.event = {
      eventName: 'Chaumet',
      eventLogo: 'none',
      eventStartDate: null,
      eventEndDate: null,
      eventLocation: null,
      eventAddress: null,
      company: null,
      companyAddress: null,
      contact: null,
      contactPhone: null,
      overviewLayout: {
        id: 0,
        logo: null,
        logoPosition: Position.CENTER,
        backgroundColor: '#efefef',
        backgroundImage: null,
        btnColor: null,
        btnImage: null,
        btnBorderColor: null,
        btnBorderWidth: 0,
        btnPressedColor: null,
        btnPressedImage: null,
        btnPressedBorderColor: null,
        imageBorderColor: null,
        imageBorderWidth: 0,
        imageContainer: false,
        imageContainerColor: null,
        imageContainerBorderColor: null,
        imageContainerBorderWidth: 0,
        selectionIcon: null,
        selectionContainer: false,
        selectionContainerColor: null,
        selectionContainerBorderColor: null,
        selectionContainerBorderWidth: 0,
        selectBtnText: 'select',
        navigationColor: null,
        activeNavigationColor: null,
      },
      detailLayout: null,
      config: {
        mediastorage: null,
        photoQuality: PhotoQuality.HIGH,
        ftpIPAddress: null,
        ftpPort: 22,
        ftpUsername: 'testuser',
        ftpPassword: '1234',
        printerName: null,
        printingEnabled: null,
        automaticPrinting: null,
        printerCopies: null,
        watermarkPrinting: null,
        watermarkImage: null,
        qrPrinting: null,
        printWatermark: null,
        webWatermark: null
      }
    };*/
  }

  public getConfiguredEvent() {
    return this.configuredEvent;
  }

  public isNewEvent() {
    return this.newEvent;
  }

  /**
   * Set the Event to configure.
   * If it is a new Event, set the boolean to true.
   * @param event
   * @param newEvent
   */
  public setConfiguredEvent(event: Event, newEvent: boolean): void {
    this.configuredEvent = event;
    this.newEvent = newEvent;
  }

  public updateEvent(): Observable<any> {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('id_token'));
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    console.log(JSON.stringify(this.configuredEvent, null, 2));

    const options = new RequestOptions({headers: headers});
    return this.http.put(BACKEND_BASEURL + '/api/event/updateEvent', this.configuredEvent, options).catch(e => this.handleError(e));
  }

  public deleteEvent(): Observable<any> {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('id_token'));
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    console.log(JSON.stringify(this.configuredEvent, null, 2));

    const options = new RequestOptions({headers: headers});
    const deleteUrl = BACKEND_BASEURL + '/api/event/deleteEventById/' + this.configuredEvent.eventId;
    return this.http.delete(deleteUrl, options).catch(e => this.handleError(e));
  }

  public saveEvent(): Observable<any> {
    const headers = new Headers();
    headers.append('token', localStorage.getItem('id_token'));
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');

    console.log(JSON.stringify(this.configuredEvent, null, 2));

    const options = new RequestOptions({headers: headers});
    return this.http.post(BACKEND_BASEURL + '/api/event/createEvent', this.configuredEvent, options).catch(e => this.handleError(e));
  }

  public getDirectoryPath(): Observable<string> {
    return new Observable(observable => {
      this.hasIpc = (typeof ipcRenderer !== 'undefined');
      if (this.hasIpc) {
        ipcRenderer.send('async', 'get-directory-path');
        ipcRenderer.on('async-get-directory-path', (event, arg) => {
          observable.next(arg);
          observable.complete();
        });
      }
    });
  }

  public getFilePath(): Observable<string> {
    return new Observable(observable => {
      this.hasIpc = (typeof ipcRenderer !== 'undefined');
      if (this.hasIpc) {
        ipcRenderer.send('async', 'get-file-path');
        ipcRenderer.on('async-get-file-path', (event, arg) => {
          observable.next(arg);
          observable.complete();
        });
      }
    });
  }

  private handleError(error: any): Observable<any> {
    return new Observable(() => console.log('ConfigurationService - ' + error));
  }

}
