import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { User } from '../users/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: User;

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
    // Check if we are logged in or not
    if (this.userService.isAuthenticated()) {
      this.userService.getCurrentUser().subscribe(
        (data: User) => this.user = data
      );
    } else {
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.userService.logoff();
  }
}
