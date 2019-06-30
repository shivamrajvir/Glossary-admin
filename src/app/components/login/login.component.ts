import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnotifyService } from 'ng-snotify';
import { HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  forgotForm: FormGroup;
  loading = false;
  isLogin = false;

  constructor(private router: Router, private _auth: AuthService, private snotify: SnotifyService,
    private _actRoute: ActivatedRoute, private snackbar: MatSnackBar) { }

  ngOnInit() {
    if (this._actRoute.snapshot.routeConfig.path.includes('login')) {
      this.isLogin = true;
      this.initializeForm();
    } else {
      this.isLogin = false;
      this.initForgotForm();
    }
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required)
    });
  }

  initForgotForm() {
    this.forgotForm = new FormGroup({
      phone: new FormControl('')
    });
  }

  goToSignupPage() {
    this.router.navigate(['signup']);
  }

  doLogin() {
    if (this.loginForm.valid) {
      this.startLoading();
      const params = new HttpParams()
        .set('phone', this.loginForm.value.phone)
        .set('password', this.loginForm.value.password);
      this._auth.login(params)
        .then(data => {
          if (data['sta'] === 1 && data['role'] === '2') {
            this.router.navigate(['dashboard']);
          } else {
            this.snackbar.open('Login Failed', 'Error', {
              duration: 4000
            });
          }
          this.stopLoading();
        })
        .catch(err => {
          this.stopLoading();
          console.error(err);
          const error = (err.error && err.error.error && err.error.error.message) ? err.error.error.message : 'Internal Server Error';
          this.snackbar.open(error, 'Error', {
            duration: 4000
          });
        });
    } else {
      this.snackbar.open('Please Enter credentials properly', 'Error', {
        duration: 4000
      });
    }
  }


  doForgetPassword() {
    if (!(this.forgotForm.controls['phone'].value && this.forgotForm.controls['phone'].value.toString().length === 10)) {
      this.snackbar.open('Phone number must be of 10 digits', 'Error', {
        duration: 4000
      });
      return;
    }
    this.startLoading();
    const params = new HttpParams()
      .set('phone', this.forgotForm.controls['phone'].value);
    this._auth.forgotPassword(params)
      .then(data => {
        this.goToLogin();
        this.stopLoading();
      })
      .catch(err => {
        this.stopLoading();
        console.error(err);
        const error = (err.error && err.error.error && err.error.error.message) ? err.error.error.message : 'Internal Server Error';
        this.snackbar.open(error, 'Error', {
          duration: 4000
        });
      });
  }

  restrictInput(e) {
    if (e.target.value.toString().length === 10) {
      e.preventDefault();
    }
    if (e.keyCode === 43 || e.keyCode === 101 || e.keyCode === 45 || e.keyCode === 46) {
      e.preventDefault();
    }
  }

  startLoading() {
    this.loading = true;
  }

  stopLoading() {
    this.loading = false;
  }

  triggerForgotPassword() {
    this.router.navigate(['forgot-password']);
  }

  goToLogin() {
    this.router.navigate(['login']);
  }

}
