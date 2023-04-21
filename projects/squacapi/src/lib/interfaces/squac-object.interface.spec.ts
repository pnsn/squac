import { modelConstructor, ResourceModel } from "squacapi";
import { BaseModel, ReadOnlyResourceModel } from "./squac-object.interface";

fdescribe("SquacObject", () => {
  interface TestReadSerializer {
    id: number;
    objName: string;
  }
  interface TestWriteSerializer {
    objName: string;
  }
  const testData: TestReadSerializer = {
    id: 1,
    objName: "Test Name",
  };
  interface TestResourceModel {
    id: number;
    objName: string;
    user: number;
    organization: number;
  }
  /** test resource model */
  class TestResourceModel extends ReadOnlyResourceModel<
    TestReadSerializer | TestResourceModel
  > {
    test: string;
  }

  interface TestWriteResourceModel {
    objName: string;
  }
  class TestWriteResourceModel extends ResourceModel<
    TestReadSerializer | TestReadSerializer,
    TestWriteSerializer
  > {
    toJson() {
      return {
        objName: this.objName,
      };
    }
  }

  it("should create and use class functions", () => {
    const deseralizedData = TestResourceModel.deserialize(testData);
    expect(deseralizedData.id).toEqual(testData.id);

    const testObj = new TestResourceModel(testData);
    expect(testObj).toBeDefined();
  });

  it("should return the owner and organization", () => {
    const testObj = new TestResourceModel(testData);
    expect(testObj).toBeDefined();

    expect(testObj.owner).toBeUndefined();
    expect(testObj.orgId).toBeUndefined();
    const testObj2 = new TestResourceModel({
      id: 2,
      objName: "string",
      user: 1,
      organization: 10,
    });
    expect(testObj2).toBeDefined();

    expect(testObj2.owner).toBe(1);
    expect(testObj2.orgId).toBe(10);
  });

  it("resource model should be have toJson", () => {
    const testobj = new TestWriteResourceModel(testData);
    const json = testobj.toJson();
    expect(json.objName).toBe(testData.objName);

    const serialized = TestWriteResourceModel.serialize<
      TestWriteResourceModel,
      TestWriteSerializer
    >(testobj);
    expect(serialized.objName).toBe(testobj.objName);
  });

  it("modelConstructor should return a model of given type with correct data", () => {
    const testObj = modelConstructor<TestResourceModel>(
      TestResourceModel,
      testData
    );
    expect(testObj.id).toBe(testData.id);
  });

  it("base model should be serializeable", () => {
    const testData = {
      test: "value",
    };
    class TestBase extends BaseModel {
      override toJson() {
        return testData;
      }
      override fromRaw(data: any) {
        return data;
      }
    }

    const baseTest = new TestBase();

    const serialized = BaseModel.serialize(baseTest);
    expect(serialized).toEqual(testData);
  });
});
