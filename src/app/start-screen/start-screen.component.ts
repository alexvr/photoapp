import {Component} from "@angular/core";
import {Event} from "../model/Event";
import {Router} from "@angular/router";

@Component({
  selector: 'start-screen',
  templateUrl: 'start-screen.component.html',
  styleUrls: ['start-screen.component.css']
})

export class StartScreenComponent {
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

  constructor(private router: Router){}
}
