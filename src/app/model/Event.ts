import {OverviewLayout} from "./layout/OverviewLayout";
import {DetailLayout} from "./layout/DetailLayout";
import {Configuration} from "./Configuration";

export class Event {
  eventName: string;
  eventDate: Date;
  eventLocation: string;
  company: string;
  companyAddress: string;
  contact: string;
  contactPhone: string;
  overviewLayout: OverviewLayout;
  detailLayout: DetailLayout;
  configuration: Configuration;
}
