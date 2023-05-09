import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import WebService from "./web.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent { 

  loginForm: any;
  signupForm: any;
    
    constructor(public authService: AuthService,public http: HttpClient,
                public webService: WebService, private formBuilder: FormBuilder) {}

            
    ngOnInit(){

     }
   


}
