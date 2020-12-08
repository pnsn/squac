import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackbarComponent } from '@shared/components/snackbar/snackbar.component';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;
  let snackbar: MatSnackBar;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule],
      providers: [
        {
          provide: MatSnackBar,
          useValue: {
            openFromComponent: (component, config) => {
              return {
                dismiss: () => {}
              }
            }
          }
        }
      ]
    });
    service = TestBed.inject(MessageService);
    snackbar = TestBed.inject(MatSnackBar);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open snackbar', () => {
    const openSpy = spyOn(snackbar, "openFromComponent");
    service.openSnackBar(SnackbarComponent, "message");
    expect(openSpy).toHaveBeenCalled();
  });

  it('should close snackbar', ()=> {

  });

  it('should open a message snackbar', () => {

  });

  it('should open an error snackbar', () => {

  });

  it('should open an alert snackbar', () => {

  });

  it("should close on destroy", () => {

  });

});
