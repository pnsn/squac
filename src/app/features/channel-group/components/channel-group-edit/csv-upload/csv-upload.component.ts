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
import { switchMap, tap, map } from "rxjs";

@Component({
  selector: "channel-group-csv-upload",
  templateUrl: "./csv-upload.component.html",
  styleUrls: ["./csv-upload.component.scss"],
})
export class CsvUploadComponent {
  csvRecords: any;
  header = true;
  matchingChannels: Channel[];
  missingChannels: any[];
  status;
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
    this.header =
      (this.header as unknown as string) === "true" || this.header === true;

    let chanString = "";
    this.ngxCsvParser
      .parse(files[0], { header: this.header, delimiter: "," })
      .pipe(
        tap({
          next: (results) => {
            this.status = "requesting channels";
            this.csvRecords = results;
          },
        }),
        switchMap((results: any[], i) => {
          this.csvRecords = results;
          this.csvRecords.forEach((channel) => {
            const code = channel.station;
            if (code) {
              chanString += code + ",";
            }
          });

          return this.channelService.getChannelsByFilters({
            station: chanString,
          });
        }),
        tap((channels: Channel[]) => {
          console.log(channels);
          this.status = "validating channels";
          this.csvRecords.forEach((record) => {
            const channel = channels.find((chan) => {
              const net = record.network || record.net;
              const sta = record.station || record.sta;
              const loc = record.location || record.loc;
              const code = record.channel || record.chan;

              return (
                chan.net.toUpperCase() === net.toUpperCase() &&
                chan.sta.toUpperCase() === sta.toUpperCase() &&
                chan.loc.toUpperCase() === loc.toUpperCase() &&
                chan.code.toUpperCase() === code.toUpperCase()
              );
            });
            if (channel) {
              this.matchingChannels.push(channel);
            } else {
              this.missingChannels.push(record);
            }
          });
        })
      )
      .subscribe({
        next: (result): void => {
          console.log(result);
          console.log("Result", chanString);
          this.status = "done";
          this.channelsChange.emit(this.matchingChannels);
        },
        error: (error: NgxCSVParserError): void => {
          console.log("Error", error);
        },
      });
  }

  addChannels() {
    this.channelsChange.emit(this.matchingChannels);
  }
}
