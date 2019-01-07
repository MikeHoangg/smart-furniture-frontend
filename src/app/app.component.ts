import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {LoginComponent} from './login/login.component';
import {ApiService} from './api.service';
import {RegisterComponent} from './register/register.component';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  currentUserId: number;

  constructor(private dialog: MatDialog,
              private api: ApiService,
              public translate: TranslateService,
              private router: Router) {
    translate.addLangs(['en', 'uk']);
    translate.setDefaultLang('en');
    const lang = document.cookie.match(/lang=(\w+)/);
    translate.use(lang ? lang[1] : 'en');
    if (api.currentUser) {
      this.currentUserId = api.currentUser.id;
    }
  }

  ngOnInit() {
  }

  openDialog(name: string): void {
    let dialogRef;
    if (name === 'login') {
      dialogRef = this.dialog.open(LoginComponent);
    } else if (name === 'register') {
      dialogRef = this.dialog.open(RegisterComponent);
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.redirect();
      }
    });
  }

  redirect() {
    this.api.getCurrentUser().subscribe((response: any) => {
      if (response) {
        this.api.currentUser = response;
        this.currentUserId = this.api.currentUser.id;
        this.router.navigateByUrl(`/profile`);
      }
    });
  }

  setLang(lang) {
    this.api.apiUrl = `http://127.0.0.1:8000/${lang}/api/v1`;
    this.translate.use(lang);
    document.cookie = `lang=${lang};path=/`;
  }

  logout(): void {
    this.api.authorize('logout').subscribe((response: any) => {
      if (response) {
        document.cookie = 'auth_token=;path=/';
        this.api.currentUser = null;
        this.currentUserId = null;
      }
    });
  }
}
