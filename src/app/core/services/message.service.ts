import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { duration } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private snackBarRef;
  private durationInSeconds : number = 4;
  constructor(
    private snackBar : MatSnackBar
  ) { }


  openSnackBar(message, duration?) {
    const d = duration? duration : this.durationInSeconds;
    this.snackBarRef = this.snackBar.open(message, null, {
      duration: this.durationInSeconds * 1000,
      panelClass: "mat-snack-bar-test"
    });

    this.snackBarRef.afterDismissed().subscribe(() => {
      console.log('The snack-bar was dismissed');
    });
    
    
    this.snackBarRef.onAction().subscribe(() => {
      console.log('The snack-bar action was triggered!');
    });
  }

  message(message, duration?) {
    this.openSnackBar(
      message, duration
    );
  }


}
