import {HomewatchApiService} from "./services/homewatch_api";

import {Injectable} from "@angular/core";

@Injectable()
export class Config {
  getTranslateAPIKey()
  {
    return this.getKey('TRANSLATE_API_KEY');
  }

  getOneSignalSenderID()
  {
    return this.getKey('SENDER_ID');
  }

  getOneSignalAppID()
  {
    return this.getKey('ONE_SIGNAL_APP_ID');
  }

  getOpenWeatherMapApiKey()
  {
    return this.getKey('OPEN_WEATHER_MAP_API_KEY');
  }

  getGeoCodeApiKey()
  {
    return this.getKey('GEO_CODE_API_KEY');
  }

  async getKey(id)
  {
    let homewatchApiService = new HomewatchApiService();
    const response =  await homewatchApiService.getApi().keys.getKey(id);
    return atob(response.data);
  }
}
