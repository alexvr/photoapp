
import {Component, OnInit, NgZone} from '@angular/core';
import {ConfigurationService} from '../services/configuration.service';
import {PrinterService} from '../services/printer.service';
import {Event} from '../../model/Event';

@Component({
  selector: 'share-page',
  templateUrl: 'share-page.component.html',
  styleUrls: ['share-page.component.css']
})

export class SharePageComponent implements OnInit {

  private event: Event;

  constructor(public configService: ConfigurationService) {
  }

  ngOnInit(): void {
    this.event = this.configService.getConfiguredEvent();
  }
  public addNewLineTextUnderPictures(): void {
    this.event.eventText.textUnderPhoto = this.event.eventText.textUnderPhoto + '<br>';
  }
  public addNewLineTextBottom(): void {
    this.event.eventText.textBottom = this.event.eventText.textBottom + '<br>';
  }
  public generateLinkTextUnderPictures(nameLink: string, actualLink: string): void {
    this.event.eventText.textUnderPhoto = this.event.eventText.textUnderPhoto + "<a href=\""+actualLink+"\">"+nameLink+"</a>";
  }
  public generateLinkTextBottom(nameLink: string, actualLink: string): void {
    this.event.eventText.textBottom = this.event.eventText.textBottom + "<a href=\""+actualLink+"\">"+nameLink+"</a>";
  }

}
