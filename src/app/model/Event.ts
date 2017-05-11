import {OverviewLayout} from './layout/OverviewLayout';
import {DetailLayout} from './layout/DetailLayout';
import {Configuration} from './Configuration';

export class Event {
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

  constructor() { }
}
