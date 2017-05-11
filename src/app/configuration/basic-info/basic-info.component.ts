import {Component, OnInit} from '@angular/core';
import {ConfigurationService} from '../services/configuration.service';
import {Event} from '../../model/Event';

@Component({
  selector: 'basic-info',
  templateUrl: 'basic-info.component.html',
  styleUrls: ['basic-info.component.css']
})

export class BasicInfoComponent implements OnInit {

  private event: Event;

  constructor(private configService: ConfigurationService) { }

  ngOnInit(): void {
    this.event = this.configService.getConfiguredEvent();
  }

}
