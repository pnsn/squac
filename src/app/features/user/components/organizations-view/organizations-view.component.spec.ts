import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";

import { OrganizationsViewComponent } from "./organizations-view.component";

describe("OrganizationsViewComponent", () => {
  let component: OrganizationsViewComponent;
  let fixture: ComponentFixture<OrganizationsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganizationsViewComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              organizations: [],
            }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganizationsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
