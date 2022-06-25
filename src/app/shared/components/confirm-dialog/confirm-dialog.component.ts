import { Component, HostListener, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

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

  ngOnInit(): void {
    if (this.data.confirmText.toLowerCase() === "delete") {
      this.confirmButtonColor = "warn";
    } else {
      this.confirmButtonColor = "primary";
    }
  }

  public cancel(): void {
    this.close(false);
  }
  public close(value): void {
    this.matDialogRef.close(value);
  }
  public confirm(): void {
    this.close(true);
  }

  @HostListener("keydown.esc")
  public onEsc(): void {
    this.close(false);
  }
}
