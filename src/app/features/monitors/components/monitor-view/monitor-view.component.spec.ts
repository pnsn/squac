import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ActivatedRoute } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { Ability, PureAbility } from "@casl/ability";
import { AbilityModule } from "@casl/angular";
import { AppAbility } from "@core/utils/ability";
import { TableViewComponent } from "@shared/components/table-view/table-view.component";
import { MaterialModule } from "@shared/material.module";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";
import { MockComponent } from "ng-mocks";
import { of } from "rxjs";

import { MonitorViewComponent } from "./monitor-view.component";

describe("MonitorViewComponent", () => {
  let component: MonitorViewComponent;
  let fixture: ComponentFixture<MonitorViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonitorViewComponent, MockComponent(TableViewComponent)],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            parent: {
              data: of(),
            },
          },
        },
        { provide: AppAbility, useValue: new AppAbility() },
        { provide: PureAbility, useExisting: Ability },
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        AbilityModule,
        HttpClientTestingModule,
        NgxDatatableModule,
        MaterialModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonitorViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
