import { GuardTypePipe, TypeGuard } from "./guard-type.pipe";

interface Parent {
  type: "Extended1" | "Extended2";
  otherProp: any;
}
interface Extended1 extends Parent {
  type: "Extended1";
  otherProp: {
    test1: string;
  };
}

interface Extended2 extends Parent {
  type: "Extended2";
  otherProp: {
    test2: string;
  };
}

const isExtended1: TypeGuard<Parent, Extended1> = (
  obj: Parent
): obj is Extended1 => obj.type === "Extended1";

const isExtended2: TypeGuard<Parent, Extended2> = (
  obj: Parent
): obj is Extended2 => obj.type === "Extended2";

describe("PrecisionPipe", () => {
  let pipe: GuardTypePipe;

  beforeEach(() => {
    pipe = new GuardTypePipe();
  });

  it("create an instance", () => {
    expect(pipe).toBeTruthy();
  });

  it("correctly asserts type", () => {
    const value1: Extended1 = {
      type: "Extended1",
      otherProp: {
        test1: "test value",
      },
    };
    const value2: Extended2 = {
      type: "Extended2",
      otherProp: {
        test2: "test value 2",
      },
    };

    expect(pipe.transform(value1, isExtended1)).toBe(value1);
    expect(pipe.transform(value1, isExtended2)).toBeUndefined();
    expect(pipe.transform(value2, isExtended1)).toBeUndefined();
    expect(pipe.transform(value2, isExtended2)).toBe(value2);
  });
});
