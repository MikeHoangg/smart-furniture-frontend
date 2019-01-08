import {Component, OnInit} from '@angular/core';
import {ApiService} from '../api.service';
import {MatDialogRef} from '@angular/material';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  error: any;
  user_obj: any;
  fileToUpload: File;
  editProfileForm: FormGroup;

  constructor(private api: ApiService,
              private dialogRef: MatDialogRef<EditProfileComponent>) {
    this.user_obj = this.api.currentUser;
    this.editProfileForm = new FormGroup({
      username: new FormControl(this.user_obj.username, [Validators.required]),
      email: new FormControl(this.user_obj.email, [Validators.required]),
      first_name: new FormControl(this.user_obj.first_name),
      last_name: new FormControl(this.user_obj.last_name),
      height: new FormControl(this.user_obj.height || 0, [Validators.required, Validators.min(0)]),
    });
  }

  ngOnInit() {
  }

  save(): void {
    const formData = new FormData();
    for (const key of Object.keys(this.editProfileForm.value)) {
      formData.append(key, this.editProfileForm.value[key]);
    }
    if (this.fileToUpload) {
      formData.append('image', this.fileToUpload);
    }
    this.api.editCurrentUser(formData).subscribe((response: any) => {
      if (response) {
        this.error = null;
        this.dialogRef.close(true);
      } else {
        this.error = this.api.errorLog.pop();
      }
    });
  }

  getError(field) {
    if (this.editProfileForm.controls[field].hasError('required')) {
      return 'REQUIRED';
    } else if (this.editProfileForm.controls[field].hasError('min')) {
      return 'MIN';
    }
  }

  getParam(field) {
    if (this.editProfileForm.controls[field].hasError('min')) {
      return 0;
    }
  }

  public handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
  }
}
