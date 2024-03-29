import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { OrganizationService } from "squacapi";
import { UserService } from "@user/services/user.service";
import { MockBuilder } from "ng-mocks";

import { SearchFilterComponent } from "./search-filter.component";

describe("SearchFilterComponent", () => {
  let component: SearchFilterComponent;
  let fixture: ComponentFixture<SearchFilterComponent>;

  beforeEach(() => {
    return MockBuilder(SearchFilterComponent)
      .keep(FormsModule)
      .mock(OrganizationService)
      .mock(UserService);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(SearchFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
