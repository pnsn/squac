import { MatchingRule } from "./matching-rule";

describe("Network", () => {
  it("should create an instance", () => {
    expect(new MatchingRule(1, 2, 3, false)).toBeTruthy();
  });
});
