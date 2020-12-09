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
              };
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
    const openSpy = spyOn(snackbar, 'openFromComponent');
    service.openSnackBar('default', 'message');
    expect(openSpy).toHaveBeenCalled();
  });

  it('should close snackbar', () => {
    service.openSnackBar('default', 'message');
    const closeSpy = spyOn(service.snackBarRef, 'dismiss');
    service.close();

    expect(closeSpy).toHaveBeenCalled();
  });

  it('should do nothing if there is no snackbar', () => {
    expect(service.snackBarRef).toBeUndefined();
    service.close();

    expect(service.snackBarRef).toBeUndefined();
  });

  it('should open a message snackbar', () => {
    const openSpy = spyOn(snackbar, 'openFromComponent');
    service.message('message');
    expect(openSpy).toHaveBeenCalled();
  });

  it('should open an error snackbar', () => {
    const openSpy = spyOn(snackbar, 'openFromComponent');
    service.error('error');
    expect(openSpy).toHaveBeenCalled();
  });

  it('should open an alert snackbar', () => {
    const openSpy = spyOn(snackbar, 'openFromComponent');
    service.alert('alert');
    expect(openSpy).toHaveBeenCalled();
  });

  it('should close on destroy', () => {
    const closeSpy = spyOn(service, 'close');
    service.ngOnDestroy();

    expect(closeSpy).toHaveBeenCalled();
  });

});
