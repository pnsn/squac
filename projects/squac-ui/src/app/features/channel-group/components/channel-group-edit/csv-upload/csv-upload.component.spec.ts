import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ChannelGroupModule } from "@channelGroup/channel-group.module";
import { ChannelService } from "squacapi";
import { MockBuilder } from "ng-mocks";
import { NgxCsvParserModule } from "ngx-csv-parser";

import { CsvUploadComponent } from "./csv-upload.component";

describe("CsvUploadComponent", () => {
  let component: CsvUploadComponent;
  let fixture: ComponentFixture<CsvUploadComponent>;

  beforeEach(() => {
    return MockBuilder(CsvUploadComponent, ChannelGroupModule)
      .mock(ChannelService)
      .keep(NgxCsvParserModule);
  });

  it("should create", () => {
    fixture = TestBed.createComponent(CsvUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});