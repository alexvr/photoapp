import {Component} from "@angular/core";
import {Event} from "../model/Event";
import {Router} from "@angular/router";

let ipcRenderer;

if (typeof window['require'] !== "undefined") {
  let electron = window['require']("electron");
  ipcRenderer = electron.ipcRenderer;
  console.log("ipc renderer", ipcRenderer);
}

@Component({
  selector: 'start-screen',
  templateUrl: 'start-screen.component.html',
  styleUrls: ['start-screen.component.css']
})


export class StartScreenComponent {

  private has_ipc: boolean;

  private events: Event[] = [{
    eventName: 'Chaumet',
    eventStartDate: null,
    eventEndDate: null,
    eventLocation: null,
    eventAddress: null,
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
      eventStartDate: null,
      eventEndDate: null,
      eventLocation: null,
      eventAddress: null,
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
      eventStartDate: null,
      eventEndDate: null,
      eventLocation: null,
      eventAddress: null,
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
      // Send async message to main process
      ipcRenderer.send('async', 1);

      // Listen for async-reply message from main process
      ipcRenderer.on('async-reply', (event, arg) => {
        // Print 2
        console.log(arg);
      });
    }
  }
}
