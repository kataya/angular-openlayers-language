import { Component, AfterViewInit , OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import LayerGroup from 'ol/layer/Group';
import { apply } from 'ol-mapbox-style';
import { fromLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import { ConfigService } from '../../core/services/config.service';

// 2026.6.21 - arcgis location platform の basemap/lang の切替に加え 地理院タイル もbasemap として切替できるように拡張

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [ CommonModule , FormsModule ],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent
implements OnInit, AfterViewInit{

  private map!: Map;
  currentBasemap: any;
  currentBasemapId!: string;
  currentLang!: string;
  private baseLayerGroup = new LayerGroup({
    layers: []
  });

  basemaps: any[] = [];

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

  ngOnInit(): void {
    const def= this.cfg.getDefault();
    const qp= this.route.snapshot.queryParams;

    this.currentLang = qp["lang"] ?? def.lang;

    const basemapId= qp["basemap"] ?? def.basemap;
    this.currentBasemapId = basemapId;
    //2026.6.21 - add
    this.basemaps = this.cfg.getBasemaps();
    this.currentBasemap = this.basemaps.find(b => b.id === basemapId) ?? this.basemaps[0];

  }

  async ngAfterViewInit(){

    const def = this.cfg.getDefault();
    const qp = this.route.snapshot.queryParams;

    const regionName= qp["region"] ?? def.region;
    const region=this.cfg.getRegion(
      regionName
    );

    // console.log(
    //   regionName
    // );
    // console.log(
    //   lang
    // );
    // console.log(
    //   this.cfg.apiKey
    // );

    this.map = new Map({
      target:'map',
      layers:[
        this.baseLayerGroup
      ],
      view: new View({
        center: fromLonLat(
          region.center
        ),
        zoom: region.zoom
      })
    });

    await this.setBasemap(this.currentLang, this.currentBasemap);
    // await apply(
    //   map,
    //   this.styleUrl(
    //     lang,
    //     basemap
    //   )
    // );


  }

  //2026.6.21 - add
  private async createArcgisLayers(lang: string, def: any) {
    const tempMap = new Map({
      layers: []
    });

    await apply(tempMap, this.styleUrl(lang, def.style));

    return tempMap.getLayers().getArray();
  }

  private createXyzLayers(def: any) {
    return [
      new TileLayer({
        source: new XYZ({
          url: def.url,
          attributions: def.attribution
        })
      })
    ];
  }

  async setBasemap(lang: string, def: any) {
    this.currentBasemap = def;
    this.currentLang = lang;
    
    let layers: any[] = [];

    if (def.type === 'arcgis') {
      layers = await this.createArcgisLayers(lang, def);
    }
    else if (def.type === 'xyz') {
      layers = this.createXyzLayers(def);
    }

    const groupLayers = this.baseLayerGroup.getLayers();
    groupLayers.clear();
    layers.forEach(layer => groupLayers.push(layer));

  }

  onBasemapChange(ev: any) {
    if (!this.map) return;

    const basemaps = this.cfg.getBasemaps();
    const def = basemaps.find(b => b.id === ev.target.value);

    this.setBasemap(this.currentLang, def);
  }

  onLangChange(ev: any) {
    this.currentLang = ev.target.value;

    if (this.currentBasemap) {
      this.setBasemap(this.currentLang, this.currentBasemap);
    }
  }

}