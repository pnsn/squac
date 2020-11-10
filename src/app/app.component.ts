import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigurationService } from '@core/services/configuration.service';
import { MessageService } from '@core/services/message.service';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

// App parent component
export class AppComponent implements OnInit {
  title;
  constructor(
    private authService: AuthService,
    configService: ConfigurationService,
  ) {
    this.title = configService.getValue('appTitle', 'SQUAC');
  }


  ngOnInit() {
    this.authService.autologin();
  }

}
