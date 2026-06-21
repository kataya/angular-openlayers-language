import { Injectable } from '@angular/core';

//2026.6.21 - add
export interface Basemap {
  id: string;
  label: string;
  type: "arcgis" | "xyz";
  style?: string;
  url?: string;
  attribution?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private app:any;
  private regions:any;
  async load(){

    const app = 
      await fetch(
          'config/app-config.json'
      )
      .catch(
        async ()=> {
          return fetch(
            'config/app-config.template.json'
          );
        }
      );
    this.app = await app.json();

    const regions=
      await fetch(
          'config/regions.json'
      );
    this.regions = await regions.json();

  }
  
  getDefault(){
    return this.app?.default;
  }
  
  getRegion(
    name:string
  ){
    return this.regions?.[
      name
    ];
  }
  
  get apiKey() {
    return this.app?.arcgis?.apiKey;
  }

  get basemap() {
    return this.app?.default?.basemap;
  }

  //2026.6.21 - add
  getBasemaps() : Basemap[] {
    return this.app?.basemaps ?? [];
  }
}
