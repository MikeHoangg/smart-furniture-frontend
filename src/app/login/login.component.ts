import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {ApiService} from '../api.service';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  error: any;
  loginForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });

  constructor(private dialogRef: MatDialogRef<LoginComponent>,
              private api: ApiService,
              public translate: TranslateService) {
  }

  ngOnInit() {
  }

  getError(field) {
    if (this.loginForm.controls[field].hasError('required')) {
      this.translate.get('ERROR.REQUIRED').subscribe((res: string) => {
        return res;
      });
    }
  }

  login() {
    this.api.authorize('login', this.loginForm.value).subscribe((response: any) => {
      if (response) {
        this.error = null;
        document.cookie = `auth_token=Token ${response.key};path=/`;
        this.dialogRef.close(true);
      } else {
        this.error = this.api.errorLog.pop();
      }
    });
  }
}
