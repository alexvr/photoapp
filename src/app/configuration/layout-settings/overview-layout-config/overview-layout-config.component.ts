import {Component} from '@angular/core';
import {ConfigurationService} from '../../services/configuration.service';
import {Event} from '../../../model/Event';
import {OverviewLayout} from '../../../model/layout/OverviewLayout';
import {LayoutService} from '../../services/layout.service';
import {Image} from '../../../model/Image';

@Component({
  selector: 'overview-layout-config',
  templateUrl: 'overview-layout-config.component.html',
  styleUrls: ['overview-layout-config.component.css']
})

export class OverviewLayoutConfigComponent {
  private event: Event;
  private overviewLayout: OverviewLayout;
  private isFullScreenPreview = false;

  private testImages: Image[] = [
    new Image(1, '../../../assets/images/photo.jpg'),
    new Image(2, '../../../assets/images/photo.jpg'),
    new Image(3, '../../../assets/images/photo.jpg'),
    new Image(4, '../../../assets/images/photo.jpg'),
    new Image(5, '../../../assets/images/photo.jpg')];

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
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/overview-layout/logo').subscribe(data => {
      this.overviewLayout.logo = data;
      this.event.eventLogo = data;
    });
  }

  deleteLogoImage() {
    this.overviewLayout.logo = null;
    this.event.eventLogo = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/overview-layout/logo');
  }

  // Selection
  setSelectionIcon() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/overview-layout/selectionIcon').subscribe(data => {
      this.overviewLayout.selectionIcon = data;
    });
  }

  deleteSelectionIcon() {
    this.overviewLayout.selectionIcon = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/overview-layout/selectionIcon');
  }

  setSelectButton() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/overview-layout/selectButton').subscribe(data => {
      this.overviewLayout.selectBtnImage = data;
    });
  }

  deleteSelectButton() {
    this.overviewLayout.selectBtnImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/overview-layout/selectButton');
  }

  // Background
  setBackgroundImage() {
    this.layoutService.uploadLayoutAsset(this.event.eventName + '/overview-layout/background').subscribe(
      data => {
        this.overviewLayout.backgroundImage = data;
      }
    );
  }

  deleteBackgroundImage() {
    this.overviewLayout.backgroundImage = null;
    this.layoutService.deleteLayoutAsset(this.event.eventName + '/overview-layout/background');
  }

  // The styling of the background has to happen here, because it has to happen on the :host element
  setBackground(): any {
    if (this.overviewLayout != null && this.overviewLayout.backgroundImage) {
      return {
        'background-image': 'url(' + this.overviewLayout.backgroundImage + ')',
        'background-size': 'cover'
      };
    } else {
      return {
        'background': this.overviewLayout.backgroundColor
      };
    }
  }

  setFullScreen(fullScreen: boolean) {
    this.isFullScreenPreview = fullScreen;
  }
}
