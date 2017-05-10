import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Headers, RequestOptions, Response} from '@angular/http';
import {BACKEND_BASEURL} from '../../../assets/globals';
import {Event} from '../../model/Event';

// Inter Process Communication
let ipcRenderer;
if (typeof window['require'] !== 'undefined') {
  const electron = window['require']('electron');
  ipcRenderer = electron.ipcRenderer;
}

@Injectable()
export class EventService {

  private selectedEvent: Event;

  constructor(private http: Http) {
  }

  public getAllEvents(): Observable<Event[]|any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('token', localStorage.getItem('id_token'));

    const options = new RequestOptions({headers: headers});
    return this.http.get(BACKEND_BASEURL + '/api/event/getEvents', options).catch(e => this.handleError(e));
  }

  private handleError(error: any): Observable<any> {
    return new Observable(() => console.log('EventService - ' + error));
  }

  public setSelectedEvent(event: Event): void {
    this.selectedEvent = event;
  }

  public getSelectedEvent(): Event {
    return this.selectedEvent;
  }

}
