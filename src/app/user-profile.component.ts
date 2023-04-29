import { Component } from '@angular/core';
import jwtDecode from 'jwt-decode';
import WebService from "./web.service";
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
  constructor(private webService: WebService) { }

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
  }

  //Goes through all uploadIDs associated with profile and adds to list
  async getAnimalsFromUploadIDs(userUploads: any) {

        for (const id of userUploads) {
          const animal = await this.webService.getAnimalUserProfile(id).toPromise();
          this.animals = this.animals.concat(animal);
        }
        return this.animals;
      }
    
    
    
    
  
  
}
