import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  private userSub : Subscription;
  isAuthenticated : boolean = false;
  constructor(
    private authService : AuthService
  ) { }


  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user;
      console.log("is authenticated", this.isAuthenticated);
      if(user) {
        //do stuff
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
  
  logout() {
    this.authService.logout();
  }
}
