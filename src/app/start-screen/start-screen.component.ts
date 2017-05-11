import {Component} from '@angular/core';
import {Event} from '../model/Event';
import {Router} from '@angular/router';
import {EventService} from '../event/services/event.service';
import {Response} from '@angular/http';
import {ConfigurationService} from "../configuration/services/configuration.service";

@Component({
  selector: 'start-screen',
  templateUrl: 'start-screen.component.html',
  styleUrls: ['start-screen.component.css']
})

export class StartScreenComponent {

  /*private events: Event[] = [{
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
    }];*/

  private events: Event[] = [];
  private selectedEvent: Event;

  private visibleAnimate = false;  // necessary for activating bootstrap modal in Typescript code.
  private visible = false;         // necessary for activating bootstrap modal in Typescript code.

  constructor(private router: Router, private eventService: EventService, private configurationService: ConfigurationService) {
    // Get all events for User.
    this.eventService.getAllEvents().map((res: Response) => res.json())
      .subscribe((events) => {
        this.events = events;
        console.log(events);
      });
  }

  showEventMenu(e: Event) {
    console.log(e);
    this.selectedEvent = e;
    this.visibleAnimate = true;
    this.visible = true;
  }

  openEventDashboard(): void {
    this.eventService.setSelectedEvent(this.selectedEvent);
    this.router.navigate(['/event-dashboard']).then(() => { });
  }

  openEventConfiguration(): void {
    this.configurationService.setConfiguredEvent(this.selectedEvent);
    this.router.navigate(['/configuration']).then(() => { });
  }

  closeMenu() {
    this.visibleAnimate = false;
    this.visible = false;
  }
}

