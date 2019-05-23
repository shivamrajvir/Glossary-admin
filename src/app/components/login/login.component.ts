import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {SnotifyService} from 'ng-snotify';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;

  constructor(private router: Router, private _auth: AuthService, private snotify: SnotifyService) { }

  ngOnInit() {
    this.initializeForm();
  }

  initializeForm() {
    this.loginForm = new FormGroup({
      phone: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required)
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
        this.router.navigate(['dashboard']);
        if (data['sta'] === 1) {
          this.router.navigate(['dashboard']);
        } else {
          this.snotify.error('Error: Internal Server Error');
        }
        this.stopLoading();
      })
      .catch(err => {
        this.stopLoading();
        console.error(err);
        const error = (err.error && err.error.error && err.error.error.message) ? err.error.error.message : 'Internal Server Error';
        this.snotify.error('Error: ' + error);
      });
    } else {
      this.snotify.error('Please Enter credentials properly!');
    }
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

}
