import {Injectable} from "@angular/core";
import {PhotoQuality} from "../../model/PhotoQuality";
import {Event} from "../../model/Event";

@Injectable()
export class ConfigurationService {
  private event: Event;

  constructor() {
    this.event = {
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
      configuration: {
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
      }
    };
  }

  getEvent() {
    return this.event;
  }

  saveEvent(event: Event) {
    this.event = event;
  }

}
