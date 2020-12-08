import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { observable, of, scheduled } from 'rxjs';

import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;
  let dialog;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open:(ref, options) => {
              return { 
                close:(value)=> {},
                afterClosed: () => {
                  return scheduled([true], null);
                }
              };
            }
          },
        }
      ]
    });
    service = TestBed.inject(ConfirmDialogService);
    dialog = TestBed.inject(MatDialog);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should open the dialog', () => {
    const openSpy = spyOn(dialog, 'open');
    service.open({
      title: "",
      message: "",
      cancelText: "",
      confirmText: ""
    });
    expect(openSpy).toHaveBeenCalled();
  });
  it('should close the dialog', () => {
    service.open({
      title: "",
      message: "",
      cancelText: "",
      confirmText: ""
    });

    const closeSpy = spyOn(service.dialogRef, 'close');
    service.close();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should confirm after close', () => {
    service.open({
      title: "",
      message: "",
      cancelText: "",
      confirmText: ""
    });

    service.confirmed().subscribe(
      confirm => {
        expect(confirm).toBe(true);
      }
    );

    service.dialogRef.close(true);
  });

});
