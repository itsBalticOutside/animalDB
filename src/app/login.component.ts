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
      //Building login and signup forms
       this.loginForm = this.formBuilder.group({
         username: ['', Validators.required],
         password: ['', Validators.required],
       });
       this.webService.signInSuccessEvent.subscribe((event: string) => {
        this.showMessage = true;
        const loginData = this.loginForm.value
        this.message = 'You have successfully signed in! Welcome back ' + loginData.username;
      });
     }
   


     //Login button 
    onSubmitLogin(){
      this.loading = true;
      const loginData = this.loginForm.value;
      this.webService.signin(loginData)
      setTimeout(() => {
        if (!this.showMessage) {
          alert("Login failed, please try again!");
          
          this.loading = false;
          
          
        } else {
          
          this.router.navigate(['/animals']);
          this.loginForm.reset();
          this.loading = false;
        }
      },1800);
     
  }




  
}
