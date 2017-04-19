import {Component} from "@angular/core";
import {Event} from "../model/Event";
import {Router} from "@angular/router";
import {ipcRenderer} from 'electron';

@Component({
  selector: 'start-screen',
  templateUrl: 'start-screen.component.html',
  styleUrls: ['start-screen.component.css']
})


export class StartScreenComponent {

  private has_ipc: boolean;

  private events: Event[] = [{
    eventName: 'Chaumet',
    eventDate: null,
    eventLocation: null,
    company: null,
    companyAddress: null,
    contact: null,
    contactPhone: null,
    overviewLayout: null,
    detailLayout: null,
    configuration: null
  },
    {
      eventName: 'Fashicon',
      eventDate: null,
      eventLocation: null,
      company: null,
      companyAddress: null,
      contact: null,
      contactPhone: null,
      overviewLayout: null,
      detailLayout: null,
      configuration: null
    },
    {
      eventName: 'Porsche',
      eventDate: null,
      eventLocation: null,
      company: null,
      companyAddress: null,
      contact: null,
      contactPhone: null,
      overviewLayout: null,
      detailLayout: null,
      configuration: null
    }];

  constructor(private router: Router) {
    this.has_ipc = (typeof ipcRenderer != 'undefined');
    // Set listener
    if (this.has_ipc) {
      ipcRenderer.on('asynchronous-reply', (event, arg) => {
        console.log(arg); // prints "pong"
      });
    }
  }
}
