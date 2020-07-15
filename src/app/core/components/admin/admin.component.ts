import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  user;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.user.subscribe(
      user => this.user = user
    );
  }

  //get user 
  // get organizations
  // select organization to edit
  // configure squac subpage?
  // edit organization route
}
