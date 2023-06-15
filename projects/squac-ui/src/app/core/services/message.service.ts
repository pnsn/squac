import { Injectable, OnDestroy } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from "@angular/material/snack-bar";

/**
 * Handles snackbars for showing messages to user
 * Shows a popup at the top of the page that can have an action/button
 */
@Injectable({
  providedIn: "root",
})
export class MessageService implements OnDestroy {
  snackBarRef: MatSnackBarRef<TextOnlySnackBar>;
  private durationInSeconds = 4;
  constructor(private snackBar: MatSnackBar) {} //make close on navigation

  /**
   * Opens a snackbar and passes the data to component
   *
   * @param message snackbar message
   * @param action snackbar action button text
   */
  openSnackBar(message: string, action?: string): void {
    let duration: number;
    if (!action) {
      duration = this.durationInSeconds * 1000;
    }
    this.snackBarRef = this.snackBar.open(message, action, {
      verticalPosition: "top",
      duration,
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
    this.openSnackBar(message);
  }

  /**
   * Opens snackbar with red text and dismiss button
   *
   * @param message snackbar text
   */
  error(message: string): void {
    this.openSnackBar(message, "Dismiss");
  }

  /**
   * Opens snackbar with yellow text
   *
   * @param message snackbar message
   */
  alert(message: string): void {
    this.openSnackBar(message);
  }

  /**
   * Close all snackbars on destroy
   */
  ngOnDestroy(): void {
    this.close();
  }
}
