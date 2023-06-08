import { ComponentFixture, inject, TestBed } from "@angular/core/testing";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import {
  MatLegacyDialog as MatDialog,
  MatLegacyDialogModule as MatDialogModule,
  MatLegacyDialogRef as MatDialogRef,
  MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA,
} from "@angular/material/legacy-dialog";

import { ConfirmDialogComponent } from "./confirm-dialog.component";

describe("ConfirmDialogComponent", () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let dialog: MatDialog;

  const mockDialogRef = {
    close: jasmine.createSpy("close"),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatDialogModule, MatButtonModule],
      declarations: [ConfirmDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            cancelText: "string",
            confirmText: "string",
            message: "string",
            title: "string",
          },
        },
        {
          provide: MatDialogRef,
          useValue: mockDialogRef,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(inject([MatDialog, MAT_DIALOG_DATA], (d: MatDialog) => {
    dialog = d;
  }));

  it("should create", () => {
    expect(dialog).toBeTruthy();
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    fixture.destroy();
  });
});
