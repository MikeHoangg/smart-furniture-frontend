import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {ApiService} from '../api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm = new FormGroup({
    username: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required]),
    password1: new FormControl(null, [Validators.required]),
    password2: new FormControl(null, [Validators.required]),
  });
  error: any;

  constructor(private dialogRef: MatDialogRef<RegisterComponent>,
              private api: ApiService,
              public translate: TranslateService) {
  }

  ngOnInit() {
  }

  getError(field) {
    if (this.registerForm.controls[field].hasError('required')) {
      this.translate.get('ERROR.REQUIRED').subscribe((res: string) => {
        return res;
      });
    }
  }

  register() {
    this.api.authorize('register', this.registerForm.value).subscribe((response: any) => {
      if (response) {
        document.cookie = `auth_token=Token ${response.key};path=/`;
        this.error = null;
        this.dialogRef.close(true);
      } else {
        this.error = this.api.errorLog.pop();
      }
    });
  }
}

