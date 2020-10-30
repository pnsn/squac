import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@shared/snackbar/snackbar.component';
import { duration } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private snackBarRef: MatSnackBarRef<SnackbarComponent>;
  private durationInSeconds : number = 3;
  constructor(
    private snackBar : MatSnackBar
  ) { }


  openSnackBar(type, message, action?, duration?) {
    const d = duration ? duration : this.durationInSeconds;
    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data : {
        message,
        type,
        action
      },
      panelClass: "mat-snack-bar-test",
      duration: d * 1000
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
  message(message) {
    this.openSnackBar(
      "default", message,
    );
  }

  error(message){
    this.openSnackBar(
      "error", message, "close"
    );
  }

  alert(message){
    this.openSnackBar(
      "alert", message, "close"
    );
  }
}
