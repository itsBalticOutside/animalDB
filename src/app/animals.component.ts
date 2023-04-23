import { Component } from "@angular/core";
import { WebService } from "./web.service";
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
    selector: 'animals',
    templateUrl: './animals.component.html',
    styleUrls: ['./animals.component.css']
})
export class AnimalsComponent { 
    filterForm: any;
    collectionName: any = [];
    Species: any;
    animal_list: any = [];
    animal:any;
    page: number = 1;
    selectedSpecies : any;
    selectedGender : any;
    constructor(private formBuilder: FormBuilder, public webService: WebService, private router: Router) {
        }
    
    ngOnInit(){
        if (sessionStorage['page']){
            this.page = Number(sessionStorage['page'])
        }
        this.animal_list = this.webService.getAnimals();
        this.collectionName = this.webService.getCollections();
        this.filterForm = this.formBuilder.group({
            Species: [''],
            Gender: [""]}
        )
    }
    
    previousPage(){
        if(this.page>1){
            this.page = this.page - 1;
            sessionStorage['page'] = this.page;
            this.animal_list = this.webService.getAnimals();
        }
    }
    nextPage(){
        this.page = this.page + 1;
        sessionStorage['page'] = this.page;
        this.animal_list = this.webService.getAnimals();
    }

    onFilter() {
        this.selectedSpecies = this.filterForm.get('Species').value;
        this.selectedGender = this.filterForm.get('Gender').value;
        console.log("selected species: " + this.selectedSpecies);
        console.log("selected gebder: " + this.selectedGender);
        
            

        if (this.selectedSpecies === null && this.selectedGender === null) {

            // Show all animals
            this.animal_list = this.webService.getAnimals();

          } else if (this.selectedSpecies !== null && this.selectedGender === '') {

            // Show selected species
            this.animal_list = this.webService.getCollection(this.selectedSpecies);

          } else if (this.selectedSpecies === null && this.selectedGender !== '') {

            // Show all animals with selectedGender
            this.animal_list = this.webService.getAllGender(this.selectedGender);
          } else if (this.selectedSpecies !== null && this.selectedGender !== '') {
            // Show all animals with selected species and selected gender
            this.animal_list = this.webService.getCollectionOfGender(this.selectedSpecies,this.selectedGender);
          } else {
            // Handle other cases
            // Possible future filtering
          }
      }
    

}
