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
      //Building login and signup forms
       this.loginForm = this.formBuilder.group({
         username: ['', Validators.required],
         password: ['', Validators.required],
       });

       this.signupForm = this.formBuilder.group({
        forename: ['', Validators.required],
        surname: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', Validators.required],
        admin: ["false"],
        password: ['', Validators.required],
      });
     }
   


     //Login button 
     onSubmitLogin(){
       const loginData = this.loginForm.value;
       this.webService.signin(loginData)
       this.loginForm.reset();

     }

    //Signup button 
     onSubmitSignup(){
      if (this.signupForm.valid){
        this.webService.signup(this.signupForm.value);
        this.signupForm.reset();
        this.signupForm.reset();
       }
    }
  
}
