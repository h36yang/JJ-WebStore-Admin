import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppSettings } from '../app.settings';
import { User } from '../users/user';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loading: boolean;
  hidePassword: boolean;
  usernameFormControl: FormControl;
  passwordFormControl: FormControl;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UserService) { }

  ngOnInit() {
    this.loading = false;
    this.hidePassword = true;
    this.usernameFormControl = new FormControl('', [Validators.required]);
    this.passwordFormControl = new FormControl('', [Validators.required]);
  }

  login() {
    if (this.usernameFormControl.invalid || this.passwordFormControl.invalid) {
      return;
    }

    this.loading = true;
    this.userService.authenticate(this.usernameFormControl.value, this.passwordFormControl.value)
      .subscribe(
        (data: User) => {
          localStorage.setItem(AppSettings.API_TOKEN_KEY, data.token);
          this.loading = false;
          // Navigate to home page after successful user login
          this.router.navigate(['/']);
        },
        error => {
          this.snackBar.open(error, 'Dismiss', {
            duration: 6000,
            verticalPosition: 'top'
          });
          this.loading = false;
        }
      );
  }
}
