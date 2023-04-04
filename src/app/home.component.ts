import { Component } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { WebService } from "./web.service";
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent { 

    animal_list: any = []; 
    constructor(public authService: AuthService,public http: HttpClient,public webService: WebService) {}

    ngOnInit(){
        
        this.animal_list = this.webService.getAnimals();
    }
      
    
    
}
