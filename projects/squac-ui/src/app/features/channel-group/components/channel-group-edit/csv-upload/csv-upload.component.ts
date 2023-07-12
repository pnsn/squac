import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { Channel } from "squacapi";
import { DateService } from "@core/services/date.service";
import { LoadingService } from "@core/services/loading.service";
import { ChannelService } from "squacapi";
import { NgxCsvParser, NgxCsvParserModule } from "ngx-csv-parser";
import { switchMap, tap, map, merge, Observable } from "rxjs";
import { TooltipModule } from "@ui/tooltip/tooltip.module";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

/**
 * Component for uploading csvs of channels
 */
@Component({
  selector: "channel-group-csv-upload",
  templateUrl: "./csv-upload.component.html",
  styleUrls: ["./csv-upload.component.scss"],
  standalone: true,
  imports: [NgxCsvParserModule, TooltipModule, MatIconModule, MatButtonModule],
})
export class CsvUploadComponent {
  /** csv rows */
  csvRecords: any;
  /** csv headers */
  csvHeaders: any;
  /** true if has headers */
  header = false;
  /** channels found that match uploaded csv */
  matchingChannels: Channel[];
  /** channels not found */
  missingChannels: any[];
  /** network header regex */
  netRegex = new RegExp(/^Net\w{0,4}/, "i");
  /** station header regex */
  staRegex = new RegExp(/^Sta\w{0,4}/, "i");
  /** channel header regex */
  chanRegex = new RegExp(/^Chan\w{0,4}/, "i");
  /** location header regex */
  locRegex = new RegExp(/^Loc\w{0,5}/, "i");
  /** true if should only return current channels */
  @Input() showOnlyCurrent: boolean;
  /** channels */
  @Input() channels: Channel[];
  /** Found channels */
  @Output() channelsChange = new EventEmitter<Channel[]>();
  /** error message */
  @Input() error: string | boolean;
  /** error message */
  @Output() errorChange = new EventEmitter<string | boolean>();
  /** context for loading sevice */
  @Input() context: any;
  /** loading indicator */
  @Input() loadingIndicator: any;
  constructor(
    private ngxCsvParser: NgxCsvParser,
    private channelService: ChannelService,
    private dateService: DateService,
    private loadingService: LoadingService
  ) {}

  @ViewChild("fileImportInput") fileImportInput: any;

  /**
   * Listen to uploads of files
   *
   * @param $event file uploaded event
   */
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

    // Parse CSV when uploaded
    this.ngxCsvParser
      .parse(files[0], { header: this.header, delimiter: "," }) //allow |?
      .pipe(
        tap((results: any[]) => {
          this.csvRecords = results;
          this.csvHeaders = this.csvRecords.shift();
        }),
        map(() => {
          // check it has correct headers
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
          // remove invalid
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

  /**
   * Emit channels that are found
   */
  addChannels(): void {
    this.channelsChange.emit(this.matchingChannels);
  }
}
