import {Component} from "@angular/core";
import {Events, NavParams} from "ionic-angular";
import {DevicePage} from "../device";

@Component({
  selector: "show-status-page",
  templateUrl: "show.html"
})
export class ShowLightPage extends DevicePage {
  status: { on: boolean };
  statusCompare: { on: boolean };

  inverse = false;

  constructor(public navParams: NavParams, public events: Events) {
    super(navParams, events);
    this.inverse = false;
    if (this.status && !this.status.on) {
      this.inverse = true;
    }

    if (this.statusCompare && !this.statusCompare.on) {
      this.inverse = true;
    }
  }

  switch_on_off() {
    if (this.type == 'thing') {
      if (this.status.on) {
        this.status.on = false
      } else {
        this.status.on = true
      }
      this.onStatusChange();

    } else if (this.type == 'thingCompare') {
      if (this.statusCompare.on) {
        this.statusCompare = {on: false};
      } else {
        this.statusCompare = {on: true};
      }

      this.onStatusChangeCompare();
    }
  }

  defaultStatus() {
    this.status = {on: true};
  }

  defaultStatusCompare() {
    this.statusCompare = {on: true};
  }
}
