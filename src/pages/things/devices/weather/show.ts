import { Component } from "@angular/core";
import { Events, NavParams } from "ionic-angular";
import { DevicePage } from "../device";

@Component({
  selector: "page-show-weather",
  templateUrl: "show.html"
})
export class ShowWeatherPage extends DevicePage {
  status: {
    cloudy: boolean,
    raining: boolean,
    temperature: number,
    windSpeed: number
  };
  sensor = 'cloudy';
  finalStatus : any

  indexTemperature= 11;
  indexWind= 51;

  statusCompare: {
    cloudy: boolean,
    raining: boolean,
    temperature: number,
    windSpeed: number
  };
constructor(public navParams: NavParams, public events: Events) {
    super(navParams, events);
}

  defaultStatus() {
    this.status = {
      cloudy: false,
      raining: false,
      temperature: 0,
      windSpeed: 0
    };
  }


  range(j, k) {
    return Array
      .apply(undefined, Array((k - j) + 1))
      .map((_discard, n) => (n + j));
  }

  chooseIndex(n, type){
  if(type == 'temperature') {
    this.indexTemperature = n;

    this.statusCompare.temperature = n;

  }else if(type == 'windSpeed'){
    this.indexWind = n;

    this.statusCompare.windSpeed = n;

  }
    this.setStatus();

  }
  chooseSensor(type){
    switch (type){
      case 'temperature':
          this.sensor = 'temperature';
        break;
      case 'windSpeed':
        this.sensor = 'windSpeed';
        break;
      case 'cloudy':
        this.sensor = 'cloudy';
        break;
      case 'raining':
        this.sensor = 'raining';
        break;
    }
    this.setStatus();
  }

  setStatus(){
    this.finalStatus = {[this.sensor]: this.statusCompare[this.sensor]};
    this.onStatusChangeCompare2();
  }

  defaultStatusCompare() {
    this.statusCompare = {
      cloudy: false,
      raining: false,
      temperature: 11,
      windSpeed: 51
    };

    this.finalStatus = {cloudy:true}
  }
}
