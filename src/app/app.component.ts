import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MarkerManager, GoogleMapsAPIWrapper } from '@agm/core';
import { Observable } from 'rxjs/Observable';

declare var MarkerClusterer: any;
declare var google: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  lat = -3.071459623249695;
  lng = -59.98878479003906;
  locations = [
    { lat: -3.0714596, lng: -59.988784 },
    { lat: -3.0718234, lng: -59.983181 },
    { lat: -3.0727111, lng: -59.981124 },
    { lat: -3.0748588, lng: -59.989834 },
    { lat: -3.0751702, lng: -59.986968 },
    { lat: -3.0771264, lng: -59.983657 },
    { lat: -3.0704724, lng: -59.982905 },
    { lat: -3.0717685, lng: -59.989196 },
    { lat: -3.0728611, lng: -59.980222 },
    { lat: -3.0750000, lng: -59.986667 },
    { lat: -3.0759859, lng: -59.988708 },
    { lat: -3.0765015, lng: -59.983858 },
    { lat: -3.0770104, lng: -59.983299 },
    { lat: -3.0773700, lng: -59.985187 },
    { lat: -3.0774785, lng: -59.987978 },
    { lat: -3.0719616, lng: -59.988119 },
    { lat: -3.0730766, lng: -59.985692 },
    { lat: -3.0727193, lng: -59.983218 },
    { lat: -3.0730162, lng: -59.985694 },
    { lat: -3.0734358, lng: -59.989506 },
    { lat: -3.0734358, lng: -59.981315 },
    { lat: -3.0735258, lng: -59.988000 },
    { lat: -3.0799792, lng: -59.983352 }
  ];
  @ViewChild('map') agmMap;
  gmaps: any;

  z = 8;
  escolheuPonto = false;
  pois = [];
  poi = { nome: '', latitude: 0, longitude: 0 };
  markerCluster: any;
  constructor(private markerManager: MarkerManager) { }
  ngOnInit() {
  }
  ngAfterViewInit() {
    setTimeout(this.initMaps.bind(this), 0);


  }

  async initMaps() {

    const nativeMap = this.agmMap._mapsWrapper.getNativeMap();
    nativeMap.then(
      map => {
        // console.log(map);
        this.gmaps = map;
        this.onMapReady();
      });
  }

  onChooseLocation(event) {
    this.poi.latitude = event.coords.lat;
    this.poi.longitude = event.coords.lng;
    this.escolheuPonto = true;
  }

  onMapReady() {
    const labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const markers = this.locations.map(function (location) {
      return new google.maps.Marker({
        position: location,
        icon: '../assets/placeholder.png'
      });
    });

    // Add a marker clusterer to manage the markers.
    this.markerCluster = new MarkerClusterer(this.gmaps, markers,
      { imagePath: '../assets/m' });

  }

  onLocationTypeSet(event) {
    console.log('POI clicado');
  }
  salvaPOI() {
    // this.locations.push();
    // this.onMapReady();
    this.markerCluster.addMarker(new google.maps.Marker({
      position: { lat: this.poi.latitude, lng: this.poi.longitude },
      icon: '../assets/placeholder.png'
    }), true);

    this.markerCluster.redraw();
    this.poi = { nome: '', latitude: 0, longitude: 0 };
    // alert('POI Salvo');

  }
}
