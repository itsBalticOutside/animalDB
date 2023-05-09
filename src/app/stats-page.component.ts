import { Component } from '@angular/core';
import WebService from './web.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-stats-page',
  templateUrl: './stats-page.component.html',
  styleUrls: ['./stats-page.component.css']
})
export class StatsPageComponent {
    constructor(public webService: WebService){}
    speciesNames: any;
    
    ngOnInit(){

      this.webService.getCollections().subscribe((data) => {
        this.speciesNames = data
        console.log(this.speciesNames)
      })
      
  }
}
