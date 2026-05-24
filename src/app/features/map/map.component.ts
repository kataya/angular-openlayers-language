import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import LayerGroup from 'ol/layer/Group';
import { apply } from 'ol-mapbox-style';
import { fromLonLat } from 'ol/proj';
import { ConfigService } from '../../core/services/config.service';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import MVT from 'ol/format/MVT';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent
implements AfterViewInit{

  constructor(
    private cfg: ConfigService,
    private route: ActivatedRoute,
  ){}

  private styleUrl(
    lang:string,
    basemap:string
  ){
    return `https://basemapstyles-api.arcgis.com/arcgis/rest/services/styles/v2/styles/arcgis/${basemap}?token=${this.cfg.apiKey}&language=${lang}`;
  }

  async ngAfterViewInit(){
    const def= this.cfg.getDefault();

    const qp= this.route.snapshot.queryParams;
    const regionName= qp["region"] ?? def.region;
    
    const lang= qp["lang"] ?? def.lang;

    // console.log(
    //   regionName
    // );

    // console.log(
    //   lang
    // );

    // console.log(
    //   this.cfg.apiKey
    // );

    const region=this.cfg.getRegion(
      regionName
    );

    const basemap= qp["basemap"] ?? def.basemap;

    const map = new Map({
      target:'map',
      //layers:[
        // new TileLayer({
        //   source: new OSM()
        // })
      //  this.createBasemap(lang)
      //],
      view: new View({
        center: fromLonLat(
          region.center
        ),
        zoom: region.zoom
      })
    });

    await apply(
      map,
      this.styleUrl(
        lang,
        basemap
      )
    );

  }

}