import { Aggregate } from "./aggregate";

describe("Aggregate", () => {
  it("should create an instance", () => {
    const aggregate = new Aggregate({
      numSamps: 4,
    });
    expect(aggregate).toBeTruthy();
    expect(aggregate.num_samps).toBe(4);
  });

  it("should return model name", () => {
    expect(Aggregate.modelName).toBe("Aggregate");
  });
});
