import { ShowLightPage } from "../pages/things/devices/light/show";
import { ShowLockPage } from "../pages/things/devices/lock/show";
import { ShowThermostatPage } from "../pages/things/devices/thermostat/show";
import { ShowWeatherPage } from "../pages/things/devices/weather/show";
import { ShowMotionSensorPage } from "../pages/things/devices/motion_sensor/show";

export class ThingTypeInfo {
  subTypes: Array<string>;
  showPage: any;
  text: string;
  icon: string;
  type: string;
  readOnly: boolean;
}

export class ThingInfo {
  subTypes: Array<string>;
  showPage: any;
  text: string;
  icon: string;
  readOnly: boolean;
}

export class ThingsInfoHelper {
  private static things: { [key: string]: ThingInfo } = {
    "Things::Light": {
      subTypes: ["rest", "coap", "hue"],
      showPage: ShowLightPage,
      text: "Light",
      icon: "1",
      readOnly: false
    },
    "Things::Lock": {
      subTypes: ["rest"],
      showPage: ShowLockPage,
      text: "Lock",
      icon: "2",
      readOnly: false
    },
    "Things::Thermostat": {
      subTypes: ["rest"],
      showPage: ShowThermostatPage,
      text: "Thermostat",
      icon: "3",
      readOnly: false
    },
    "Things::Weather": {
      subTypes: ["rest", "owm"],
      showPage: ShowWeatherPage,
      text: "Weather",
      icon: "4",
      readOnly: true
    },
    "Things::MotionSensor": {
      subTypes: ["rest"],
      showPage: ShowMotionSensorPage,
      text: "Motion Sensor",
      icon: "5",
      readOnly: true
    }
  };

  static getTypeOptions(): Array<ThingTypeInfo> {
    return Object.keys(this.things).map(key => {
      return { ...this.things[key], type: key };
    });
  }

  static getAssignableTypeOptions(): Array<ThingTypeInfo> {
    return Object.keys(this.things).map(key => {
      return { ...this.things[key], type: key };
    }).filter(t => t.readOnly === false);
  }

  static getThingInfo(type: string): ThingInfo {
    return this.things[type];
  }

  static getThingInfo2(type: string): ThingInfo {
    return this.things[type];
  }
}
