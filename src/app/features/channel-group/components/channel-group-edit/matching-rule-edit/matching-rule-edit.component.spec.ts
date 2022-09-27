import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { ChannelGroupModule } from "@features/channel-group/channel-group.module";
import { MaterialModule } from "@shared/material.module";
import { MockBuilder } from "ng-mocks";

import { MatchingRuleEditComponent } from "./matching-rule-edit.component";

describe("MatchingRuleEditComponent", () => {
  let component: MatchingRuleEditComponent;
  let fixture: ComponentFixture<MatchingRuleEditComponent>;

  beforeEach(() => {
    return MockBuilder(MatchingRuleEditComponent, ChannelGroupModule)
      .mock(ReactiveFormsModule)
      .keep(FormBuilder)
      .mock(MaterialModule);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(MatchingRuleEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
