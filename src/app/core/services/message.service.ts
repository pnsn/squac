import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@shared/components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  snackBarRef: MatSnackBarRef<SnackbarComponent>;
  private durationInSeconds = 4;
  constructor(
    private snackBar: MatSnackBar
  ) { }


  openSnackBar(type, message, action?) {

    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data : {
        message,
        type,
        action
      },
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

  close(){
    if(this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }
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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.close();
  }
}


// Shows a popup at the bottom of the page that can have an action
// .message() has no dismiss action
