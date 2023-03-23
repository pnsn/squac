import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";
import { User } from "squacapi";
import { FilterText, SharedToggleFilter } from "./sharing-toggle.interface";

/**
 * Button toggles for sharing permissions
 *
 * @example
 * <shared-sharing-toggle
 *  [user]="user"
 *  [(shareOrg)]="shareOrg"
 *  [(shareAll)]="shareAll"
 *  (filtersChange)="toggleSharing($event)" >
 * </shared-sharing-toggle>
 */
@Component({
  selector: "shared-sharing-toggle",
  templateUrl: "./sharing-toggle.component.html",
  styleUrls: ["./sharing-toggle.component.scss"],
})
export class SharingToggleComponent {
  @Input() shareOrg: boolean;
  @Input() shareAll: boolean;
  @Input() filters: any;
  @Input() user?: User;
  @Input() orgId?: number;
  @Input() filterText?: FilterText = {
    user: "User",
    all: "All",
  };
  @Output() filtersChange = new EventEmitter<SharedToggleFilter>();
  @Output() shareOrgChange = new EventEmitter<boolean>();
  @Output() shareAllChange = new EventEmitter<boolean>();
  shareFilter: "user" | "all" | "org" = "org";
  constructor() {}

  /**
   * respond to input changes
   * @param changes changes from inputs
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes["shareOrg"] && changes["shareAll"]) {
      this.setToggle();
    }
  }

  /** set share filter state based on input */
  setToggle(): void {
    if (this.shareAll) {
      this.shareFilter = "all";
    } else if (this.shareOrg) {
      this.shareFilter = "org";
    } else {
      this.shareFilter = "user";
    }
  }

  /**
   * Change sharing settings and filter table to match
   */
  toggleSharing(): void {
    this.updateFilters();

    this.shareAllChange.emit(this.shareFilter === "all");
    this.shareOrgChange.emit(
      this.shareFilter === "all" || this.shareFilter === "org"
    );
  }

  /** Update filters with user and org ids */
  updateFilters(): void {
    const params: SharedToggleFilter = {};

    if (this.shareFilter === "user" && this.user) {
      params.user = this.user.id;
    } else if (this.shareFilter === "org" && (this.user || this.orgId)) {
      params.organization = this.user?.orgId ?? this.orgId;
    }
    this.filtersChange.emit(params);
  }
}
