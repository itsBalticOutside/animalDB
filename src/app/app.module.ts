import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AnimalsComponent } from './animals.component';
import { WebService } from './web.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { HomeComponent} from './home.component';
import { AnimalComponent } from './animal.component';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthModule } from '@auth0/auth0-angular';
import { NavComponent } from './nav.component';
import { UploadAnimalComponent } from './upload-animal.component';
import { BarComponent } from './bar.component';



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
    path: 'animal/:id',
    component: AnimalComponent
  },
  {
    path: 'upload',
    component: UploadAnimalComponent
  }
];

@NgModule({
  declarations: [
    AppComponent, AnimalsComponent, 
    HomeComponent, AnimalComponent,
    NavComponent,
    UploadAnimalComponent,
    BarComponent
  ],
  imports: [
    BrowserModule, HttpClientModule,
    RouterModule.forRoot(routes),
    ReactiveFormsModule,
    AuthModule.forRoot( {
      domain: 'dev-oxleyyqtr12nl3u7.uk.auth0.com',
      clientId: '9x4DIuHagUIf3zo9t5w3a47zH5kxEmOu'
    })
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }
