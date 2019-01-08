import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {FurnitureListComponent} from './furniture-list/furniture-list.component';
import {BrandComponent} from './brand/brand.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'profile', component: ProfileComponent},
  {path: 'user/:id', component: ProfileComponent},
  {path: 'furniture', component: FurnitureListComponent},
  {path: 'brand/:brand', component: BrandComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
