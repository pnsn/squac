import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatLegacyButtonModule as MatButtonModule } from "@angular/material/legacy-button";
import {
  MatLegacySnackBarRef as MatSnackBarRef,
  MAT_LEGACY_SNACK_BAR_DATA as MAT_SNACK_BAR_DATA,
} from "@angular/material/legacy-snack-bar";

import { SnackbarComponent } from "./snackbar.component";

describe("SnackbarComponent", () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;
  const mockSnackBarRef = {
    close: jasmine.createSpy("close"),
  };
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonModule],
      declarations: [SnackbarComponent],
      providers: [
        {
          provide: MAT_SNACK_BAR_DATA,
          useValue: {
            data: {},
          },
        },
        {
          provide: MatSnackBarRef,
          useValue: mockSnackBarRef,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  afterEach(() => {
    fixture.destroy();
  });
});
