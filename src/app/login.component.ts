import { Component } from "@angular/core";
import { AuthComponent } from "./auth.component";
import WebService from "./web.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from "d3";


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
                public webService: WebService, private formBuilder: FormBuilder) {}

            
    ngOnInit(){
      //Building login and signup forms
       this.loginForm = this.formBuilder.group({
         username: ['', Validators.required],
         password: ['', Validators.required],
       });
       this.webService.signInSuccessEvent.subscribe((event: string) => {
        this.showMessage = true;
        this.message = 'You have successfully signed in!';
      });
     }
   


     //Login button 
    onSubmitLogin(){
      this.loading = true;
      const loginData = this.loginForm.value;
      this.webService.signin(loginData)
      setTimeout(() => {
        if (this.showMessage) {
          this.loginForm.reset();
          this.loading = false;
          alert("Welcome back, " + loginData.username + "!");
        } else {
          alert("Login failed, please try again!");
          this.loading = false;
        }
      },1000);
     
  }




  
}
