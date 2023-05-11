import { Component } from "@angular/core";
import { AuthComponent } from "./auth.component";
import WebService from "./web.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from "d3";
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: any;
  showMessage = false;
  message = '';
  loading = false; 

    constructor(public authComponent: AuthComponent,public http: HttpClient,
                public webService: WebService, private formBuilder: FormBuilder,
                public router :Router) {}
            
    ngOnInit(){
      //Building login forms
       this.loginForm = this.formBuilder.group({
         username: ['', Validators.required],
         password: ['', Validators.required],
       });
       //event triggger for successful login
       this.webService.signInSuccessEvent.subscribe((event: string) => {
        //show successful login message (validator flag)
        this.showMessage = true;
        const loginData = this.loginForm.value
        this.message = 'You have successfully signed in! Welcome back ' + loginData.username;
      });
     }


     //Login button 
    onSubmitLogin(){
      this.loading = true; //Trigger loading ng template
      const loginData = this.loginForm.value; // Assign login form details to loginData Object
      this.webService.signin(loginData) //Send login data to webService 
      setTimeout(() => {
        //If login not successful then alert user
        if (!this.showMessage) {
          alert("Login failed, please try again!"); 
          this.loading = false;
        } else { 
          //else naviagte to animals page
          this.router.navigate(['/animals']);
          this.loginForm.reset();
          this.loading = false;
        }
      },1800); //Timeout to all time for login response ( subscribe was conflicting )
     
  }




  
}
