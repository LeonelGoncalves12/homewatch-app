import { Vibration } from '@ionic-native/vibration/ngx';

export class VibrateHelper {
  static vibrate() {

    let vibration = new Vibration();
    vibration.vibrate(1000);
  }


}
