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
  selectBtnColor: string;
  selectBtnImage: string;
  selectBtnBorderColor: string;
  selectBtnBorderWidth: number;
  //navigationColor: string;
  //activeNavigationColor: string;

  constructor() {
    super();
    this.imageContainer = true;
    this.imageContainerColor = '#ffffff';
    this.imageContainerBorderColor = '#ffffff';
    this.imageContainerBorderWidth = 0;

    this.selectionContainer = true;
    this.selectionContainerColor = '#ffffff';
    this.selectionContainerBorderColor = '#ffffff';
    this.selectionContainerBorderWidth = 0;

    this.selectBtnText = 'Select';
    this.selectBtnColor = '#ffffff';
    this.selectBtnBorderColor = '#4d4d4d';
    this.selectBtnBorderWidth = 1;
  }
}
