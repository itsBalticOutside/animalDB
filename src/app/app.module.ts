import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AnimalsComponent } from './animals.component';

import WebService from './web.service';
import { GMapService } from './g-map.service';

import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { HomeComponent} from './home.component';
import { AnimalComponent } from './animal.component';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthModule } from '@auth0/auth0-angular';
import { NavComponent } from './nav.component';
import { UploadAnimalComponent } from './upload-animal.component';
import { BarComponent } from './bar.component';
import { UserProfileComponent } from './user-profile.component';
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login.component';
import { SignupComponent } from './signup.component';
import { StatsPageComponent } from './stats-page.component';
import { GMapsComponent } from './g-maps.component';
import { GMapsGecodeComponent } from './g-maps-gecode.component';
import { GMapsHeatlayerComponent } from './g-maps-heatlayer.component';



var routes: any = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'animals',
    component: AnimalsComponent
  },
  {
    path: 'animals/:Species/:id',
    component: AnimalComponent
  },
  {
    path: 'upload',
    component: UploadAnimalComponent,
    canActivate: [AuthComponent]
  },
  {
    path: 'user',
    component: UserProfileComponent,
    canActivate: [AuthComponent]
  },
  {
    path: 'stats',
    component: StatsPageComponent
  }
];

@NgModule({
  declarations: [
    AppComponent, AnimalsComponent, 
    HomeComponent, AnimalComponent,
    NavComponent,
    UploadAnimalComponent,
    BarComponent,
    UserProfileComponent,
    AuthComponent,
    LoginComponent,
    SignupComponent,
    StatsPageComponent,
    GMapsComponent,
    GMapsGecodeComponent,
    GMapsHeatlayerComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    AuthModule.forRoot( {
      domain: 'dev-oxleyyqtr12nl3u7.uk.auth0.com',
      clientId: '9x4DIuHagUIf3zo9t5w3a47zH5kxEmOu',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  ],
  providers: [WebService,GMapService],
  bootstrap: [AppComponent]
})
export class AppModule { }
