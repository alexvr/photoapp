import {Component, Input} from "@angular/core";
@Component({
  selector: 'basic-info',
  templateUrl: 'basic-info.component.html',
  styleUrls: ['basic-info.component.css']
})

export class BasicInfoComponent {
  @Input() event: Event;

}
