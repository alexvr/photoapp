import {OverviewLayout} from './layout/OverviewLayout';
import {DetailLayout} from './layout/DetailLayout';
import {Configuration} from './Configuration';
import {EventText} from './EventText';

export class Event {
  eventId: string;
  eventName: string;
  eventLogo: string;
  eventStartDate: string;
  eventEndDate: string;
  eventLocation: string;
  eventAddress: string;
  company: string;
  companyAddress: string;
  contact: string;
  contactPhone: string;
  overviewLayout: OverviewLayout;
  detailLayout: DetailLayout;
  config: Configuration;
  eventText: EventText;

  constructor() {
    this.eventName = 'New Event';
    this.eventLogo = '';
    this.eventStartDate = '2017/01/01';
    this.eventEndDate = '2017/02/01';
    this.eventLocation = '';
    this.eventAddress = '';
    this.contact = '';
    this.contactPhone = '';
    this.overviewLayout = new OverviewLayout();
    this.detailLayout = new DetailLayout();
    this.config = new Configuration();
    this.eventText = new EventText();
  }
}
