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
  constructor(private snackBar: MatSnackBar) {}

  // opens a snackbar and passes data to component
  openSnackBar(type, message, action?): void {
    this.snackBarRef = this.snackBar.openFromComponent(SnackbarComponent, {
      data: {
        message,
        type,
        action,
      },
      verticalPosition: "top",
      panelClass: "mat-snack-bar-themed",
      duration: this.durationInSeconds * 1000,
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
    this.openSnackBar("default", message, null);
  }

  // opens snack bar with red text
  error(message: string): void {
    this.openSnackBar("error", message, "close");
  }

  // opens snack bar with close option
  alert(message: string): void {
    this.openSnackBar("alert", message, null);
  }

  // Close all snackbars on destroy
  ngOnDestroy(): void {
    this.close();
  }
}
