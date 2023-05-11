import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import WebService from "./web.service";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm: any;
    
    constructor(public authService: AuthService,public http: HttpClient,
                public webService: WebService, private formBuilder: FormBuilder) {}

            
    ngOnInit(){
      //Building signup form
       this.signupForm = this.formBuilder.group({
        forename: ['', Validators.required],
        surname: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', Validators.required, Validators.email],
        admin: ["false"],
        password: ['', Validators.required],
      });
     }
  
    //Signup button 
     onSubmitSignup(){
      if (this.signupForm.valid){
        this.webService.signup(this.signupForm.value);
        this.signupForm.reset();
        alert("Account Created!");
       }
    }

}
