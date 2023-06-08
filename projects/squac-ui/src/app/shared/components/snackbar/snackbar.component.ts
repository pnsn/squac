import { Component, Inject, OnInit } from "@angular/core";
import {
  MatLegacySnackBarRef as MatSnackBarRef,
  MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
} from "@angular/material/legacy-snack-bar";

/**
 * Mat snackbar component
 */
@Component({
  selector: "shared-snackbar",
  templateUrl: "./snackbar.component.html",
})
export class SnackbarComponent implements OnInit {
  message: string;
  type: string;
  action: string;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: object,
    private matSnackBarRef: MatSnackBarRef<SnackbarComponent>
  ) {}

  /** Init */
  ngOnInit(): void {
    this.message = this.data["message"];
    this.type = this.data["type"];
    this.action = this.data["action"];
  }

  /** Close snackbar */
  dismiss(): void {
    this.matSnackBarRef.dismiss();
  }
}
