import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@shared/components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService  implements OnDestroy{
  snackBarRef: MatSnackBarRef<SnackbarComponent>;
  private durationInSeconds = 4;
  constructor(
    private snackBar: MatSnackBar
  ) { }

  // opens a snackbar and passes data to component
  openSnackBar(type, message, action?) {

    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data : {
        message,
        type,
        action
      },
      verticalPosition: 'top',
      panelClass: 'mat-snack-bar-themed',
      duration: this.durationInSeconds * 1000
    });

    // this.snackBarRef.afterDismissed().subscribe(() => {
    //   console.log('The snack-bar was dismissed');
    // });


    // this.snackBarRef.onAction().subscribe(() => {
    //   console.log('The snack-bar action was triggered!');
    // });
  }

  // Closes any open snackbar
  close(){
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  // Component friendly, opens a snackbar
  // type: 'error', 'alert', 'warn'
  message(message: string) {
    this.openSnackBar(
      'default', message, null
    );
  }

  error(message: string){
    this.openSnackBar(
      'error', message, 'close'
    );
  }

  alert(message: string){
    this.openSnackBar(
      'alert', message, null
    );
  }

  // Close all snackbars on destroy
  ngOnDestroy(): void {
    this.close();
  }
}

// Shows a popup at the bottom of the page that can have an action
