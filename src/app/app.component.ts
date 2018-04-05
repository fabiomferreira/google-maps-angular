import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MarkerManager, GoogleMapsAPIWrapper } from '@agm/core';
import { Observable } from 'rxjs/Observable';
import { COMPONENT_VARIABLE } from '@angular/platform-browser/src/dom/dom_renderer';

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
  markers = [];
  closestMarker = -1;
  locations = [
    { lat: -3.11058198408478, lng: -60.04921495914459 },
    { lat: -3.133670839702164, lng: -59.98654246330261 },
    { lat: -3.0750233373287403, lng: -60.087629556655884 },
    { lat: -3.071612624324068, lng: -59.95696306228638 },
    { lat: -3.070782333766531, lng: -59.955992102622986 },
    { lat: -3.0903234522395753, lng: -59.98088300228119 },
    { lat: -3.0904135940568063, lng: -59.978910237550735 },
    { lat: -3.031081474989356, lng: -60.04731863737106 },
    { lat: -3.028855675269179, lng: -60.03852367401123 },
    { lat: -3.035366829649787, lng: -59.995479583740234 },
    { lat: -3.0322812554756644, lng: -59.98530864715576 },
    { lat: -3.1300565838603145, lng: -60.022913217544556 },
    { lat: -3.137769793330287, lng: -60.023087561130524 },
    { lat: -3.1217674985827717, lng: -60.01363813877106 },
    { lat: -3.1263514444868883, lng: -60.00761926174164 },
    { lat: -3.0819393928224534, lng: -60.01960337162018 },
    { lat: -3.011298214112902, lng: -60.01638740301132 },
    { lat: -3.073823437181925, lng: -60.03474712371826 },
    { lat: -3.14115501729921, lng: -60.00776678323746 },
    { lat: -3.1441331482978168, lng: -60.01152187585831 },
    { lat: -3.0843030161113707, lng: -60.00212475657463 },
    { lat: -3.133977472445454, lng: -59.99579340219498 },
    { lat: -3.1367494032581673, lng: -59.982213377952576 }
  ];
  currentTravelTime = '';
  @ViewChild('map') agmMap;
  gmaps: any;

  z = 8;
  escolheuPonto = false;
  pois = [];
  poi = { nome: '', latitude: 0, longitude: 0 };
  markerCluster: any;
  distanceService: any;
  directionsService: any;
  directionsDisplay: any;
  constructor(private markerManager: MarkerManager ) {

   }
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
    // console.log(this.poi);
    this.escolheuPonto = true;
  }

  onMapReady() {
    this.distanceService = new google.maps.DistanceMatrixService();
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.markers = this.locations.map(function (location) {
      const marker = new google.maps.Marker({
        position: location,
        icon: '../assets/police-car.png',
      });
      const infowindow = new google.maps.InfoWindow({
        content: '<p>Viatura ' + this.locations.indexOf(location) + '</p>'
      });
      marker.addListener('click', function () {
        infowindow.open(this.gmaps, marker);
      });

      this.gmaps.addListener('click', function () {
        infowindow.close();
      });
      return marker;
    }.bind(this));

    // Add a marker clusterer to manage the markers.
    this.markerCluster = new MarkerClusterer(this.gmaps, this.markers,
      { imagePath: '../assets/m' });

  }

  onLocationTypeSet(event) {
    // console.log('POI clicado');
  }
  salvaPOI() {
    // this.locations.push();
    // this.onMapReady();
    const marker = new google.maps.Marker({
      position: { lat: this.poi.latitude, lng: this.poi.longitude },
      icon: '../assets/placeholder.png'
    });

    marker.addListener('click', function () {
      const origem = marker.getPosition().toJSON();
      // const destinos = this.markers.map(mark => {
      //   return mark.getPosition().toJSON();
      // });

      const destinos = this.locations.map(loc => {
        return loc;
      });

      this.distanceService.getDistanceMatrix(
        {
          origins: destinos,
          destinations: [origem],
          travelMode: 'DRIVING',
          drivingOptions: {
            departureTime: new Date(),
            // trafficModel: 'pessimistic'
          },
          // unitSystem: UnitSystem,
          avoidHighways: false,
          avoidTolls: true,
        }, (response, status) => {
          console.log(response);
          const travelTimes = response.rows.map(row => row.elements[0]);
          let menor = travelTimes[0];
          travelTimes.forEach(element => {
            if (element.duration.value < menor.duration.value) {
              menor = element;
            }
          });
          // console.log(travelTimes);
          // JSON.stringify(menor)
          this.closestMarker = travelTimes.indexOf(menor);
          this.currentTravelTime = menor.duration_in_traffic.text;
          // console.log('Menor ' + this.closestMarker);
          this.directionsDisplay.setMap(this.gmaps);
          this.directionsDisplay.setOptions({markerOptions: {opacity: 0}});
          this.directionsService.route({
            origin: this.locations[this.closestMarker],
            destination: origem,
            travelMode: 'DRIVING'
          }, (res, stat) => {
            if (stat === 'OK') {
              // console.log(res);
              this.directionsDisplay.setDirections(res);
            } else {
              window.alert('Directions request failed due to ' + stat);
            }
          });
        });
        const infowindow = new google.maps.InfoWindow({
          content: '<p>Marcador</p>'
        });
        this.gmaps.addListener('click', function () {
          infowindow.close();
        });
      infowindow.open(this.gmaps, marker);
    }.bind(this));

    this.markers.push(marker);
    this.markerCluster.addMarker(marker, true);

    this.markerCluster.redraw();
    this.poi = { nome: '', latitude: 0, longitude: 0 };
  }
}
