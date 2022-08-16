import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Channel } from "@core/models/channel";
import { ChannelService } from "@features/channel-group/services/channel.service";
import { NgxCsvParser, NgxCSVParserError } from "ngx-csv-parser";
import { switchMap, tap, map, catchError, of, throwError, filter } from "rxjs";

@Component({
  selector: "channel-group-csv-upload",
  templateUrl: "./csv-upload.component.html",
  styleUrls: ["./csv-upload.component.scss"],
})
export class CsvUploadComponent {
  csvRecords: any;
  csvHeaders: any;
  header = false;
  error = "";
  matchingChannels: Channel[];
  missingChannels: any[];
  status;
  netRegex = new RegExp(/^Net\w{0,4}/, "i");
  staRegex = new RegExp(/^Sta\w{0,4}/, "i");
  chanRegex = new RegExp(/^Chan\w{0,4}/, "i");
  locRegex = new RegExp(/^Loc\w{0,5}/, "i");
  @Input() channels: Channel[];
  @Output() channelsChange = new EventEmitter<Channel[]>();
  constructor(
    private ngxCsvParser: NgxCsvParser,
    private channelService: ChannelService
  ) {}

  @ViewChild("fileImportInput") fileImportInput: any;

  fileChangeListener($event: any): void {
    this.status = "parsing";
    this.missingChannels = [];
    this.matchingChannels = [];
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
            throw new Error("Headers missing");
          }

          return this.csvRecords.reduce((previous, current) => {
            const station = current[staIndex];
            return previous ? previous + "," + station : station;
          }, "");
        }),
        switchMap((chanString: string) => {
          //stop before this point if no headers
          console.log(chanString);
          this.status = "requesting channels";
          return this.channelService.getChannelsByFilters({
            station: chanString,
          });
        }),
        tap((channels: Channel[]) => {
          this.status = "validating channels";

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
            throw new Error("no matching channels found");
          }
        })
      )
      .subscribe({
        next: (result): void => {
          console.log(this.matchingChannels);
          this.status = "done";
          this.channelsChange.emit(this.matchingChannels);
        },
        error: (error: any): void => {
          this.error = error;
          console.log("Error", error);
        },
      });
  }

  addChannels() {
    this.channelsChange.emit(this.matchingChannels);
  }
}
