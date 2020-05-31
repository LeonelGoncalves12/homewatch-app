import {Component} from "@angular/core";
import {Events, NavParams} from "ionic-angular";

import {DevicePage} from "../device";

@Component({
  selector: "page-show-motion-sensor",
  templateUrl: "show.html"
})
export class ShowMotionSensorPage extends DevicePage {
  status: { movement: boolean };
  statusCompare: { movement: boolean };
  isON = false;
  inverse= false;

  constructor(public navParams: NavParams, public events: Events) {
    super(navParams, events);
    if (this.status && this.status.movement) {
      this.isON = true;
    }

    if (this.statusCompare && !this.statusCompare.movement) {
      this.inverse = true;
    }

  }

  switchStatus() {
    if (this.type == 'thingCompare') {
      if (this.statusCompare.movement) {
        this.statusCompare = {movement: false};
      } else {
        this.statusCompare = {movement: true};
      }
      if (this.isON) {
        this.isON = false;
      } else {
        this.isON = true;
      }
      this.onStatusChangeCompare();
    }
  }

  defaultStatus() {
    this.status = {movement: false};
  }


  defaultStatusCompare() {
    this.statusCompare = {movement: false};
  }


}
