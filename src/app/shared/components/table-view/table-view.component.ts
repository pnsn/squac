import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";

@Component({
  selector: "app-table-view",
  templateUrl: "./table-view.component.html",
  styleUrls: ["./table-view.component.scss"],
})
export class TableViewComponent implements OnInit {
  rowCount = 3;
  @Input() title: string;
  @Output() refresh = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}
}
