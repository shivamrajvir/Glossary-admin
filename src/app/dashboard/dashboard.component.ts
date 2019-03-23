import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {animate, state, style, transition, trigger} from '@angular/animations';
import { AuthService } from './../services/auth.service';

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
  showDailyActivity = 'out';

  private _mobileQueryListener: () => void;
  @ViewChild('navbar') navbarToggle: ElementRef;
  constructor(private changeDetectorRef: ChangeDetectorRef, protected media: MediaMatcher,
     private auth: AuthService) { }

  ngOnInit() {
    this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  openActivities() {
    this.showDailyActivity = 'out';
    this.showMenu = this.showMenu === 'out' ? 'in' : 'out';
  }

  openDailyActivities() {
    this.showMenu = 'out';
    this.showDailyActivity = this.showDailyActivity === 'out' ? 'in' : 'out';
  }

  doLogout() {
    this.auth.logout();
  }

}
