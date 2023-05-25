import { MatchingRule } from "./matching-rule";

describe("Network", () => {
  it("should create an instance", () => {
    const rule = new MatchingRule({
      group: 1,
    });
    expect(rule).toBeTruthy();
    expect(rule.toJson().group).toBe(1);
  });
});
