import { Geolocation } from '@ionic-native/geolocation/ngx';

export class GeolocationHelper {

  static getLocation()
  {
    let geolocation = new Geolocation();

    geolocation.getCurrentPosition().then((resp) => {

    }).catch((error) => {
      console.log('Error getting location', error);
    });
    return geolocation;
  }
}
