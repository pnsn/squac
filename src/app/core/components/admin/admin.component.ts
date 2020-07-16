import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user.service';
import { OrganizationsService } from '@core/services/organizations.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  user;
  organizations;
  constructor(
    private userService: UserService,
    private orgService : OrganizationsService
  ) { }

  ngOnInit(): void {
    this.userService.user.subscribe(
      user => this.user = user
    );

    this.orgService.organizations.subscribe(
      organizations => {
        this.organizations = organizations;
      }
    );
    console.log(this.organizations)
  }

  getOrgName(id) {
    return this.organizations.find(
      org => org.id === id
    );
  }
  //get user 
  // get organizations
  // select organization to edit
  // configure squac subpage?
  // edit organization route
}
