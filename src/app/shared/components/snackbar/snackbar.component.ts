import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  styleUrls: ['./snackbar.component.scss']
})
export class SnackbarComponent implements OnInit {
  message:string;
  type: string;
  action: string;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    private matSnackBarRef: MatSnackBarRef<SnackbarComponent> 
    ) { }

  ngOnInit(): void {
    this.message = this.data.message;
    this.type  = this.data.type;
    this.action = this.data.action;
  }

  dismiss() {
    this.matSnackBarRef.dismiss();
  }

}
