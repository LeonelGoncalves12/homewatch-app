import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Config} from "../config";

@Injectable()
export class apiWeather {

  apiUrl = 'https://api.openweathermap.org/data/2.5/';


  constructor(public config: Config, public http: HttpClient) {

  }

  async getWeather(city) {
    let key = await this.config.getOpenWeatherMapApiKey();
    return new Promise(resolve => {
     this.http.get(this.apiUrl+ 'weather?q=' + city + '&lang=en&units=metric&appid=' + key).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }



}
