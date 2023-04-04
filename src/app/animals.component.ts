import { Component } from "@angular/core";
import { WebService } from "./web.service";
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'animals',
    templateUrl: './animals.component.html',
    styleUrls: ['./animals.component.css']
})
export class AnimalsComponent { 

    constructor(public webService: WebService) {}
    
    ngOnInit(){
        if (sessionStorage['page']){
            this.page = Number(sessionStorage['page'])
        }
        this.animal_list = this.webService.getAnimals();
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
    

    animal_list: any = [];
    page: number = 1;
    

}
