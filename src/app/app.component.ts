import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// App parent component
export class AppComponent implements OnInit {
  title = 'squac-ui';
  constructor(
    private authService: AuthService
  ) {}


  ngOnInit() {
    this.authService.autologin();

  }

}
