import { Component } from "@angular/core";
import { Events, NavParams } from "ionic-angular";

import { DevicePage } from "../device";
import {Storage} from "@ionic/storage";


@Component({
  selector: "page-show-thermostat",
  templateUrl: "show.html"
})
export class ShowThermostatPage extends DevicePage {
  status: { targetTemperature: number };
  index = 12;
  theme = 'default';
  statusCompare : {targetTemperature: number};


  constructor(public navParams: NavParams, public storage: Storage, public events: Events) {
    super(navParams, events);
    if(this.status && this.status.targetTemperature ){
      this.index = this.status.targetTemperature;
    }

    if(this.statusCompare && this.statusCompare.targetTemperature ){
      this.index = this.statusCompare.targetTemperature;
    }
    this.initializeTheme();
  }

  async initializeTheme() {
    this.theme = await this.storage.get("THEME");
  }

  defaultStatus() {
    this.status = { targetTemperature: 12 };
  }

  defaultStatusCompare() {
    this.statusCompare = { targetTemperature: 12 };

  }

  range(j, k) {
    return Array
      .apply(undefined, Array((k - j) + 1))
      .map((_discard, n) => (n + j));
  }
  chooseIndex(n){
    this.index = n;
    if(this.type == 'thing') {
      this.status.targetTemperature = n;
      this.onStatusChange();
    } else if(this.type == 'thingCompare'){

      this.statusCompare = {targetTemperature: n};
      this.onStatusChangeCompare();
    }
  }
}
