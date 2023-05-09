import { Component, Input } from '@angular/core';
import { GMapService } from './g-map.service';
import WebService from './web.service';
declare var google: any;

@Component({
  selector: 'app-g-maps-heatlayer',
  templateUrl: './g-maps-heatlayer.component.html',
  styleUrls: ['./g-maps-heatlayer.component.css']
})
export class GMapsHeatlayerComponent {
  //Get Species for collection search
  @Input() Specie: any;

  //Variable Initiation 
  geocoder: any;
  Gmap : any;
  heatmap: any;
  heatmapData: any;

  constructor(private mapService :GMapService, private webService: WebService)
            {this.geocoder = new google.maps.Geocoder();}

  ngOnInit() {
    this.Gmap = this.mapService.getMapInstance();
    this.initializeHeatmap();
  }

  //Create heatmap layer
  initializeHeatmap() {
    //Get map instance from mapService
    this.Gmap = this.mapService.getMapInstance()
    //Get Heatmap data
    this.setHeatmapData()
    //Create layer
    this.heatmap = new google.maps.visualization.HeatmapLayer({
      data: this.heatmapData,
      dissipating: true,
      radius: 50,
      map: this.Gmap
    });
  }

  //Get and set heatmap data
  setHeatmapData(){
    //Get locations and turn into latlng coords
    this.geocodeCollection()
    let animalLocations = this.mapService.getHeatMapData();
    //Turn locations into google map latlng coords
    this.heatmapData = animalLocations.map((animalLocation: { lat: any; lng: any; }) => new google.maps.LatLng(animalLocation.lat, animalLocation.lng));
  }

  //Turn locations int coords
  geocodeCollection(){
    //Get location fields from all of species
    this.webService.getLocationsOfSpecies(this.Specie).subscribe((locations:any) =>{
      let loc
      loc = locations
      let heatmapData: { lat: any; lng: any; }[] = []

      //For each location, turn into coords
      loc.forEach((location: any) => {
        this.geocoder.geocode({ address: location }, (results: string | any[], status: any) => {
          if (status === google.maps.GeocoderStatus.OK && results.length > 0) {
            const lat = results[0].geometry.location.lat();
            const lng = results[0].geometry.location.lng();
            //Push coords into array
            heatmapData.push({lat,lng})
            
          } else {
            console.error(`Geocoding failed for location: ${location}`);
          }
        });
      });
      //Return data
      return this.mapService.setHeatMapData(heatmapData);
    })
  }

}
