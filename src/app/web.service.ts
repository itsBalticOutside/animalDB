import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';

@Injectable()
export class WebService {

    animal_list: any;
    private animalID: any;

    constructor(public http: HttpClient) {}
    //Getting Animal/Animalss
    getAnimals() {
        return this.http.get('http://localhost:5000/api/v1.0/animals');
        }

    getAnimal(id: any) {
        this.animalID = id;
        return this.http.get('http://localhost:5000/api/v1.0/animal/' + id);
        }

    getCollection(collection:any) {
        return this.http.get('http://localhost:5000/api/v1.0/animals/' + collection);
    }
    getCollections() {
        return this.http.get('http://localhost:5000/api/v1.0/collections');
    }

    //Posting review
    postReview(animal:any){
        let postData = new FormData();
        postData.append("Species", animal.Species);
        postData.append("Gender", animal.Gender);
        postData.append("LifeStage", animal.LifeStage);
        postData.append("Location", animal.Location);
        postData.append("image", animal.image);
        return this.http.post('http://localhost:5000/api/v1.0/animal', postData);
    }

    
    //Delete Animal
    delAnimal(id:any){
        this.animalID = id;
        return this.http.delete('http://localhost:5000/api/v1.0/animal/' + 
        this.animalID);
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
}
