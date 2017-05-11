import {Component} from '@angular/core';
import {ConfigurationService} from '../../services/configuration.service';
import {Event} from '../../../model/Event';
import {OverviewLayout} from '../../../model/layout/OverviewLayout';
import {LayoutService} from '../../services/layout.service';

@Component({
  selector: 'overview-layout-config',
  templateUrl: 'overview-layout-config.component.html',
  styleUrls: ['overview-layout-config.component.css']
})

export class OverviewLayoutConfigComponent {
  private event: Event;
  private overviewLayout: OverviewLayout;

  constructor(public configurationService: ConfigurationService, public layoutService: LayoutService) {
    this.event = this.configurationService.getConfiguredEvent();
    this.overviewLayout = this.event.overviewLayout;
  }

  // Logo
  setActiveLogoPositionClass(position) {
    if (position === this.overviewLayout.logoPosition) {
      return 'btn btn-primary';
    } else {
      return 'btn btn-default';
    }
  }

  setLogoPosition(position) {
    this.overviewLayout.logoPosition = position;
  }

  setLogoImage() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/assets/logo').subscribe(data => {
      this.overviewLayout.logo = data;
    });
  }

  deleteLogoImage() {
    this.overviewLayout.logo = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/assets/logo');
  }

  // Selection
  setSelectionIcon() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/assets/selectionIcon').subscribe(data => {
      this.overviewLayout.selectionIcon = data;
    })
  }

  deleteSelectionIcon() {
    this.overviewLayout.selectionIcon = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/assets/selectionIcon');
  }

  setSelectButton() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/assets/selectButton').subscribe(data => {
      this.overviewLayout.btnImage = data;
    })
  }

  deleteSelectButton() {
    this.overviewLayout.btnImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/assets/selectButton');
  }

  // Background
  setBackgroundImage() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/assets/background').subscribe(
      data => {
        this.overviewLayout.backgroundImage = data;
      }
    )
  }

  deleteBackgroundImage() {
    this.overviewLayout.backgroundImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/assets/background');
  }

  // The styling of the background has to happen here, because it has to happen on the :host element
  setBackground(): any {
    if (this.overviewLayout != null && this.overviewLayout.backgroundImage) {
      return {'background-image': 'url(' + this.overviewLayout.backgroundImage + ')', 'background-cover': 'cover'}
    } else {
      return {'background': this.overviewLayout.backgroundColor};
    }
  }
}
