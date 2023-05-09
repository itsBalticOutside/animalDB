import { Component } from '@angular/core';
import { AuthComponent } from './auth.component';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import WebService from "./web.service";


@Component({
  selector: 'navigation',
  templateUrl: './nav.component.html',
  styleUrls: []
})

export class NavComponent {
    constructor(public authComponnt: AuthComponent,
                public router: Router, public webService: WebService) {}

    showLogOut: boolean = false;
    

    ngOnInit(){
     this.checkIfUserLoggedIn()

     
   }
    checkIfUserLoggedIn(){
      let token;
      token = localStorage.getItem('token');
      if (token){
        this.showLogOut = true;
      }else{
        this.showLogOut = false;
      }
    }


    
}
