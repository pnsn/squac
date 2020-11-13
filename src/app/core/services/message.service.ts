import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@shared/components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private snackBarRef: MatSnackBarRef<SnackbarComponent>;
  private durationInSeconds = 3;
  constructor(
    private snackBar: MatSnackBar
  ) { }


  openSnackBar(type, message, action?, duration?) {
    let d;
    if (duration) {
      d = duration ? duration : this.durationInSeconds;
    }

    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data : {
        message,
        type,
        action
      },
      panelClass: 'mat-snack-bar-themed',
      duration: d  ? d * 1000 : null
    });

    // this.snackBarRef.afterDismissed().subscribe(() => {
    //   console.log('The snack-bar was dismissed');
    // });


    // this.snackBarRef.onAction().subscribe(() => {
    //   console.log('The snack-bar action was triggered!');
    // });
  }

  close(){
    this.snackBarRef.dismiss();
  }
  // type: 'error', 'alert', 'warn'
  message(message: string) {
    this.openSnackBar(
      'default', message, null, this.durationInSeconds
    );
  }

  error(message: string){
    this.openSnackBar(
      'error', message, 'close'
    );
  }

  alert(message: string){
    this.openSnackBar(
      'alert', message, null, this.durationInSeconds
    );
  }
}


// Shows a popup at the bottom of the page that can have an action
// .message() has no dismiss action
