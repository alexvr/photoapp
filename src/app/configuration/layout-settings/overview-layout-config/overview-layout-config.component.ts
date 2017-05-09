import {Component} from "@angular/core";
import {ConfigurationService} from "../../services/configuration.service";
import {OverviewLayout} from "../../../model/layout/OverviewLayout";

@Component({
  selector: 'overview-layout-config',
  templateUrl: 'overview-layout-config.component.html',
  styleUrls: ['overview-layout-config.component.css']
})

export class OverviewLayoutConfigComponent {
  private overviewLayout: OverviewLayout;

  constructor(private configurationService: ConfigurationService) {
    this.overviewLayout = this.configurationService.getEvent().overviewLayout;
  }

  /**
   * This function defines the style of the logo-position buttons by returning the correct class.
   * @param value: The position-value (0=left, 1=center, 2=right)
   * @return class: The right class for the desired style
   */
  setActiveLogoPositionClass(value) {
    if (value === this.overviewLayout.logoPosition) {
      return "btn btn-primary"
    } else {
      return "btn btn-default"
    }
  }

  /**
   * Sets the logo-position.
   * @param value: The position-value (0=left, 1=center, 2=right)
   */
  setLogoPosition(value) {
    this.overviewLayout.logoPosition = value;
  }

}
