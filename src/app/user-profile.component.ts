import { Component } from '@angular/core';
import jwtDecode from 'jwt-decode';
import WebService from "./web.service";
import { FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  userID :any;
  userInfo :any;
  userUploads: any;
  animals: any[] = [];
  editForm: any;
  Forname:any;
  Surname:any;
  Email:any;
  Username:any;
  isEditFormOpen: boolean = false;
  constructor(private formBuilder: FormBuilder,private webService: WebService) { }

  ngOnInit(){
    //Gets token from header and decodes to get userID
    let token = localStorage.getItem('token');
    if (token){
      this.webService.getUserID(token).subscribe((data: any) => {
        this.userID=data;
        //Using userID, gets user document
        this.webService.getUser(this.userID).subscribe(data => {
          console.log("getting user")
          this.userInfo = data;
          this.userInfo = this.userInfo[0]
          //Gets uploadIDs from user profile
          this.userUploads = this.userInfo['uploadIDs'];
          this.getAnimalsFromUploadIDs(this.userUploads)
        });
      });
    }
         //Building upload forms
         this.editForm = this.formBuilder.group({
          Forename: ["", Validators.required],
          Surname: ["", Validators.required],
          Email: ["", [Validators.required, Validators.email]],
          Username: ["", Validators.required],
          
        });
  }

  //Goes through all uploadIDs associated with profile and adds to list
  async getAnimalsFromUploadIDs(userUploads: any) {

        for (const id of userUploads) {
          const animal = await this.webService.getAnimalUserProfile(id).toPromise();
          this.animals = this.animals.concat(animal);
        }
        return this.animals;
  }
    
    
  onEditForm() {
    
    if (this.isEditFormOpen == false){
      this.isEditFormOpen = true;
      console.log(this.userInfo)
      if (this.editForm) {
        this.editForm.setValue({
          Forename: this.userInfo.forename,
          Surname: this.userInfo.surname,
          Email: this.userInfo.email,
          Username: this.userInfo.username
        });
      }
        // Show the form
        //@ts-ignore
        document.getElementById('editForm').style.display = 'block';
    }
    else{
      this.isEditFormOpen = false;
      // Hide the form
        //@ts-ignore
        document.getElementById('editForm').style.display = 'none'
    }
      
  }
      
    
  onEdit(){
    if (this.editForm.valid){
      // Get the new values from the form
      
      const forename = this.editForm.get("Forename").value;
      const surname = this.editForm.value.Surname;
      const email = this.editForm.value.Email;
      const username = this.editForm.value.Username;
      this.editForm.setValue({
        Forename: forename,
        Surname: surname,
        Email: email,
        Username: username 
      });
      this.webService.editUser(this.userID,this.editForm.value).subscribe((response:any) =>{
        this.editForm.reset();
        this.webService.getUser(this.userID).subscribe(data => {
          console.log("getting user")
          this.userInfo = data;
          this.userInfo = this.userInfo[0]
          
        });
        // Hide the form
        //@ts-ignore
        document.getElementById('editForm').style.display = 'none'
      });
    }
  
  }


}
