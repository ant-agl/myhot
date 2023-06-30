export default class MapApi {
  myMap;
  center = [55.76, 37.64];
  zoom = 7;
  fixZoom = false;
  controls = ["fullscreenControl"];
  isReady = false;

  constructor(options) {
    if ($("head #script-map").length == 0) {
      $("head").append(`
        <script
          id="script-map"
          src="https://api-maps.yandex.ru/2.1/?apikey=a0c76f9a-3a83-47c5-8684-cd13b06be955&load=package.standard&lang=ru_RU">
        </script>
      `);
    }

    for (let key in options) {
      this[key] = options[key];
    }
    this.onReadyLoad(() => {
      if (this.coords) this.addPoints(this.coords);
      if (this.btnOpenMap) {
        $(this.btnOpenMap).on("click", this.openMap.bind(this));
      }
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
    this.onReadyLoad(() => {
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
          balloonContentFooter: hotel.getParams
            ? `<a href="/hotel${hotel.getParams}">Перейти</a>`
            : "",
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
    if (this.fixZoom) this.setZoom(this.zoom);
  }
  resizeMap() {
    this.myMap.container.fitToViewport();
    this.autoCenter();
  }
  openMap() {
    let time = 0;
    let t = setInterval(() => {
      this.resizeMap();
      time += 10;
      if (time > 500) clearInterval(t);
    }, 10);
  }
  setZoom(zoom) {
    this.onReadyLoad(() => {
      this.myMap.setZoom(zoom);
    });
  }
  isLoad() {
    return typeof ymaps !== "undefined";
  }
  onReadyLoad(func) {
    let interval = setInterval(() => {
      if (!this.isLoad()) return;

      if (!this.isReady) {
        ymaps.ready(() => {
          this.isReady = true;
          this.initMap();
          func();
        });
      } else {
        func();
      }

      clearInterval(interval);
    }, 1);
  }
}
