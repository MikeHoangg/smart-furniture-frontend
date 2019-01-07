import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '../api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-furniture',
  templateUrl: './furniture.component.html',
  styleUrls: ['./furniture.component.css']
})
export class FurnitureComponent implements OnInit {
  title: string;
  error: any;
  types: any;
  furnitureForm: FormGroup;

  constructor(private dialogRef: MatDialogRef<FurnitureComponent>,
              private api: ApiService,
              public translate: TranslateService,
              @Inject(MAT_DIALOG_DATA) private furniture_obj: any) {
    this.furnitureForm = new FormGroup({
      code: new FormControl(furniture_obj ? furniture_obj.code : null, [Validators.required]),
      brand: new FormControl(furniture_obj ? furniture_obj.brand : null, [Validators.required]),
      type: new FormControl(furniture_obj ? furniture_obj.type : 'chair', [Validators.required]),
      is_public: new FormControl(furniture_obj ? furniture_obj.is_public : false),
      owner: new FormControl(api.currentUser.id),
    });
    this.title = furniture_obj ? 'EDIT' : 'ADD';
    this.types = api.furnitureTypes;
  }

  ngOnInit() {
  }

  save(): void {
    if (!this.furniture_obj) {
      if (this.furnitureForm.valid) {
        this.api.createObj('furniture', this.furnitureForm.value).subscribe((response: any) => {
          if (response) {
            this.error = null;
            this.dialogRef.close(true);
          } else {
            this.error = this.api.errorLog.pop();
          }
        });
      }
    } else {
      if (this.furnitureForm.valid) {
        this.api.editObj('furniture', this.furniture_obj.id, this.furnitureForm.value).subscribe((response: any) => {
          if (response) {
            this.error = null;
            this.dialogRef.close(true);
          } else {
            this.error = this.api.errorLog.pop();
          }
        });
      }
    }
  }

  getError(field) {
    if (this.furnitureForm.controls[field].hasError('required')) {
      this.translate.get('ERROR.REQUIRED').subscribe((res: string) => {
        return res;
      });
    }
  }
}
