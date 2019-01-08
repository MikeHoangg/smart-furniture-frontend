import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '../api.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.css']
})
export class OptionsComponent implements OnInit {
  title: string;
  error: any;
  types: any;
  optionsForm: FormGroup;
  massage_types: any[] = [];
  rigidity_types: any[] = [];
  prime_types: string[] = [];
  is_prime_type: boolean;

  constructor(private dialogRef: MatDialogRef<OptionsComponent>,
              private api: ApiService,
              @Inject(MAT_DIALOG_DATA) private option_obj: any) {
    this.title = option_obj ? 'EDIT' : 'ADD';

    this.optionsForm = new FormGroup({
      type: new FormControl(this.option_obj ? this.option_obj.type : 'chair', [Validators.required]),
      name: new FormControl(this.option_obj ? this.option_obj.name : null, [Validators.required, Validators.maxLength(32)]),
      height: new FormControl(this.option_obj ? this.option_obj.height : Math.round(api.currentUser.height * 3 / 7), [Validators.min(0)]),
      length: new FormControl(this.option_obj ? this.option_obj.length : Math.round(api.currentUser.height * 2 / 7), [Validators.min(0)]),
      width: new FormControl(this.option_obj ? this.option_obj.width : Math.round(api.currentUser.height * 2 / 7), [Validators.min(0)]),
      incline: new FormControl(this.option_obj ? this.option_obj.incline : 95, [Validators.max(180), Validators.min(0)]),
      temperature: new FormControl(this.option_obj ? this.option_obj.temperature : 36.6),
      massage: new FormControl(this.option_obj ? this.option_obj.massage : 'none'),
      rigidity: new FormControl(this.option_obj ? this.option_obj.rigidity : 'medium'),
      creator: new FormControl(api.currentUser.id),
    });
    this.types = api.furnitureTypes;
    for (const type of api.massageRigidityTypes) {
      if (type.type === 'massage') {
        this.massage_types.push(type);
      } else {
        this.rigidity_types.push(type);
      }
    }
    for (const t of this.types) {
      if (t.prime_actions) {
        this.prime_types.push(t.name);
      }
    }
    this.is_prime_type = option_obj ? this.prime_types.includes(option_obj.type) : true;
  }

  ngOnInit() {
  }

  getError(field) {
    if (this.optionsForm.controls[field].hasError('required')) {
      return 'REQUIRED';
    } else if (this.optionsForm.controls[field].hasError('maxLength')) {
      return 'MAX_LENGTH';
    } else if (this.optionsForm.controls[field].hasError('min')) {
      return 'MIN';
    } else if (this.optionsForm.controls[field].hasError('max')) {
      return 'MAX';
    }
  }

  getParam(field) {
    if (this.optionsForm.controls[field].hasError('maxLength')) {
      return 32;
    } else if (this.optionsForm.controls[field].hasError('min')) {
      return 0;
    } else if (this.optionsForm.controls[field].hasError('max')) {
      return 180;
    }
  }

  save(): void {
    if (!this.option_obj) {
      if (this.optionsForm.valid) {
        this.api.createObj('options', this.optionsForm.value).subscribe((response: any) => {
          if (response) {
            this.error = null;
            this.dialogRef.close(true);
          } else {
            this.error = this.api.errorLog.pop();
          }
        });
      }
    } else {
      if (this.optionsForm.valid) {
        this.api.editObj('options', this.option_obj.id, this.optionsForm.value).subscribe((response: any) => {
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

  isPrimeAccount() {
    if (this.api.currentUser && this.api.currentUser.prime_expiration_date) {
      const expiration_date = new Date(this.api.currentUser.prime_expiration_date);
      let today = new Date();
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (today <= expiration_date) {
        return true;
      }
    }
    return false;
  }

  onTypeChange() {
    this.is_prime_type = this.prime_types.includes(this.optionsForm.value['type']);
    switch (this.optionsForm.value['type']) {
      case 'sofa':
        this.optionsForm.patchValue({
          height: Math.round(this.api.currentUser.height * 3 / 7),
          length: Math.round(this.api.currentUser.height * 3 / 7),
          width: Math.round(this.api.currentUser.height * 3 / 7),
        });
        break;
      case 'bed':
        this.optionsForm.patchValue({
          height: Math.round(this.api.currentUser.height * 3 / 7),
          length: Math.round(this.api.currentUser.height * 10 / 7),
          width: Math.round(this.api.currentUser.height * 9 / 7),
        });
        break;
      case 'chair':
        this.optionsForm.patchValue({
          height: Math.round(this.api.currentUser.height * 3 / 7),
          length: Math.round(this.api.currentUser.height * 2 / 7),
          width: Math.round(this.api.currentUser.height * 2 / 7),
        });
        break;
      case 'table':
        this.optionsForm.patchValue({
          height: Math.round(this.api.currentUser.height * 4 / 7),
          length: Math.round(this.api.currentUser.height * 4 / 7),
          width: Math.round(this.api.currentUser.height * 5 / 7),
        });
        break;
      case 'desk':
        this.optionsForm.patchValue({
          height: Math.round(this.api.currentUser.height * 4 / 7),
          length: Math.round(this.api.currentUser.height * 4 / 7),
          width: Math.round(this.api.currentUser.height * 5 / 7),
        });
        break;
      case 'cupboard':
        this.optionsForm.patchValue({
          height: Math.round(this.api.currentUser.height * 10 / 7),
          length: Math.round(this.api.currentUser.height * 3 / 7),
          width: Math.round(this.api.currentUser.height * 5 / 7),
        });
        break;
      default:
        break;
    }
  }
}
