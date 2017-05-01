import {Component, OnInit} from "@angular/core";
import {Event} from "../model/Event";
import {ConfigurationService} from "./services/configuration.service";
@Component({
  selector: 'configuration',
  templateUrl: 'configuration.component.html',
  styleUrls: ['configuration.component.css']
})

export class ConfigurationComponent implements OnInit {
  private activePart: number = 1;
  private event: Event;

  constructor(private configService: ConfigurationService) {
  }

  ngOnInit(): void {
    this.event = this.configService.getEvent();
  }
}
