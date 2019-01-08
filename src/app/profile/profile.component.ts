import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {ApiService} from '../api.service';
import {EditProfileComponent} from '../edit-profile/edit-profile.component';
import {OptionsComponent} from '../options/options.component';
import {FurnitureComponent} from '../furniture/furniture.component';
import {ActivatedRoute, Router} from '@angular/router';
import {StripeComponent} from '../stripe/stripe.component';
import {ApplyOptionsComponent} from '../apply-options/apply-options.component';
import {TranslateService} from '@ngx-translate/core';

export interface Furniture {
  id: number;
  code: string;
  brand: string;
  type: string;
  owner: any;
  is_public: boolean;
}

export interface Options {
  id: number;
  type: string;
  name: string;
  height: number;
  length: number;
  width: number;
  incline: number;
  rigidity: string;
  temperature: number;
  massage: string;
}

export interface PermissionNotification {
  id: number;
  content: string;
  date: string;
  pending: boolean;
  receiver: any;
  sender: any;
  furniture: any;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user_obj: any;
  error: any;
  ownedFurnitureDisplayedColumns: string[] = ['code', 'brand', 'type', 'actions', 'settings', 'is_public'];
  furnitureDisplayedColumns: string[] = ['code', 'brand', 'type', 'owner', 'actions', 'settings', 'is_public'];
  optionsDisplayedColumns: string[] = ['type', 'name', 'height', 'length',
    'width', 'incline', 'rigidity', 'temperature', 'massage', 'actions'];
  notificationDisplayedColumns: string[] = ['sender', 'date', 'content', 'actions'];
  ownedFurnitureDataSource: MatTableDataSource<Furniture>;
  optionsDataSource: MatTableDataSource<Options>;
  notificationsDataSource: MatTableDataSource<PermissionNotification>;
  allowedFurnitureDataSource: MatTableDataSource<Furniture>;
  currentFurnitureDataSource: MatTableDataSource<Furniture>;
  prime_types: string[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog,
              private api: ApiService,
              private route: ActivatedRoute,
              private router: Router,
              public translate: TranslateService,
              public snackBar: MatSnackBar) {
    for (const t of this.api.furnitureTypes) {
      if (t.prime_actions) {
        this.prime_types.push(t.name);
      }
    }
  }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    const id = this.route.snapshot.paramMap.get('id');
    if (this.api.currentUser && !id) {
      this.user_obj = this.api.currentUser;
      this.getTables();
    } else if (this.api.currentUser && id === this.api.currentUser.id) {
      this.router.navigateByUrl(`/profile`);
    } else {
      this.api.getObj('users', id).subscribe((response: any) => {
        if (response) {
          this.error = null;
          this.user_obj = response;
          this.getTables();
        } else {
          this.error = this.api.errorLog.pop();
        }
      });
    }
  }

  isOwner() {
    return this.api.currentUser ? this.api.currentUser.id === this.user_obj.id : false;
  }

  isFurnitureOwner(id) {
    if (this.api.currentUser) {
      for (const f of this.api.currentUser.owned_furniture) {
        if (f.id === id && f.owner.id === this.api.currentUser.id) {
          return true;
        }
      }
    }
    return false;
  }

  getTables() {
    this.ownedFurnitureDataSource = new MatTableDataSource(this.user_obj.owned_furniture);
    this.ownedFurnitureDataSource.paginator = this.paginator;
    this.ownedFurnitureDataSource.sort = this.sort;

    this.allowedFurnitureDataSource = new MatTableDataSource(this.user_obj.allowed_furniture);
    this.allowedFurnitureDataSource.paginator = this.paginator;
    this.allowedFurnitureDataSource.sort = this.sort;

    this.currentFurnitureDataSource = new MatTableDataSource(this.user_obj.current_furniture);
    this.currentFurnitureDataSource.paginator = this.paginator;
    this.currentFurnitureDataSource.sort = this.sort;

    this.optionsDataSource = new MatTableDataSource(this.user_obj.options_set);
    this.optionsDataSource.paginator = this.paginator;
    this.optionsDataSource.sort = this.sort;

    this.notificationsDataSource = new MatTableDataSource(this.get_notifications());
    this.notificationsDataSource.paginator = this.paginator;
    this.notificationsDataSource.sort = this.sort;
  }

  get_notifications() {
    const res = [];
    for (const n of this.user_obj.received_notifications) {
      if (n.pending) {
        res.push(n);
      }
    }
    return res;
  }

  allow(furniture, user, notification) {
    this.notificationAction(furniture, user, notification, 'allow');
  }

  disallow(furniture, user, notification) {
    this.notificationAction(furniture, user, notification, 'disallow');
  }

  notificationAction(furniture, user, notification, action) {
    this.api.createObj(action, {
      'furniture': furniture,
      'user': user,
      'notification': notification
    }).subscribe((response: any) => {
      if (response) {
        this.updateUser();
        this.snackBar.open(response.detail, 'OK', {
          duration: 5000,
        });
      }
    });
  }

  updateUser() {
    this.api.getCurrentUser().subscribe((response: any) => {
      if (response) {
        this.api.currentUser = response;
        this.getUser();
      }
    });
  }

  applyFurnitureFilter(filterValue: string) {
    this.ownedFurnitureDataSource.filter = filterValue.trim().toLowerCase();
    if (this.ownedFurnitureDataSource.paginator) {
      this.ownedFurnitureDataSource.paginator.firstPage();
    }
  }

  applyCurrentFurnitureFilter(filterValue: string) {
    this.currentFurnitureDataSource.filter = filterValue.trim().toLowerCase();
    if (this.currentFurnitureDataSource.paginator) {
      this.currentFurnitureDataSource.paginator.firstPage();
    }
  }

  applyAllowedFurnitureFilter(filterValue: string) {
    this.allowedFurnitureDataSource.filter = filterValue.trim().toLowerCase();
    if (this.allowedFurnitureDataSource.paginator) {
      this.allowedFurnitureDataSource.paginator.firstPage();
    }
  }

  applyNotificationsFilter(filterValue: string) {
    this.notificationsDataSource.filter = filterValue.trim().toLowerCase();
    if (this.notificationsDataSource.paginator) {
      this.notificationsDataSource.paginator.firstPage();
    }
  }

  applyOptionsFilter(filterValue: string) {
    this.optionsDataSource.filter = filterValue.trim().toLowerCase();
    if (this.optionsDataSource.paginator) {
      this.optionsDataSource.paginator.firstPage();
    }
  }

  isPrimeAccount() {
    if (this.user_obj.prime_expiration_date) {
      const expiration_date = new Date(this.user_obj.prime_expiration_date);
      let today = new Date();
      today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      if (today <= expiration_date) {
        return true;
      }
    }
    return false;
  }

  deleteObject(list, id) {
    this.api.deleteObj(list, id).subscribe((response: any) => {
      this.updateUser();
    });
  }

  openDialog(name: string, id = null): void {
    if (!this.api.currentUser) {
      this.translate.get('ACTION.NOT_AUTHORIZED').subscribe((res: string) => {
        this.snackBar.open(res, 'OK', {
          duration: 5000,
        });
      });
    } else {
      let dialogRef;
      if (name === 'editProfile') {
        dialogRef = this.dialog.open(EditProfileComponent);
        this.closedDialog(dialogRef);
      } else if (name === 'addOptions') {
        dialogRef = this.dialog.open(OptionsComponent);
        this.closedDialog(dialogRef);
      } else if (name === 'addFurniture') {
        dialogRef = this.dialog.open(FurnitureComponent);
        this.closedDialog(dialogRef);
      } else if (name === 'upgradePrime') {
        dialogRef = this.dialog.open(StripeComponent);
        this.closedDialog(dialogRef);
      } else if (name === 'editFurniture') {
        this.api.getObj('furniture', id).subscribe((response: any) => {
          if (response) {
            dialogRef = this.dialog.open(FurnitureComponent, {data: response});
            this.closedDialog(dialogRef);
          }
        });
      } else if (name === 'editOptions') {
        this.api.getObj('options', id).subscribe((response: any) => {
          if (response) {
            dialogRef = this.dialog.open(OptionsComponent, {data: response});
            this.closedDialog(dialogRef);
          }
        });
      } else if (name === 'settings') {
        this.api.getObj('furniture', id).subscribe((response: any) => {
          if (response) {
            dialogRef = this.dialog.open(ApplyOptionsComponent, {data: response});
            this.closedDialog(dialogRef);
          }
        });
      }
    }
  }

  closedDialog(dialogRef) {
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateUser();
      }
    });
  }

  getPrimeDate() {
    const date = new Date(this.user_obj.prime_expiration_date);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  }
}
