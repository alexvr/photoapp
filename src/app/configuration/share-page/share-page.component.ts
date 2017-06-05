
import {Component, OnInit, NgZone, ChangeDetectorRef} from '@angular/core';
import {ConfigurationService} from '../services/configuration.service';
import {PrinterService} from '../services/printer.service';
import {LayoutService} from '../services/layout.service';
import {Event} from '../../model/Event';
import {EventText} from "../../model/EventText";

@Component({
  selector: 'share-page',
  templateUrl: 'share-page.component.html',
  styleUrls: ['share-page.component.css']
})

export class SharePageComponent implements OnInit {

  private event: Event;
  private eventText: EventText;
  private textColor: string;
  private logoLoading: boolean;

  constructor(public configurationService: ConfigurationService, public layoutService: LayoutService, private cdRef: ChangeDetectorRef) {
    this.event = this.configurationService.getConfiguredEvent();
    this.eventText = this.event.eventText;
    this.textColor = this.eventText.textColor;
  }

  ngOnInit(): void {
    this.event = this.configurationService.getConfiguredEvent();
  }
  public addNewLineTextAbovePictures(): void {
    this.event.eventText.textAbovePhoto = this.event.eventText.textAbovePhoto + '<br>';
  }
  public addNewLineTextUnderPictures(): void {
    this.event.eventText.textUnderPhoto = this.event.eventText.textUnderPhoto + '<br>';
  }
  public addNewLineTextBottom(): void {
    this.event.eventText.textBottom = this.event.eventText.textBottom + '<br>';
  }
  public generateLinkTextAbovePictures(nameLink: string, actualLink: string): void {
    this.event.eventText.textAbovePhoto = this.event.eventText.textAbovePhoto + "<a href=\""+actualLink+"\">"+nameLink+"</a>";
  }
  public generateLinkTextUnderPictures(nameLink: string, actualLink: string): void {
    this.event.eventText.textUnderPhoto = this.event.eventText.textUnderPhoto + "<a href=\""+actualLink+"\">"+nameLink+"</a>";
  }
  public generateLinkTextBottom(nameLink: string, actualLink: string): void {
    this.event.eventText.textBottom = this.event.eventText.textBottom + "<a href=\""+actualLink+"\">"+nameLink+"</a>";
  }
  public toggleBackgroundImage(choice: boolean): void {
    this.event.eventText.backgroundImageToggle = choice;
  }
  public setLogoImage(): void {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/share-page-layout/logo').subscribe(data => {
      this.event.eventText.logo = data;
      this.logoLoading = true;
      this.cdRef.detectChanges();
      this.logoLoading = false;
    });
  }
  public deleteLogoImage(): void {
    this.event.eventText.logo = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/share-page-layout/logo');
    this.cdRef.detectChanges();
  }
  public setBgImage(): void {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/share-page-layout/background').subscribe(data => {
      this.event.eventText.backgroundImage = data;
      this.cdRef.detectChanges();
    });
  }
  public deleteBgImage(): void {
    this.event.eventText.backgroundImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/share-page-layout/background');
    this.cdRef.detectChanges();
  }
  public setQrCodeImage(): void {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/share-page-layout/qr').subscribe(data => {
      this.event.eventText.qrCodeImage = data;
      this.cdRef.detectChanges();
    });
  }
  public deleteQrCodeImage(): void {
    this.event.eventText.qrCodeImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/share-page-layout/qr');
    this.cdRef.detectChanges();
  }
}
