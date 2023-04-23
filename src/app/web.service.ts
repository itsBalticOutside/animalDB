import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable} from '@angular/core';

@Injectable()
export class WebService {

    animal_list: any;
    private animalID: any;
    token: any;
    constructor(public http: HttpClient) {}
    
    //Getting Animal/Animalss
    getAnimals() {
        return this.http.get('http://localhost:5000/api/v1.0/animals');
        }

    getAnimal(id: any) {
        this.animalID = id;
        const url = 'http://localhost:5000/api/v1.0/animal/' + id;
        
        let headers = new HttpHeaders();
        let token = localStorage.getItem('token');

        if (token) {
        headers = headers.set('x-access-token', token);
        }

        return this.http.get(url , {headers});
    }

    getCollection(collection:any) {
        return this.http.get('http://localhost:5000/api/v1.0/animals/' + collection);
    }
    getCollections() {
        return this.http.get('http://localhost:5000/api/v1.0/collections');
    }

    //Posting Animal
    postAnimal(animal:any){
        let headers = new HttpHeaders();
        let token = localStorage.getItem('token');

        if (token) {
        headers = headers.set('x-access-token', token);
        }
        let postData = new FormData();
        postData.append("Species", animal.Species);
        postData.append("Gender", animal.Gender);
        postData.append("LifeStage", animal.LifeStage);
        postData.append("Location", animal.Location);
        postData.append("image", animal.image);
        return this.http.post('http://localhost:5000/api/v1.0/animal',  postData, {headers});
    }
    
    //Delete Animal
    delAnimal(id:any){
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

    //Log user in
    login(user:any){
        const headers = new HttpHeaders({ Authorization: 'Basic ' + btoa(user.username + ':' + user.password) });
        const url = 'http://localhost:5000/api/v1.0/user/signin';
        
        this.http.post(url, {}, { headers }).subscribe(
            (response) => {
              console.log(response);
              this.token = response;
              localStorage.setItem('token', this.token['token'])
              
            },
            (error) => {
              console.log(error);
            }
          );
          return this.token
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

    getUser(userID:any){
        const url = 'http://localhost:5000/api/v1.0/users/' + userID;
        return this.http.get(url)
    }

   
      
}
