import { TestBed } from "@angular/core/testing";
import { MockService } from "ng-mocks";
import { Trigger, TriggerAdapter } from "./trigger";

describe("Trigger", () => {
  let adapter: TriggerAdapter;
  it("should create an instance", () => {
    expect(MockService(Trigger)).toBeTruthy();
  });

  it("should adapt from api to trigger", () => {
    adapter = TestBed.inject(TriggerAdapter);

    // const trigger = adapter.adaptFromApi(testData);
    // expect(trigger).toBeDefined();
  });

  it("should adapt from trigger to api", () => {
    adapter = TestBed.inject(TriggerAdapter);
    const trigger = MockService(Trigger);
    const triggerJson = adapter.adaptToApi(trigger);
    expect(triggerJson).toBeDefined();
  });
});
