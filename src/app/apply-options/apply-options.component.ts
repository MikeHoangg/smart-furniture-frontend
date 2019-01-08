import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {ApiService} from '../api.service';
import {MatSnackBar} from '@angular/material';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-apply-options',
  templateUrl: './apply-options.component.html',
  styleUrls: ['./apply-options.component.css']
})
export class ApplyOptionsComponent implements OnInit {
  error: any;
  status: any;
  applyOptionsForm: FormGroup;
  discardOptionsForm: FormGroup;
  options: any;
  curr_opts: any;
  prime_types: any[] = [];


  constructor(@Inject(MAT_DIALOG_DATA) public furniture_obj: any,
              private dialogRef: MatDialogRef<ApplyOptionsComponent>,
              private api: ApiService,
              public snackBar: MatSnackBar,
              public translate: TranslateService) {
    this.curr_opts = this.getCurrentOptions();
    this.applyOptionsForm = new FormGroup({
      options: new FormControl(this.curr_opts ? this.curr_opts.id : null, [Validators.required]),
      furniture: new FormControl(furniture_obj.id)
    });
    this.discardOptionsForm = new FormGroup({
      user: new FormControl(api.currentUser ? api.currentUser.id : null),
      furniture: new FormControl(furniture_obj.id)
    });
    this.options = this.getOptions();
    if (api.furnitureTypes) {
      for (const t of api.furnitureTypes) {
        if (t.prime_actions) {
          this.prime_types.push(t.name);
        }
      }
    }
  }

  ngOnInit() {
  }

  getError(field) {
    if (this.applyOptionsForm.controls[field].hasError('required')) {
      return 'REQUIRED';
    }
  }

  getOptions(): any[] {
    const options = [];
    if (this.api.currentUser) {
      for (const o of this.api.currentUser.options_set) {
        if (this.furniture_obj.type === o.type) {
          options.push(o);
        }
      }
    }
    return options;
  }

  getCurrentOptions(): any {
    if (this.api.currentUser) {
      for (const o of this.api.currentUser.options_set) {
        for (const co of this.furniture_obj.current_options) {
          if (o.id === co.id) {
            return o;
          }
        }
      }
    }
    return null;
  }

  yes(): void {
    this.no();
    if (this.api.currentUser) {
      this.api.createObj('notifications', {
        'sender': this.api.currentUser.id,
        'receiver': this.furniture_obj.owner.id,
        'furniture': this.furniture_obj.id,
      }).subscribe((response: any) => {
          if (response) {
            this.translate.get('ACTION.SENT').subscribe((res: string) => {
              this.snackBar.open(res, 'OK', {
                duration: 5000,
              });
            });
          }
        }
      );
    }
  }

  no(): void {
    this.error = null;
    this.status = null;
  }

  apply(): void {
    if (this.applyOptionsForm.valid) {
      this.api.createObj('apply-options', this.applyOptionsForm.value).subscribe((response: any) => {
        if (response) {
          this.no();
          this.dialogRef.close(true);
          this.snackBar.open(response.detail, 'OK', {
            duration: 5000,
          });
        } else {
          this.status = this.api.statusLog.pop();
          this.error = this.api.errorLog.pop();
        }
      });
    }
  }

  discard(): void {
    if (this.discardOptionsForm.valid) {
      this.api.createObj('discard-options', this.discardOptionsForm.value).subscribe((response: any) => {
        if (response) {
          this.error = null;
          this.dialogRef.close(true);
          this.snackBar.open(response.detail, 'OK', {
            duration: 5000,
          });
        } else {
          this.error = this.api.errorLog.pop();
          this.status = this.api.statusLog.pop();
        }
      });
    }
  }

  isFurnitureOwner() {
    if (this.api.currentUser) {
      for (const f of this.api.currentUser.owned_furniture) {
        if (f.id === this.furniture_obj.id && f.owner.id === this.api.currentUser.id) {
          return true;
        }
      }
    }
    return false;
  }

  disallow(user_id) {
    if (this.isFurnitureOwner()) {
      this.api.createObj('disallow', {
        'furniture': this.furniture_obj.id,
        'user': user_id,
      }).subscribe((response: any) => {
        if (response) {
          this.updateFurniture();
          this.snackBar.open(response.detail, 'OK', {
            duration: 5000,
          });
        }
      });
    }
  }

  updateFurniture() {
    this.api.getObj('furniture', this.furniture_obj.id).subscribe((response: any) => {
      if (response) {
        this.furniture_obj = response;
      }
    });
  }

  getAvg(attr) {
    if (attr !== 'massage' && attr !== 'rigidity') {
      let res = 0;
      for (const o of this.furniture_obj.current_options) {
        res += o[attr];
      }
      res = res / this.furniture_obj.current_options.length;
      return res.toFixed(2);
    } else if (attr === 'massage') {
      const res = {
        'none': 0,
        'slow': 0,
        'medium': 0,
        'rapid': 0
      };
      for (const o of this.furniture_obj.current_options) {
        res[o[attr]]++;
      }
      return Object.keys(res).reduce(function (a, b) {
        return res[a] > res[b] ? a : b;
      });
    } else if (attr === 'rigidity') {
      const res = {
        'soft': 0,
        'medium': 0,
        'solid': 0
      };
      for (const o of this.furniture_obj.current_options) {
        res[o[attr]]++;
      }
      return Object.keys(res).reduce(function (a, b) {
        return res[a] > res[b] ? a : b;
      });
    }
  }
}
