import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from "@angular/material/legacy-dialog";

/**
 * Confirmation dialog
 */
@Component({
  selector: "shared-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
})
export class ConfirmDialogComponent implements OnInit {
  confirmButtonColor: string;
  canceButtonColor: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      cancelText: string;
      confirmText: string;
      message: string;
      title: string;
    },
    private matDialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {}

  /**
   * config button colors
   */
  ngOnInit(): void {
    if (this.data.confirmText.toLowerCase() === "delete") {
      this.confirmButtonColor = "warn";
    } else {
      this.confirmButtonColor = "primary";
    }
  }

  /** close dialog on cancel */
  public cancel(): void {
    this.close(false);
  }

  /**
   * close dialog with value
   *
   * @param value true if confirm
   */
  public close(value: boolean): void {
    this.matDialogRef.close(value);
  }

  /** close and confirm  */
  public confirm(): void {
    this.close(true);
  }

  /**
   * Listen to esc key and close
   */
  @HostListener("keydown.esc")
  public onEsc(): void {
    this.close(false);
  }
}
