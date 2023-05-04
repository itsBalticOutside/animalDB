import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import WebService from "./web.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: any;
 
    
    constructor(public authService: AuthService,public http: HttpClient,
                public webService: WebService, private formBuilder: FormBuilder) {}

            
    ngOnInit(){
      //Building login and signup forms
       this.loginForm = this.formBuilder.group({
         username: ['', Validators.required],
         password: ['', Validators.required],
       });

     }
   


     //Login button 
     onSubmitLogin(){
       const loginData = this.loginForm.value;
       this.webService.signin(loginData)
       this.loginForm.reset();
       alert("Welcome back, " + loginData.username + "!");
     }
}
