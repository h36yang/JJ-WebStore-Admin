import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppSettings } from '../app.settings';
import { ApiService } from '../api.service';
import { LoginToken } from './login-token';

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

  constructor(private api: ApiService, private snackBar: MatSnackBar) { }

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
    this.api.userLogin(this.usernameFormControl.value, this.passwordFormControl.value)
      .subscribe(
        (data: LoginToken) => {
          localStorage.setItem(AppSettings.API_TOKEN_KEY, data.token);
          this.loading = false;
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
