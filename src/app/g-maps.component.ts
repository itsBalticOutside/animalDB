import { Component } from '@angular/core';
import {GMapService} from './g-map.service'

declare var google: any;

@Component({
  selector: 'app-g-maps',
  templateUrl: './g-maps.component.html',
  styleUrls: ['./g-maps.component.css']
})
export class GMapsComponent {

  map: any;
 
  constructor( private mapService: GMapService) {}

  ngOnInit() {
    this.initializeMap()
  }

  //Create map instance
  initializeMap() {
    //Center map of NI
    const mapOptions = {
      center: { lat: 54.724669, lng: -6.766543 },
      zoom: 8,
    };
  
    this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    //Add map to map service for referenceing
    this.mapService.setMapInstance(this.map);
  }
  
}

