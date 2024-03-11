import { NgIf } from "@angular/common";
import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { OrganizationService } from "squacapi";
import { OrganizationPipe } from "squacapi";
import { UserPipe } from "squacapi";
import { SearchFilterConfig, SearchProps } from "./interfaces";

/**
 * Component for searching rows of data
 */
@Component({
  selector: "shared-search-filter",
  templateUrl: "./search-filter.component.html",
  standalone: true,
  imports: [
    UserPipe,
    OrganizationPipe,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    NgIf,
    FormsModule,
  ],
})
export class SearchFilterComponent {
  userPipe: UserPipe;
  orgPipe: OrganizationPipe;
  searchString: string;
  iterateCount = 0;
  @Output() filterChanged = new EventEmitter<any[]>();
  @Input() rows: any[];
  @Input() config: SearchFilterConfig;

  constructor(orgService: OrganizationService) {
    this.userPipe = new UserPipe(orgService);
    this.orgPipe = new OrganizationPipe(orgService);
  }

  /**
   * Search for value in table rows
   *
   * @param event html event
   */
  update(event): void {
    let val = event.target.value;

    if (val) {
      val = val.toLowerCase();
      // go through all rows
      const temp = this.rows.filter((row) => {
        let props = [];
        // make sure there are props to check
        if (this.config.props) {
          props = this.config.props.filter((prop) => {
            // prop has no children and row has prop
            if (typeof prop === "string" && row[prop]) {
              switch (prop) {
                // special case to turn owner id to name string
                case "owner":
                  return this.hasValue(this.userPipe.transform(row.owner), val);

                // special case to turn org id to name string
                case "orgId":
                  return this.hasValue(this.orgPipe.transform(row.orgId), val);

                default:
                  return this.hasValue(row[prop], val);
              }
              // prop has child props and row has child prop value
            } else if (
              typeof prop !== "string" &&
              prop.prop &&
              row[prop.prop]
            ) {
              return this.iterateProps(val, prop, row[prop.prop]);
            }
            return false;
          });
          return props.length > 0;
        }
        return false;
      });
      //send rows with results to parent component
      this.filterChanged.emit([...temp]);
    }
  }

  /**
   * Searches for value in string
   *
   * @param str search string
   * @param val search string
   * @returns true if value found in string
   */
  hasValue(str: string, val: string): boolean {
    return str.toLowerCase().indexOf(val) !== -1;
  }

  /**
   * Iterate through search properties and find value
   *
   * @param val value to search for
   * @param prop search properties
   * @param row row to search
   * @returns true if value found in row
   *
   * recursive, travel props tree and search for value
   *  [
   *    prop: "",
   *    props: [
   *      prop: ""
   *    ]
   *  ]
   */
  iterateProps(val: string, prop: string | SearchProps, row: any): boolean {
    // row has prop
    if (typeof prop === "string" && row[prop]) {
      return this.hasValue(row[prop], val);
    }

    let temp = [];
    if (typeof prop !== "string") {
      //prop has props
      temp = prop.props.filter((childProp: SearchProps | string) => {
        // childprop has children, search deeper
        if (typeof childProp !== "string" && childProp.prop) {
          return this.iterateProps(val, childProp, row[childProp.prop]);
        }
        // row has childprop
        if (
          typeof childProp === "string" &&
          row[childProp] &&
          typeof row[childProp] === "string"
        ) {
          return this.hasValue(row[childProp], val);
        }
        //handle array row
        //[{channel:"", value:""}]
        if (
          typeof childProp === "string" &&
          !row[childProp] &&
          row &&
          row.length > 0
        ) {
          //iterate row values and check
          const childTemp = row.filter((rowValue) => {
            return this.iterateProps(val, childProp, rowValue);
          });

          return childTemp.length > 0;
        }
        return false;
      });
    }

    return temp.length > 0;
  }

  /**
   * Remove filter and emit all rows
   */
  remove(): void {
    this.filterChanged.emit([...this.rows]);
    this.searchString = "";
  }
}
