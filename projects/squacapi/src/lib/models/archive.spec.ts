import { Archive } from "./archive";

describe("Archive", () => {
  it("should create an instance", () => {
    const archive = new Archive({
      numSamps: 4,
    });
    expect(archive).toBeTruthy();
    expect(archive.num_samps).toBe(4);
  });

  it("should return model name", () => {
    expect(Archive.modelName).toBe("Archive");
  });
});
