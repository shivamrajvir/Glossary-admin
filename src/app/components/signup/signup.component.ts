import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {SnotifyService} from 'ng-snotify';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  signupForm: FormGroup;

  constructor(private router: Router, private snotify: SnotifyService, private _auth: AuthService) { }

  ngOnInit() {
    this.initSignupForm();
  }

  initSignupForm() {
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      cPassword: new FormControl('', Validators.required)
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

  doSignup() {
    if (this.signupForm.valid) {
      const object = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        phone: this.signupForm.value.phone,
      };
      this._auth.signup(object)
        .then(data => {
          console.log(data);
        })
        .catch(err => {
          console.error(err);
          this.snotify.error('Unable to sign up');
        });
    } else {
      this.snotify.error('Please fill in all the details');
    }
  }

}
