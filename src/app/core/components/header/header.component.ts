import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User } from '@features/user/models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Input() user: User;

  constructor(
    private authService: AuthService
  ) { }

  logout() {
    this.authService.logout();
  }
}
