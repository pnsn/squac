import { MockService } from "ng-mocks";
import { Alert, AlertAdapter } from "./alert";

describe("Alert", () => {
  let adapter: AlertAdapter;
  it("should create an instance", () => {
    expect(MockService(Alert)).toBeTruthy();
  });

  // it("should adapt from api to Alert", () => {
  //   adapter = TestBed.inject(AlertAdapter);

  //   const alert = adapter.adaptFromApi(testData);
  //   expect(alert).toBeDefined();
  //   expect(alert.inAlarm).toBe(false);
  // });
});
