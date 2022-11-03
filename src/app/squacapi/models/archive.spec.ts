import { Archive } from "./archive";

describe("Archive", () => {
  it("should create an instance", () => {
    expect(new Archive(1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, "", "")).toBeTruthy();
  });
});
