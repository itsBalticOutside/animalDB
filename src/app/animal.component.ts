import { Component } from "@angular/core";
import { WebService } from "./web.service";
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';

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
    
    ngOnInit(){
        
        //Getting animal
        this.animal_list = this.webService.getAnimal(this.route.snapshot.params['id']);
        
    }
    
    //Delete animal button
    onDelete(id:any){
        this.webService.delAnimal(id).subscribe((response:any)=> {
            this.route.snapshot.params['id'];
        });
        this.animal_list = this.webService.getAnimals();
    }
}
