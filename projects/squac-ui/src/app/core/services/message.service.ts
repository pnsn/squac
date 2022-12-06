import { Injectable, OnDestroy } from "@angular/core";
import { MatSnackBar, MatSnackBarRef } from "@angular/material/snack-bar";
import { SnackbarComponent } from "@shared/components/snackbar/snackbar.component";

// Handles snackbars for showing messages to user
// Shows a popup at the top of the page that can have an action/button
@Injectable({
  providedIn: "root",
})
export class MessageService implements OnDestroy {
  snackBarRef: MatSnackBarRef<SnackbarComponent>;
  private durationInSeconds = 4;
  constructor(private snackBar: MatSnackBar) {} //make close on navigation

  // opens a snackbar and passes data to component
  openSnackBar(type, message, duration, action?): void {
    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message,
        type,
        action,
      },
      verticalPosition: "top",
      panelClass: "mat-snack-bar-themed",
      duration: duration * 1000,
    });
  }

  // Closes any open snackbar
  close(): void {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  // open standard snack bar
  message(message: string): void {
    this.openSnackBar("default", message, this.durationInSeconds, null);
  }

  // opens snack bar with red text
  error(message: string): void {
    this.openSnackBar("error", message, 10, "Dismiss");
  }

  // opens snack bar with close option
  alert(message: string): void {
    this.openSnackBar("alert", message, 10, "Dismiss");
  }

  // Close all snackbars on destroy
  ngOnDestroy(): void {
    this.close();
  }
}
