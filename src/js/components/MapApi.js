export default class MapApi {
  myMap;
  center = [55.76, 37.64];
  zoom = 7;
  controls = ["zoomControl", "fullscreenControl"];
  isReady = false;

  constructor(options) {
    for (let key in options) {
      this[key] = options[key];
    }

    ymaps.ready(() => {
      this.isReady = true;
      this.initMap();
      if (this.coords) this.addPoints(this.coords);
    });
  }
  initMap() {
    this.myMap = new ymaps.Map("map", {
      center: this.center,
      zoom: this.zoom,
      controls: this.controls,
    });
  }
  addPointsReady(coords) {
    if (this.isReady) {
      this.addPoints(coords);
      return;
    }

    ymaps.ready(() => {
      this.isReady = true;
      this.addPoints(coords);
    });
  }
  addPoints(coords = []) {
    var myGeoObjects = [];

    for (var i = 0; i < coords.length; i++) {
      let hotel = coords[i];
      myGeoObjects[i] = new ymaps.GeoObject({
        geometry: {
          type: "Point",
          coordinates: hotel.coords,
        },
        properties: {
          hintContent: hotel.name || "",
          balloonContentHeader: hotel.name || "",
          balloonContentBody: hotel.image || "",
          balloonContentFooter: `<a href="../hotel?id=${
            hotel.id || ""
          }">Перейти</a>`,
        },
      });
    }

    var myClusterer = new ymaps.Clusterer();
    myClusterer.add(myGeoObjects);
    this.myMap.geoObjects.add(myClusterer);

    this.myClusterer = myClusterer;
    this.autoCenter();
  }
  autoCenter() {
    if (this.myClusterer) this.myMap.setBounds(this.myClusterer.getBounds());
  }
  resizeMap() {
    this.myMap.container.fitToViewport();
    this.autoCenter();
  }
}
