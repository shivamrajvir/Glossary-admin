import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {SnotifyService} from 'ng-snotify';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

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
    this._auth.login(this.loginForm.value)
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.error(err);
        this.router.navigate(['dashboard']);
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

}
