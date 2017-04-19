import {Component, Input} from "@angular/core";
import {Configuration} from "../../model/Configuration";
import {PhotoQuality} from "../../model/PhotoQuality";
@Component({
  selector: 'media-settings',
  templateUrl: 'media-settings.component.html',
  styleUrls: ['media-settings.component.css']
})

export class MediaSettingsComponent {
  @Input() configuration: Configuration;

  setPhotoQuality(x: number) {
    switch (x) {
      case 0:
        this.configuration.photoQuality = PhotoQuality.LOW;
        break;
      case 1:
        this.configuration.photoQuality = PhotoQuality.MEDIUM;
        break;
      case 2:
        this.configuration.photoQuality = PhotoQuality.HIGH;
        break;
    }
  }

  setPhotoQualityButtonStyle(x: number) {
    if (this.configuration.photoQuality != null && x == this.configuration.photoQuality) {
      return {
        'background': '#2880d0',
        'border-color': '#245988',
        'color': '#fff',
      }
    } else {
      return {
        'background': '#fff',
        'border-color': '#ccc',
        'color': '#333',
      }
    }
  }
}
