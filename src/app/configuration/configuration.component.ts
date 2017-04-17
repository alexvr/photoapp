import {Component} from "@angular/core";
@Component({
  selector: 'configuration',
  templateUrl: 'configuration.component.html',
  styleUrls: ['configuration.component.css']
})

export class ConfigurationComponent {
  private activePart: number = 1;

  changeActivePart(newActivePart: number) {
    this.activePart = newActivePart;
  }

}
