import {Injectable, NgZone} from '@angular/core';
import {Observable} from "rxjs/Observable";

// Inter Process Communication
let ipcRenderer;
if (typeof window['require'] !== "undefined") {
  let electron = window['require']("electron");
  ipcRenderer = electron.ipcRenderer;
  //console.log("ipc renderer", ipcRenderer);
}

@Injectable()
export class PrinterService {

  private hasIpc: boolean;
  private selectedPrinter: string;

  constructor(private zone: NgZone) {
  }

  /**
   * Get all printers installed on this machine.
   * @returns string[] of printers
   */
  getAllPrinters(): Observable<string[]> {
    return new Observable(observer => {
      let printers: string[] = [];
      this.hasIpc = (typeof ipcRenderer != 'undefined');

      // Set listener
      if (this.hasIpc) {
        // Send async message to get all installed printers.
        ipcRenderer.send('async', 'get-all-printers');

        // Listen for async-reply to get all installed printers.
        // NgZone is required because printers are updated asynchronously outside Angular's zone.
        ipcRenderer.on('async-get-all-printers', (event, arg) => {
          this.zone.run(() => {
            printers = arg;
            console.log("PrinterService1 - " + printers);
            observer.next(printers);
            observer.complete();
          });
        });
      }
    });
  }

  /**
   * Select printer for event.
   * @param printer
   */
  selectPrinter(printer: string): void {
    this.selectedPrinter = printer;
  }

  /**
   * Get selected printer for event.
   * @returns Name of printer
   */
  getSelectedPrinter(): string {
    return this.selectedPrinter;
  }

  /**
   * This method is used to test the connected printer.
   */
  testPrintPhoto(): void {
    this.hasIpc = (typeof ipcRenderer != 'undefined');

    // Set listener
    if (this.hasIpc) {
      // Send async message to print test photo.
      ipcRenderer.send('async', 'test-print-photo');

      // Listen for async-reply to print test photo.
      ipcRenderer.on('async-test-print-photo', (event, arg) => {
        console.log(arg);
      });
    }
  }

  testPrintPhotoOnPrinter(): void {
    this.hasIpc = (typeof ipcRenderer != 'undefined');

    // Set listener
    if (this.hasIpc) {
      // Send async message to print test photo.
      let printerArguments: string[] = ['test-print-photo-on-printer', this.selectedPrinter];
      ipcRenderer.send('async', printerArguments);

      // Listen for async-reply to print test photo.
      ipcRenderer.on('async-test-print-photo-on-printer', (event, arg) => {
        console.log(arg);
      });
    }
  }


}
