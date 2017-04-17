import {Component, Input} from "@angular/core";
@Component({
  selector: 'event',
  templateUrl: 'event.component.html',
  styleUrls: ['event.component.css']
})

export class EventComponent {
  @Input() event: Event;
}
