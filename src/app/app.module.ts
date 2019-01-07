import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {HttpClientModule, HttpClientXsrfModule, HttpClient} from '@angular/common/http';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule, MatInputModule} from '@angular/material';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {Module as StripeModule} from 'stripe-angular';
import {CarouselModule} from 'ngx-bootstrap';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {ApiService} from './api.service';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {ProfileComponent} from './profile/profile.component';
import {EditProfileComponent} from './edit-profile/edit-profile.component';
import {FurnitureListComponent} from './furniture-list/furniture-list.component';
import {FurnitureComponent} from './furniture/furniture.component';
import {OptionsComponent} from './options/options.component';
import {StripeComponent} from './stripe/stripe.component';
import {ApplyOptionsComponent} from './apply-options/apply-options.component';
import {BrandComponent} from './brand/brand.component';
import {
  loadFurnitureTypesProvider,
  loadMassageRigidityTypesProvider,
  loadUserProvider,
} from './api_load';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    EditProfileComponent,
    FurnitureListComponent,
    FurnitureComponent,
    OptionsComponent,
    StripeComponent,
    ApplyOptionsComponent,
    BrandComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CarouselModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFTOKEN',
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    StripeModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatListModule,
    MatPaginatorModule,
    MatExpansionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
  ],
  exports: [
    LoginComponent,
    RegisterComponent,
    StripeComponent,
    EditProfileComponent,
    FurnitureComponent,
    OptionsComponent,
    ApplyOptionsComponent,
  ],
  entryComponents: [
    LoginComponent,
    RegisterComponent,
    StripeComponent,
    EditProfileComponent,
    FurnitureComponent,
    OptionsComponent,
    ApplyOptionsComponent,
  ],
  providers: [ApiService,
    {provide: APP_INITIALIZER, useFactory: loadUserProvider, deps: [ApiService], multi: true},
    {provide: APP_INITIALIZER, useFactory: loadFurnitureTypesProvider, deps: [ApiService], multi: true},
    {provide: APP_INITIALIZER, useFactory: loadMassageRigidityTypesProvider, deps: [ApiService], multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
