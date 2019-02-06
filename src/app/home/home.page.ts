import { Component, OnInit } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';
import {
  GoogleMaps,
  GoogleMap,
  Marker,
  Geocoder,
  GeocoderResult,
  Polyline
} from '@ionic-native/google-maps';

declare var google: any;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  map: GoogleMap;

  distance: any = {};

  directionsService: any;

  loading: any;

  fromMarker: Marker;
  toMarker: Marker;

  status: any;
  startPoint: any;
  destinationPoint: any;
  distanceValue: any;
  durationValue: any;

  constructor(private platform: Platform, private loadingCtrl: LoadingController) {
    this.status = false;
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();
  }

  loadMap() {
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          "lat": 6.9218374,
          "lng": 79.8211859
        },
        zoom: 18,
        tilt: 30
      },
      styles: this.googleMapStyle
    });
    this.directionsService = new google.maps.DirectionsService();
  }

  async markerAddress(address: any, loading: any, type: any) {
    loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });

    await loading.present();

    if (type === 'start') {
      if (this.fromMarker !== undefined)
        this.fromMarker.remove();
    } else {
      if (this.toMarker !== undefined)
        this.toMarker.remove();
    }

    Geocoder.geocode({
      "address": address
    })
      .then((results: GeocoderResult[]) => {
        loading.dismiss();

        if (results.length > 0) {
          if (type === 'start') {
            this.startPoint = results[0].extra.lines.toString();
            this.fromMarker = this.map.addMarkerSync({
              'position': results[0].position,
              'title': results[0].extra.lines.toString()
            });
            this.map.animateCamera({
              'target': this.fromMarker.getPosition(),
              'zoom': 17
            });

            this.fromMarker.showInfoWindow();
          } else {
            this.destinationPoint = results[0].extra.lines.toString();

            this.toMarker = this.map.addMarkerSync({
              'position': results[0].position,
              'title': results[0].extra.lines.toString()
            });
            this.map.animateCamera({
              'target': this.toMarker.getPosition(),
              'zoom': 17
            });

            this.toMarker.showInfoWindow();
          }

        } else {
          alert("Address not found");
        }
      });
  }

  calculateAndDisplayRoute(from: String, to: String) {
    this.directionsService.route({
      origin: from,
      destination: to,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.distanceValue = response.routes[0].legs[0].steps[0].duration.text;
        this.durationValue = response.routes[0].legs[0].steps[0].distance.text;

        let decode = google.maps.geometry.encoding.decodePath(response.routes[0].overview_polyline);
        let lines = [];

        for (let i of decode) {
          lines.push({ "lat": i.lat(), "lng": i.lng() });
        }
        let polyline: Polyline = this.map.addPolylineSync({
          points: lines,
          color: '#ffffff',
          width: 4,
          geodesic: true
        });
        this.status = true;
      } else {
        alert('Directions request failed due to ' + status);
      }
    });
  }

  getDistance() {
    this.status = false;
    this.markerAddress(this.distance.from, this.loading, 'start');
    this.markerAddress(this.distance.to, this.loading, 'distination');
    this.calculateAndDisplayRoute(this.distance.from, this.distance.to);
  }

  googleMapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#242f3e"
        }
      ]
    },
    {
      "featureType": "administrative.locality",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#263c3f"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#6b9a76"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#38414e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#212a37"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9ca5b3"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#746855"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#1f2835"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#f3d19c"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#2f3948"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#d59563"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#515c6d"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#17263c"
        }
      ]
    }
  ];

}