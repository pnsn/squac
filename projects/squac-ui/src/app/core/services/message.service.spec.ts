import { TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";

import { MessageService } from "./message.service";

describe("MessageService", () => {
  let service: MessageService;
  let snackbar: MatSnackBar;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatSnackBarModule, MatButtonModule],
      providers: [
        {
          provide: MatSnackBar,
          useValue: {
            open: (_message, _actions, _options?): any => {
              return {
                dismiss: (): any => {
                  return;
                },
              };
            },
          },
        },
      ],
    });
    service = TestBed.inject(MessageService);
    snackbar = TestBed.inject(MatSnackBar);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should open snackbar", () => {
    const openSpy = spyOn(snackbar, "open");
    service.openSnackBar("default", "message");
    expect(openSpy).toHaveBeenCalled();
  });

  it("should close snackbar", () => {
    service.openSnackBar("default", "message");
    const closeSpy = spyOn(service.snackBarRef, "dismiss");
    service.close();

    expect(closeSpy).toHaveBeenCalled();
  });

  it("should do nothing if there is no snackbar", () => {
    expect(service.snackBarRef).toBeUndefined();
    service.close();

    expect(service.snackBarRef).toBeUndefined();
  });

  it("should close on destroy", () => {
    const closeSpy = spyOn(service, "close");
    service.ngOnDestroy();

    expect(closeSpy).toHaveBeenCalled();
  });
});
