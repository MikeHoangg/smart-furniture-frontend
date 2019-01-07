import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {Furniture} from '../profile/profile.component';
import {ApiService} from '../api.service';
import {FurnitureComponent} from '../furniture/furniture.component';
import {ApplyOptionsComponent} from '../apply-options/apply-options.component';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {TranslateService} from '@ngx-translate/core';

export interface FurnitureDetail {
  id: number;
  code: string;
  brand: string;
  type: string;
  current_options: any[];
  owner: number;
  is_public: boolean;
}

@Component({
  selector: 'app-furniture-list',
  templateUrl: './furniture-list.component.html',
  styleUrls: ['./furniture-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FurnitureListComponent implements OnInit {
  furnitureDisplayedColumns: string[] = ['code', 'brand', 'type', 'is_public'];
  furnitureDataSource: MatTableDataSource<Furniture>;
  expandedElement: Furniture | null;
  prime_types: string[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private dialog: MatDialog,
              private api: ApiService,
              public snackBar: MatSnackBar,
              public translate: TranslateService) {
    for (const type of api.furnitureTypes) {
      if (type.prime_actions) {
        this.prime_types.push(type.name);
      }
    }
  }

  ngOnInit() {
    this.getFurniture();
  }

  getFurniture() {
    this.api.getList('FurnitureDetail').subscribe((response: any) => {
      if (response) {
        this.furnitureDataSource = new MatTableDataSource(response);
        this.furnitureDataSource.paginator = this.paginator;
        this.furnitureDataSource.sort = this.sort;
      }
    });
  }

  applyFurnitureFilter(filterValue: string) {
    this.furnitureDataSource.filter = filterValue.trim().toLowerCase();
    if (this.furnitureDataSource.paginator) {
      this.furnitureDataSource.paginator.firstPage();
    }
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

  openDialog(name: string, id = null): void {
    if (!this.api.currentUser) {
      this.translate.get('ACTION.NOT_AUTHORIZED').subscribe((res: string) => {
        this.snackBar.open(res, 'OK', {
          duration: 5000,
        });
      });
    } else {
      let dialogRef;
      if (name === 'editFurniture') {
        this.api.getObj('FurnitureDetail', id).subscribe((response: any) => {
          if (response) {
            dialogRef = this.dialog.open(FurnitureComponent, {data: response});
            this.closedDialog(dialogRef);
          }
        });
      } else if (name === 'settings') {
        this.api.getObj('FurnitureDetail', id).subscribe((response: any) => {
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
        this.getFurniture();
        this.updateUser();
      }
    });
  }

  deleteObject(list, id) {
    this.api.deleteObj(list, id).subscribe((response: any) => {
      this.getFurniture();
      this.updateUser();
    });
  }

  updateUser() {
    this.api.getCurrentUser().subscribe((response: any) => {
      if (response) {
        this.api.currentUser = response;
      }
    });
  }

  getAvg(options, attr) {
    if (attr !== 'massage' && attr !== 'rigidity') {
      let res = 0;
      for (const option of options) {
        res += option[attr];
      }
      return Math.round(res / options.length);
    } else if (attr === 'massage') {
      const res = {
        'none': 0,
        'slow': 0,
        'medium': 0,
        'rapid': 0
      };
      for (const o of options) {
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
      for (const o of options) {
        res[o[attr]]++;
      }
      return Object.keys(res).reduce(function (a, b) {
        return res[a] > res[b] ? a : b;
      });
    }
  }
}
