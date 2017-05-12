import {Component, Input, OnInit} from '@angular/core';
import {Event} from '../../model/Event';

@Component({
  selector: 'event-icon',
  templateUrl: 'event-icon.component.html',
  styleUrls: ['event-icon.component.css']
})

export class EventIconComponent implements OnInit {
  @Input() event: Event;
  private isValidLogo = false;

  constructor() {

  }

  ngOnInit(): void {
    if (this.event.eventLogo !== null && this.event.eventLogo !== '') {
      this.isValidLogo = true;
    }
  }

}
