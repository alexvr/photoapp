import {Layout} from './Layout';

export class OverviewLayout extends Layout {
  imageContainer: boolean;
  imageContainerColor: string;
  imageContainerBorderColor: string;
  imageContainerBorderWidth: number;
  selectionIcon: string;
  selectionContainer: boolean;
  selectionContainerColor: string;
  selectionContainerBorderColor: string;
  selectionContainerBorderWidth: number;
  selectBtnText: string;
  navigationColor: string;
  activeNavigationColor: string;

  constructor() {
    super();
  }
}
