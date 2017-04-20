import {Component, Input} from "@angular/core";
@Component({
  selector: 'event-icon',
  templateUrl: 'event-icon.component.html',
  styleUrls: ['event-icon.component.css']
})

export class EventIconComponent {
  @Input() event: Event;
}
