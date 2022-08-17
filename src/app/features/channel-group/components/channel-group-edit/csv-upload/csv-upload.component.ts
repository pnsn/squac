import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { Channel } from "@core/models/channel";
import { ChannelService } from "@features/channel-group/services/channel.service";
import { NgxCsvParser } from "ngx-csv-parser";
import { switchMap, tap, map } from "rxjs";

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
  @Input() channels: Channel[];
  @Output() channelsChange = new EventEmitter<Channel[]>();
  @Input() loading: string | boolean;
  @Output() loadingChange = new EventEmitter<string | boolean>();
  @Input() error: string | boolean;
  @Output() errorChange = new EventEmitter<string | boolean>();
  constructor(
    private ngxCsvParser: NgxCsvParser,
    private channelService: ChannelService
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
      .parse(files[0], { header: this.header, delimiter: "," })
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

          return this.csvRecords.reduce((previous, current) => {
            const station = current[staIndex];
            return previous ? previous + "," + station : station;
          }, "");
        }),
        switchMap((chanString: string) => {
          //stop before this point if no headers
          this.loadingChange.emit("Requesting channels");
          return this.channelService.getChannelsByFilters({
            station: chanString,
          });
        }),
        tap((channels: Channel[]) => {
          this.loadingChange.emit("Validating channels");

          this.csvRecords.forEach((record) => {
            const channel = channels.find((chan) => {
              const net = record[netIndex];
              const sta = record[staIndex];
              const loc = record[locIndex];
              const code = record[chanIndex];
              return (
                chan.net.toLowerCase() === net.toLowerCase() &&
                chan.sta.toLowerCase() === sta.toLowerCase() &&
                chan.loc.toLowerCase() === loc.toLowerCase() &&
                chan.code.toLowerCase() === code.toLowerCase()
              );
            });
            if (channel) {
              this.matchingChannels.push(channel);
            } else {
              this.missingChannels.push(record);
            }
          });

          if (this.matchingChannels.length === 0) {
            throw new Error("No matching channels found");
          }
        })
      )
      .subscribe({
        next: (): void => {
          this.channelsChange.emit(this.matchingChannels);
          this.loadingChange.emit(false);
        },
        error: (error: any): void => {
          console.log(error);
          this.errorChange.emit(error);
          this.loadingChange.emit(false);
        },
      });
  }

  addChannels() {
    this.channelsChange.emit(this.matchingChannels);
  }
}
