import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GMapService {
  private mapInstance: any;
  private heatmapData:any;
  public mapInstanceChange: Subject<any> = new Subject<any>();

  setMapInstance(map: any) {
    this.mapInstance = map;
    this.mapInstanceChange.next(map);
  }

  getMapInstance() {
    return this.mapInstance;
  }
  
  setHeatMapData(data: any){
    this.heatmapData = data;
  }

  getHeatMapData(){
    return this.heatmapData;
  }
}
