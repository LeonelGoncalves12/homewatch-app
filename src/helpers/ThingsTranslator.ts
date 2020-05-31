import {Translate} from "./Translate";
import { Injectable } from '@angular/core';


@Injectable()
export class ThingsTranslator {

  constructor(public translate: Translate){

  }

  async getThingAction(status: Object, name, language) {
    const keys = Object.keys(status);
    const key = keys[0];
    let text = "";

    switch (key) {
      case 'on':
        if (status[key] === false) {
          await this.translate.TranslateText("Turn off ", language).then(data => {
            text = data;
          })
          text = text + name;
        } else {
          await this.translate.TranslateText("Turn on ", language).then(data => {
            text = data;
          })
          text = text + name;
        }
        break;
      case 'locked':
        if (status[key] === false) {
          await this.translate.TranslateText("Unlock ", language).then(data => {
            text = data;
          })
          text = text + name;
        } else {
          await this.translate.TranslateText("Lock ", language).then(data => {
            text = data;
          })
          text = text + name;
        }
        break;
      case 'targetTemperature':
        await this.translate.TranslateText("Regulate temperature (", language).then(data => {
          text = data;
        });
        text = text + name;
        await this.translate.TranslateText(") to ", language).then(data => {
          text = text + data;
        });
        text = text + status[key] + "ºC";
        break;
    }

    return text
  }

  async getThingCompareAction(status: Object,  operator, language ) {
    const keys = Object.keys(status);
    const aux = keys[0];
    console.error(aux)
    let text = "";
    let sensor;

    switch (aux) {
      case 'on':
        operator = '==';
        if (status[aux] === false) {
          await this.translate.TranslateText(" is turned off.", language).then(data => {
            text = data;
          })

        } else {
          await this.translate.TranslateText(" is turned on.", language).then(data => {
            text = data;
          })
        }
        break;
      case 'locked':
        operator = '==';
        if (status[aux] === false) {
          await this.translate.TranslateText(" is unlocked.", language).then(data => {
            text = data;
          })
        } else {
          await this.translate.TranslateText(" is locked.", language).then(data => {
            text = data;
          })
        }
        break;
      case 'targetTemperature':
        switch (operator) {
          case '>':
            await this.translate.TranslateText(" is higher than " + status['targetTemperature'] + "ºC", language).then(data => {
              text = data;
            });

            break;
          case '<':

            await this.translate.TranslateText(" is lower than " + status['targetTemperature'] + "ºC", language).then(data => {
              text = data;
            });
            break;
          case '==':

            await this.translate.TranslateText(" is equals to " + status['targetTemperature'] + "ºC" , language).then(data => {
              text = data;
            });
            break;
        }
        break;

      case 'temperature':
        sensor = 'temperature';
        switch (operator) {
          case '>':
            await this.translate.TranslateText(" detects temperature outside is higher than " + status['temperature'] + "ºC", language).then(data => {
              text = data;
            });
            break;
          case '<':
            await this.translate.TranslateText(" detects temperature outside is lower than " + status['temperature'] + "ºC", language).then(data => {
              text = data;
            });
            break;
          case '==':
            await this.translate.TranslateText(" detects temperature outside is equals to " + status['temperature'] + "ºC", language).then(data => {
              text = data;
            });
            break;
        }
        break;

      case 'windSpeed':
        sensor = 'windSpeed';
        switch (operator) {
          case '>':
            await this.translate.TranslateText(" detects wind speed is higher than " + status['windSpeed'] + "km/h", language).then(data => {
              text = data;
            });
            break;
          case '<':
            await this.translate.TranslateText(" detects wind speed is lower than " + status['windSpeed'] + "km/h", language).then(data => {
              text = data;
            });
            break;
          case '==':
            await this.translate.TranslateText(" detects wind speed is equals to " + status['windSpeed'] + "km/h", language).then(data => {
              text = data;
            });
            break;
        }
        break;

      case 'cloudy':
        sensor = null
        operator = '==';
        await this.translate.TranslateText(" detects it's cloudy", language).then(data => {
          text = data;
        });

        break;

      case 'raining':
        sensor = null
        operator = '==';
        await this.translate.TranslateText(" detects it's raining", language).then(data => {
          text = data;
        });

        break;

      case 'movement':
        operator = '==';
        if (status[aux] === false) {
          await this.translate.TranslateText(" not detects movement.", language).then(data => {
            text = data;
          })
        } else {
          await this.translate.TranslateText(" detects movement.", language).then(data => {
            text = data;
          })
        }
        break;
    }

    let output = {text: text, operator: operator, sensor:sensor};
    return output;
  }


}
