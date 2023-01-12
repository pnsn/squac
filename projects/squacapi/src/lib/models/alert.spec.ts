import { MockService } from "ng-mocks";
import { Alert } from "./alert";

describe("Alert", () => {
  it("should create an instance", () => {
    expect(MockService(Alert)).toBeTruthy();
  });
});
