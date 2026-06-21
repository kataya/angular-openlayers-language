■ArcGIS Basemap Styles service の各種定義は、Developer サイトの次で詳しく説明されている
https://developers.arcgis.com/documentation/mapping-and-location-services/mapping/basemaps/arcgis-styles/#styles

◇Style は大きくは次のグループでカテゴライズされて定義されている
  Streets: Road networks, urban, and community features e.g. arcgis/streets, arcgis/navigation
  Topography: Natural terrain, land and water features e.g. arcgis/outdoor, arcgis/topographic
  Satellite: Satellite imagery and labels e.g. arcgis/imagery
  Reference: Minimal geographic features such as boundaries and place labels e.g. arcgis/light-gray, arcgis/dark-gray
  Creative: Alternative cartographic designs e.g. arcgis/newspaper

次くらいがあればいいかな？
 streets
 topographic
 oceans
 terrain
 imagery
 light-gray

◇language パラメータでVectorTile などは場所のラベルを変更可能。language を local とすると、zoom level 10 以上はその国で使う言語に勝手になる



