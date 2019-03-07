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
      email: new FormControl('', [Validators.required, Validators.email]),
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
      });
    } else {
      this.snotify.error('Please Enter credentials properly!');
    }
  }

}
