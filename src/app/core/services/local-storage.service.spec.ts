import { TestBed } from "@angular/core/testing";

import {
  LocalStorageService,
  LocalStorageTypes,
} from "./local-storage.service";

describe("LocalStorageService", () => {
  let service: LocalStorageService;
  // let localStore = {};

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalStorageService);
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should add items to localStorage", () => {
    const setItemLocalSpy = spyOn(localStorage, "setItem");
    const setItemSessSpy = spyOn(sessionStorage, "setItem");
    LocalStorageService.setItem(LocalStorageTypes.LOCAL, "foo", "bar");
    expect(setItemLocalSpy).toHaveBeenCalled();

    LocalStorageService.setItem(LocalStorageTypes.SESSION, "foo", "bar");
    expect(setItemSessSpy).toHaveBeenCalled();
  });

  it("should get items from localStorage", () => {
    const getItemLocalSpy = spyOn(localStorage, "getItem");
    const getItemSessSpy = spyOn(sessionStorage, "getItem");
    LocalStorageService.getItem(LocalStorageTypes.LOCAL, "foo");
    expect(getItemLocalSpy).toHaveBeenCalled();

    LocalStorageService.getItem(LocalStorageTypes.SESSION, "foo");
    expect(getItemSessSpy).toHaveBeenCalled();
  });

  it("should remove items from localStorage", () => {
    const removeItemLocalSpy = spyOn(localStorage, "removeItem");
    const removeItemSessSpy = spyOn(sessionStorage, "removeItem");
    LocalStorageService.removeItem(LocalStorageTypes.LOCAL, "foo");
    expect(removeItemLocalSpy).toHaveBeenCalled();

    LocalStorageService.removeItem(LocalStorageTypes.SESSION, "foo");
    expect(removeItemSessSpy).toHaveBeenCalled();
  });
});
