import { Injectable, OnDestroy } from "@angular/core";
import { MatSnackBar, MatSnackBarRef } from "@angular/material/snack-bar";
import { SnackbarComponent } from "@shared/components/snackbar/snackbar.component";

/**
 * Handles snackbars for showing messages to user
 * Shows a popup at the top of the page that can have an action/button
 */
@Injectable({
  providedIn: "root",
})
export class MessageService implements OnDestroy {
  snackBarRef: MatSnackBarRef<SnackbarComponent>;
  private durationInSeconds = 4;
  constructor(private snackBar: MatSnackBar) {} //make close on navigation

  /**
   * Opens a snackbar and passes the data to component
   *
   * @param type snackbar type
   * @param message snackbar message
   * @param duration duration to be open
   * @param action snackbar action button text
   */
  openSnackBar(
    type: string,
    message: string,
    duration: number,
    action?: string
  ): void {
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

  /**
   * Closes any open snackbar
   */
  close(): void {
    if (this.snackBarRef) {
      this.snackBarRef.dismiss();
    }
  }

  /**
   * Opens standard snackbar
   *
   * @param message snackbar message
   */
  message(message: string): void {
    this.openSnackBar("default", message, this.durationInSeconds, null);
  }

  /**
   * Opens snackbar with red text and dismiss button
   *
   * @param message snackbar text
   */
  error(message: string): void {
    this.openSnackBar("error", message, 10, "Dismiss");
  }

  /**
   * Opens snackbar with yellow text
   *
   * @param message snackbar message
   */
  alert(message: string): void {
    this.openSnackBar("alert", message, 5, "Dismiss");
  }

  /**
   * Close all snackbars on destroy
   */
  ngOnDestroy(): void {
    this.close();
  }
}
