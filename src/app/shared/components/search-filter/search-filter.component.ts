import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { OrganizationService } from "@features/user/services/organization.service";
import { UserService } from "@features/user/services/user.service";
import { OrganizationPipe } from "@shared/pipes/organization.pipe";
import { UserPipe } from "@shared/pipes/user.pipe";

@Component({
  selector: "shared-search-filter",
  templateUrl: "./search-filter.component.html",
  styleUrls: ["./search-filter.component.scss"],
})
export class SearchFilterComponent {
  userPipe;
  orgPipe;
  searchString;
  iterateCount = 0;
  @Output() filterChanged = new EventEmitter<any[]>();
  @Input() rows: any[];
  @Input() config;

  constructor(
    private userService: UserService,
    private orgService: OrganizationService
  ) {
    this.userPipe = new UserPipe(orgService);
    this.orgPipe = new OrganizationPipe(orgService);
  }

  // search for value in the table rows
  update(event) {
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
            } else if (prop.prop && row[prop.prop]) {
              return this.iterateProps(val, prop, row[prop.prop]);
            }
            return false;
          });
          return props.length > 0;
        }
      });
      //send rows with results to parent component
      this.filterChanged.emit([...temp]);
    }
  }

  // returns true if val found in str
  hasValue(str, val): boolean {
    return str.toLowerCase().indexOf(val) !== -1;
  }

  // recursive, travel props tree and search for value
  // [
  //   prop: "",
  //   props: [
  //     prop: ""
  //   ]
  // ]
  iterateProps(val, prop, row): boolean {
    // row has prop
    if (row[prop]) {
      return this.hasValue(row[prop], val);
    }

    //prop has props
    const temp = prop.props.filter((childProp) => {
      // childprop has children, search deeper
      if (childProp.prop) {
        return this.iterateProps(val, childProp, row[childProp.prop]);
      }
      // row has childprop
      if (row[childProp] && typeof row[childProp] === "string") {
        return this.hasValue(row[childProp], val);
      }
      //handle array row
      //[{channel:"", value:""}]
      if (!row[childProp] && row && row.length > 0) {
        console.log("row is array", childProp, row);
        //iterate row values and check
        const childTemp = row.filter((rowValue) => {
          return this.iterateProps(val, childProp, rowValue);
        });

        return childTemp.length > 0;
      }
      return false;
    });

    return temp.length > 0;
  }

  // remove filter and set rows to all
  remove() {
    this.filterChanged.emit([...this.rows]);
    this.searchString = "";
  }
}
