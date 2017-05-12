import {Component, OnInit} from '@angular/core';
import {Event} from '../model/Event';
import {ConfigurationService} from './services/configuration.service';
import {Router} from "@angular/router";

@Component({
  selector: 'configuration',
  templateUrl: 'configuration.component.html',
  styleUrls: ['configuration.component.css']
})

export class ConfigurationComponent implements OnInit {

  private activePart = 1;
  private event: Event;
  private newEvent: boolean;

  constructor(private configService: ConfigurationService, private router: Router) {
  }

  ngOnInit(): void {
    this.event = this.configService.getConfiguredEvent();
    this.newEvent = this.configService.isNewEvent();
  }

  public updateEvent(): void {
    this.configService.updateEvent().subscribe(() => {
      this.router.navigate(['/start-screen']);
    });
  }

  public saveEvent(): void {
    this.configService.saveEvent().subscribe(() => {
      this.router.navigate(['/start-screen']);
    });
  }

}
