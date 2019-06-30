import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, Inject} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { AuthService } from './../services/auth.service';
import { MatDialog, MatSnackBar, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { HttpClient, HttpParams } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        overflow: 'hidden',
        height: '*',
        width: '250px'
      })),
      state('out', style({
        opacity: '0',
        overflow: 'hidden',
        height: '0px',
        width: '250px'
      })),
      transition('in => out', animate('400ms ease-in-out')),
      transition('out => in', animate('400ms ease-in-out'))
    ])
  ]

})
export class DashboardComponent implements OnInit {
  mobileQuery: MediaQueryList;
  showMenu = 'out';
  showReports = 'out';

  private _mobileQueryListener: () => void;
  @ViewChild('navbar') navbarToggle: ElementRef;
  constructor(private changeDetectorRef: ChangeDetectorRef, protected media: MediaMatcher,
     private auth: AuthService, protected dialog: MatDialog) { }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  openActivities() {
    this.showReports = 'out';
    this.showMenu = this.showMenu === 'out' ? 'in' : 'out';
  }

  openReports() {
    this.showMenu = 'out';
    this.showReports = this.showReports === 'out' ? 'in' : 'out';
  }

  doLogout() {
    this.auth.logout();
  }

  openChangePasswordModal() {
    const dialogRef = this.dialog.open(ChangePasswordModalComponent, {
      width: '600px',
      data: {}
    });

    // dialogRef.afterClosed().subscribe(result => {
      
    // });
  }

}


@Component({
  templateUrl: 'change-password.html',
})
export class ChangePasswordModalComponent {
  isLoading = false;
  changeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data,
    public snackbar: MatSnackBar,
    private _auth: AuthService) {
    this.initializeForm();
  }

  initializeForm(data?) {
    this.changeForm = new FormGroup({
      phone: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
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

  closeModal(): void {
    this.dialogRef.close();
  }

  changePassword() {
    if (!(this.changeForm.controls['phone'].value && this.changeForm.controls['phone'].value.toString().length === 10)) {
      this.snackbar.open('Phone number must be of 10 digits', 'Error', {
        duration: 4000
      });
      return;
    }
    if (!this.changeForm.controls['password'].value) {
      this.snackbar.open('Please Enter password', 'Error', {
        duration: 4000
      });
      return;
    }

    this.isLoading = true;
      const params = new HttpParams()
        .set('phone', this.changeForm.value.phone)
        .set('password', this.changeForm.value.password);
      this._auth.changePassword(params)
        .then(data => {
          this.closeModal();
          this.isLoading = false;
          this.snackbar.open('Your password was changed successfully!', 'Success', {
            duration: 4000
          });
        })
        .catch(err => {
          this.isLoading = false;
          console.error(err);
          const error = (err.error && err.error.error && err.error.error.message) ? err.error.error.message : 'Internal Server Error';
          this.snackbar.open(error, 'Error', {
            duration: 4000
          });
        });


  }


}