import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { Channel } from "@squacapi/models";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { ChannelService } from "@squacapi/services";
import { NgxCsvParser } from "ngx-csv-parser";
import { switchMap, tap, map, merge, Observable } from "rxjs";

@Component({
  selector: "channel-group-csv-upload",
  templateUrl: "./csv-upload.component.html",
  styleUrls: ["./csv-upload.component.scss"],
})
export class CsvUploadComponent {
  csvRecords: any;
  csvHeaders: any;
  header = false;
  matchingChannels: Channel[];
  missingChannels: any[];
  netRegex = new RegExp(/^Net\w{0,4}/, "i");
  staRegex = new RegExp(/^Sta\w{0,4}/, "i");
  chanRegex = new RegExp(/^Chan\w{0,4}/, "i");
  locRegex = new RegExp(/^Loc\w{0,5}/, "i");
  @Input() showOnlyCurrent: boolean;
  @Input() channels: Channel[];
  @Output() channelsChange = new EventEmitter<Channel[]>();
  @Input() error: string | boolean;
  @Output() errorChange = new EventEmitter<string | boolean>();
  @Input() context: any; //context for loading service
  @Input() loadingIndicator: any;
  constructor(
    private ngxCsvParser: NgxCsvParser,
    private channelService: ChannelService,
    private dateService: DateService,
    private loadingService: LoadingService
  ) {}

  @ViewChild("fileImportInput") fileImportInput: any;

  fileChangeListener($event: any): void {
    this.missingChannels = [];
    this.matchingChannels = [];
    this.channelsChange.emit(this.matchingChannels);
    this.errorChange.emit(false);
    const files = $event.srcElement.files;

    let netIndex = -1;
    let chanIndex = -1;
    let locIndex = -1;
    let staIndex = -1;

    this.ngxCsvParser
      .parse(files[0], { header: this.header, delimiter: "," }) //allow |?
      .pipe(
        tap((results: any[]) => {
          this.csvRecords = results;
          this.csvHeaders = this.csvRecords.shift();
        }),
        map(() => {
          const hasHeaders = this.csvHeaders.some((h, index) => {
            if (netIndex < 0) {
              netIndex = this.netRegex.test(h) ? index : netIndex;
            }
            if (staIndex < 0) {
              staIndex = this.staRegex.test(h) ? index : staIndex;
            }
            if (locIndex < 0) {
              locIndex = this.locRegex.test(h) ? index : locIndex;
            }
            if (chanIndex < 0) {
              chanIndex = this.chanRegex.test(h) ? index : chanIndex;
            }
            return (
              netIndex >= 0 && staIndex >= 0 && locIndex >= 0 && chanIndex >= 0
            );
          });

          if (!hasHeaders) {
            throw new Error("Invalid or missing headers");
          }

          const queryStrings = [];
          let channelsCount = 0;
          this.csvRecords.reduce((previous, current, currentIndex) => {
            const nslc = `${current[netIndex]}.${current[staIndex]}.${
              current[locIndex] || "--"
            }.${current[chanIndex]}`;

            const str = previous
              ? previous + "," + nslc.toLowerCase()
              : nslc.toLowerCase();
            if (
              channelsCount > 500 ||
              currentIndex === this.csvRecords.length - 1
            ) {
              queryStrings.push(str);
              channelsCount = 0;
              return "";
            }
            channelsCount++;
            return str;
          }, "");
          return queryStrings;
        }),
        switchMap((nslcStrings: string[]) => {
          //stop before this point if no headers
          const searchFilters: any = {};
          if (this.showOnlyCurrent) {
            const now = this.dateService.now();
            searchFilters.endafter = this.dateService.format(now);
          }

          //break up into smaller chunks to get around header size limit
          const queries: Observable<Channel[]>[] = nslcStrings.map(
            (nslcString) => {
              return this.channelService.list({
                nslc: nslcString,
                ...searchFilters,
              });
            }
          );

          return this.loadingService.doLoading(
            merge(...queries),
            this.context,
            this.loadingIndicator
          );
        })
      )
      .subscribe({
        next: (channels: Channel[]): void => {
          this.matchingChannels.push(...channels);
        },
        complete: () => {
          if (this.matchingChannels.length === 0) {
            throw new Error("No matching channels found");
          }
          this.channelsChange.emit(this.matchingChannels);
        },
        error: (error: any): void => {
          this.errorChange.emit(error);
        },
      });
  }

  addChannels() {
    this.channelsChange.emit(this.matchingChannels);
  }
}
