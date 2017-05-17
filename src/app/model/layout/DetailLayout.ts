import {Layout} from './Layout';
import {Position} from "./Position";

export class DetailLayout extends Layout {
  printBtnText: string;
  printBtnColor: string;
  printBtnImage: string;
  printBtnBorderColor: string;
  printBtnBorderWidth: number;
  shareBtnText: string;
  shareBtnColor: string;
  shareBtnImage: string;
  shareBtnBorderColor: string;
  shareBtnBorderWidth: number;
  backBtnText: string;
  backBtnColor: string;
  backBtnImage: string;
  backBtnBorderColor: string;
  backBtnBorderWidth: number;
  finishBtnText: string;
  finishBtnColor: string;
  finishBtnImage: string;
  finishBtnBorderColor: string;
  finishBtnBorderWidth: number;

  printImage: string;
  printMessage: string;
  printContainerColor: string;
  printContainerBorderColor: string;
  printContainerBorderWidth: number;

  imagePosition: Position;

  constructor() {
    super();
    this.printBtnText = 'Print';
    this.printBtnColor = '#ffffff';
    this.printBtnBorderColor = '#4d4d4d';
    this.printBtnBorderWidth = 1;

    this.shareBtnText = 'Share';
    this.shareBtnColor = '#ffffff';
    this.shareBtnBorderColor = '#4d4d4d';
    this.shareBtnBorderWidth = 1;

    this.backBtnText = 'Back';
    this.backBtnColor = '#ffffff';
    this.backBtnBorderColor = '#4d4d4d';
    this.backBtnBorderWidth = 1;

    this.finishBtnText = 'Finish';
    this.finishBtnColor = '#ffffff';
    this.finishBtnBorderColor = '#4d4d4d';
    this.finishBtnBorderWidth = 1;

    this.printMessage = 'Image is printed!';
    this.printContainerColor = '#bbbbbb';
    this.printContainerBorderColor = '#ffffff';
    this.printContainerBorderWidth = 0;

    this.imagePosition = Position.LEFT;
  }
}
