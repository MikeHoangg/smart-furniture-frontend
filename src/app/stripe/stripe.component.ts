import {Component, OnInit} from '@angular/core';
import {StripeToken} from 'stripe-angular';
import {ApiService} from '../api.service';
import {MatDialogRef, MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.css']
})
export class StripeComponent implements OnInit {
  error: any;

  constructor(private api: ApiService, public snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<StripeComponent>) {
  }

  ngOnInit() {
  }

  getPrice() {
    return 3.99;
  }

  setStripeToken(token: StripeToken) {
    this.api.createObj('set-prime', {
      'user': this.api.currentUser.id,
      'stripe_token': token.id,
      'price': this.getPrice() * 100
    }).subscribe((response: any) => {
      if (response) {
        this.dialogRef.close(true);
        this.error = null;
        this.snackBar.open(response.detail, 'OK', {
          duration: 5000,
        });
      } else {
        this.error = this.api.errorLog.pop();
      }
    });
  }

  onStripeError(error: Error) {
    this.error = error;
  }
}
