import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { GMapsComponent } from './g-maps.component';
import { GMapService } from './g-map.service';
import WebService from './web.service';
declare var google: any;

@Component({
  selector: 'app-g-maps-gecode',
  templateUrl: './g-maps-gecode.component.html',
  styleUrls: ['./g-maps-gecode.component.css']
})
export class GMapsGecodeComponent implements OnInit{
  //Input for location
  @Input() PostCode: any;
  
  geocoder: any;
  Gmap : any;

  constructor(private mapService: GMapService, private webService: WebService) {
    this.geocoder = new google.maps.Geocoder();
  }

  ngOnInit() {
    this.mapService.mapInstanceChange.subscribe((map: any) => {
      if (map) {
        this.Gmap = this.mapService.getMapInstance()
        this.geocodeAddress(this.PostCode);;
      }
    });
  }

  //Turn location into coords
  geocodeAddress(address: string) {
    //Get map instance from mapService
    this.Gmap = this.mapService.getMapInstance()
    //Turn location field into coords
    this.geocoder.geocode({ address }, (results: any, status: string) => {
      if (status === 'OK') {
        //Get move map to location and display marker
        //@ts-ignore
        this.Gmap.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          //@ts-ignore
          map: this.Gmap,
          position: results[0].geometry.location,
        });
      } else {
        console.error('Geocode was not successful for the following reason:', status);
      }
    });
  }


}
