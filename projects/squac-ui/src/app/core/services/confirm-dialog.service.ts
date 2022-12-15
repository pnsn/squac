import { Injectable, OnDestroy } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConfirmDialogComponent } from "@shared/components/confirm-dialog/confirm-dialog.component";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";

interface ConfirmDialogOptions {
  title: string;
  message: string;
  cancelText: string;
  confirmText: string;
}

/**
 * Service for managing confirmation dialogs
 *
 * @example
 * this.confirmDialog.open(
 *   {
 *     title: "Delete",
 *     message: "This action is permanent.",
 *     cancelText: "No, cancel.",
 *     confirmText: "Yes, delete."
 *   }
 * );
 * this.confirmDialog.confirmed().subscribe(
 *   confirm => {
 *     if(confirm) {
 *       this.viewService.deleteDashboard(this.dashboard);
 *       this.router.navigate(['/dashboards']);
 *     }
 * });
 * Returns true if confirm, false for cancel
 */
@Injectable({
  providedIn: "root",
})
export class ConfirmDialogService implements OnDestroy {
  constructor(private dialog: MatDialog) {}
  dialogRef: MatDialogRef<ConfirmDialogComponent>;

  /**
   * Closes the dialog with a false response
   */
  public close(): void {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    }
  }

  /**
   * Opens a dialog with the given options
   *
   * @param options dialog config options
   */
  public open(options: ConfirmDialogOptions): void {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText,
      },
    });
  }

  /**
   * Observable of dialog response
   *
   * @returns Observable that resolves to true if confirm, false if cancel
   */
  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1));
  }

  /**
   * close all dialogs on destroy
   */
  ngOnDestroy(): void {
    this.dialog.closeAll();
  }
}
