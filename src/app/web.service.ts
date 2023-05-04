import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter,Injectable} from '@angular/core';
import { image } from 'd3';
import { Observable } from 'rxjs';
import {  Router } from '@angular/router';

@Injectable()
export default class WebService {

    animal_list: any;
    private animalID: any;
    token: any;
    constructor(public http: HttpClient, public router : Router) {}
    private userID:any;
    signInSuccessEvent = new EventEmitter<string>();
    //Getting Animal/Animalss
    getAnimals() {
        return this.http.get('http://localhost:5000/api/v1.0/animals/');
        }

    getAnimal(collection:any ,id: any) {
        this.animalID = id;
        const url = 'http://localhost:5000/api/v1.0/animals/' + collection+"/"+id;
        return this.http.get(url , {});
    }

    getAnimalUserProfile(id: any) {
        this.animalID = id;
        const url = 'http://localhost:5000/api/v1.0/animal/' + id;
        return this.http.get(url , {});
    }

    getCollection(collection:any) {
        return this.http.get('http://localhost:5000/api/v1.0/animals/' + collection);
    }
    getCollections() {
        return this.http.get('http://localhost:5000/api/v1.0/collections');
    }

    getCollectionOfGender(collection:any,genderType:any) {
        return this.http.get('http://localhost:5000/api/v1.0/animals/' + collection + '/query/gender/' + genderType);
    }
    getAllGender(genderType:any) {
        return this.http.get('http://localhost:5000/api/v1.0/animals/query/gender/' + genderType);
    }
    
    getAnimalWiki(collection: any){
        var animalSummary
        const url = 'http://localhost:5000/api/v1.0/animals/' + collection+ "/query/wiki";
         
        animalSummary = this.http.get(url , {});
        return animalSummary
   }

    //Posting Animal
    postAnimal(animal:any){
        //Gets jwt token from header for token auth
        let headers = new HttpHeaders();
        let token = localStorage.getItem('token');
        if (token) {
        headers = headers.set('x-access-token', token);
        }
        //Posts form data to backend
        let postData = new FormData();
        postData.append("Species", animal.Species);
        postData.append("Gender", animal.Gender);
        postData.append("LifeStage", animal.LifeStage);
        postData.append("Location", animal.Location);
        postData.append("image", animal.image);
        return this.http.post('http://localhost:5000/api/v1.0/animal',  postData, {headers});
    }
    //Handles uploading animal image to blob storage, returns url
    imageUpload(file:any){
        const blobEndpoint = 'https://prod-02.westeurope.logic.azure.com:443/workflows/3c15f39ae3784b6297157792cb295866/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=7_gZH3qIiBRGMTFl-c0vFlbEnNsAqKXYcnVycsqaCZg'
        var imageForm = new FormData()
        
        imageForm.append("image", file)
        console.log("bob")
         
       return this.http.post(blobEndpoint, imageForm)
        
      }
    
    //Delete Animal
    delAnimal(id:any){
        //Gets jwt token from header for token auth
        let headers = new HttpHeaders();
        let token = localStorage.getItem('token');
        if (token) {
        headers = headers.set('x-access-token', token);
        }
        this.animalID = id;
        return this.http.delete('http://localhost:5000/api/v1.0/animal/' + this.animalID, {headers});
    }
    //Update Animal
    putAnimal(animal:any){
        let putData = new FormData();
        putData.append("Species",animal.Species);
        putData.append("Gender",animal.Gender);
        putData.append("Age",animal.Age);
        putData.append("Location",animal.Location);
        return this.http.put('http://localhost:5000/api/v1.0/animal/' + this.animalID, putData);
    }

    //!! ^ Animal methdods ^ !!
    //!! v User methdods v !!

    //Log user in
    signin(user:any){
        //Adds username and password to auth headers
        const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(user.username + ':' + user.password) });
        const url = 'http://localhost:5000/api/v1.0/user/signin';
        var logged
        this.http.post(url, {}, { headers }).subscribe(
            (response) => {
              //Adds jwt token to local storage
              this.token = response;
              localStorage.setItem('token', this.token['token'])
              this.signInSuccessEvent.emit('success');
            },
            (error) => {
              console.log(error);
            }
          );
        return this.token;
    }

    //signup user
    signup(signupData:any){
        const url = 'http://localhost:5000/api/v1.0/user/signup';
        let postData = new FormData();
        postData.append("forename", signupData.forename);
        postData.append("surname", signupData.surname);
        postData.append("username", signupData.username);
        postData.append("email", signupData.email);
        postData.append("password", signupData.password);
        postData.append("admin", "false");
        
        return this.http.post(url,postData).subscribe(
            (response) => {
              console.log(response);
            },
            (error) => {
              console.log(error);
            }
          );
    }

    logout(){
        //Gets jwt token from header for token auth
        let headers = new HttpHeaders();
        let token = localStorage.getItem('token');
        if (token) {
            console.log("yeoo loggin out")
            headers = headers.set('x-access-token', token);
            return this.http.get('http://localhost:5000/api/v1.0/user/signout',{headers}).subscribe(
            (response) => {
              console.log(response);
              localStorage.removeItem('token')
              this.router.navigate(['']);
            },
            (error) => {
              console.log(error);
            }
          )
        } else{
            return console.log("Log out failed")
        }
        
        
        
    }
    
    //Get user details using userID
    getUser(userID:any){
        const url = 'http://localhost:5000/api/v1.0/users/' + userID;
        return this.http.get(url)
    }
    
    //Gets userID from decoding token in backend
    getUserID(token: string | string[]){ 
        let headers = new HttpHeaders();
        headers = headers.set('x-access-token', token);
        return this.http.post('http://localhost:5000/api/v1.0/user/id',{}, { headers })
    }

    //Uses userID to retrieve user uplaods !!Not in use!!
   getUserUploads(userID: string){
    const url = 'http://localhost:5000/api/v1.0/users/' + userID + '/uploads'
    return this.http.get(url,{})
   }

   editUser(userID:any, userInfo:any){
    let putData = new FormData();
    putData.append("Forename",userInfo.Forename);
    putData.append("Surname",userInfo.Surname);
    putData.append("Email",userInfo.Email);
    putData.append("Username",userInfo.Username);
    
    return this.http.put('http://localhost:5000/api/v1.0/users/edit/' + userID, putData);
   }


      
}
