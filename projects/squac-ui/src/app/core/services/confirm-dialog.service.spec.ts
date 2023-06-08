import { TestBed } from "@angular/core/testing";
import { MatLegacyDialog as MatDialog, MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { of } from "rxjs";

import { ConfirmDialogService } from "./confirm-dialog.service";

describe("ConfirmDialogService", () => {
  let service: ConfirmDialogService;
  let dialog;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
      providers: [
        {
          provide: MatDialog,
          useValue: {
            open: (_ref, _options): any => {
              return {
                close: (_value): any => {
                  return;
                },
                afterClosed: (): any => {
                  return of(true);
                },
              };
            },
            closeAll: (): any => {
              return;
            },
          },
        },
      ],
    });
    service = TestBed.inject(ConfirmDialogService);
    dialog = TestBed.inject(MatDialog);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should open the dialog", () => {
    const openSpy = spyOn(dialog, "open");
    service.open({
      title: "",
      message: "",
      cancelText: "",
      confirmText: "",
    });
    expect(openSpy).toHaveBeenCalled();
  });

  it("should close the dialog", () => {
    service.open({
      title: "",
      message: "",
      cancelText: "",
      confirmText: "",
    });

    const closeSpy = spyOn(service.dialogRef, "close");
    service.close();
    expect(closeSpy).toHaveBeenCalled();
  });

  it("should confirm after close", () => {
    service.open({
      title: "",
      message: "",
      cancelText: "",
      confirmText: "",
    });

    service.confirmed().subscribe((confirm) => {
      expect(confirm).toBe(true);
    });

    service.dialogRef.close(true);
  });

  it("should close dialogs after destroy", () => {
    service.open({
      title: "",
      message: "",
      cancelText: "",
      confirmText: "",
    });

    const closeSpy = spyOn(dialog, "closeAll");
    service.ngOnDestroy();
    expect(closeSpy).toHaveBeenCalled();
  });
});
