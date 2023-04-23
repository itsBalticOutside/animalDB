import { Component } from "@angular/core";
import { WebService } from "./web.service";
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { HttpHeaders} from '@angular/common/http';
@Component({
    selector: 'animal',
    templateUrl: './animal.component.html',
    styleUrls: ['./animal.component.css']
})
export class AnimalComponent { 
    //Initilizing variables
    
    constructor(private webService: WebService, 
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                public authService: AuthService) {}

    animal_list: any;
    reviews: any = [];
    uploaderInfo: any;
    animalData:any;
    uploaderID: any;
        





    ngOnInit(){
        
        //Getting animal
       // this.animal_list = this.webService.getAnimal(this.route.snapshot.params['id']);

        this.webService.getAnimal(this.route.snapshot.params['Species'],this.route.snapshot.params['id']).subscribe(data => {
            this.animalData = data;
            this.animalData = this.animalData
            this.uploaderID = this.animalData[0].userID;
            console.log(this.animalData)
            this.webService.getUser(this.uploaderID).subscribe(data => {
                this.uploaderInfo = data;
                this.uploaderInfo = this.uploaderInfo[0]
                console.log(this.uploaderInfo)
            });
          });

        
    }
    
    //Delete animal button
    onDelete(id:any){
        this.webService.delAnimal(id).subscribe((response:any)=> {
            this.route.snapshot.params['id'];
        });
        this.animal_list = this.webService.getAnimals();
    }
}
