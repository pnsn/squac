import { NgIf } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { TooltipModule } from "@ui/tooltip/tooltip.module";
import { OrganizationPipe, User } from "squacapi";
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
  standalone: true,
  imports: [
    MatButtonToggleModule,
    TooltipModule,
    OrganizationPipe,
    NgIf,
    FormsModule,
  ],
})
export class SharingToggleComponent implements OnChanges {
  /** true if object shared with organization */
  @Input() shareOrg: boolean;
  /** true if object shared with all users */
  @Input() shareAll: boolean;
  /** existing filters (unused) */
  @Input() filters: any;
  /** user to filter against */
  @Input() user?: User;
  /** organization to filter against */
  @Input() orgId?: number;
  /** true if component is used in a form */
  @Input() isFormInput = false;
  /** text to show on filters */
  @Input() filterText?: FilterText = {
    user: "User",
    all: "All",
  };
  /** Emits value of toggle filters */
  @Output() filtersChange = new EventEmitter<SharedToggleFilter>();
  /** Emits value of shareOrg */
  @Output() shareOrgChange = new EventEmitter<boolean>();
  /** Emits value of shareAll */
  @Output() shareAllChange = new EventEmitter<boolean>();
  /** Filter value options */
  shareFilter: "user" | "all" | "org" = "org";

  /**
   * @inheritdoc
   */
  ngOnChanges(changes: SimpleChanges): void {
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
