import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { MockBuilder } from "ng-mocks";

import { MatchingRuleEditComponent } from "./matching-rule-edit.component";

describe("MatchingRuleEditComponent", () => {
  let component: MatchingRuleEditComponent;
  let fixture: ComponentFixture<MatchingRuleEditComponent>;

  beforeEach(() => {
    return MockBuilder(MatchingRuleEditComponent)
      .mock(ReactiveFormsModule)
      .keep(FormBuilder);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(MatchingRuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
