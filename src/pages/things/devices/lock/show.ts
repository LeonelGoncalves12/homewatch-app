import { Component } from "@angular/core";
import { Events, NavParams } from "ionic-angular";

import { DevicePage } from "../device";

@Component({
  selector: "page-show-lock",
  templateUrl: "show.html"
})
export class ShowLockPage extends DevicePage {
  status: { locked: boolean };
  statusCompare: { locked: boolean };

  inverse= false;

  constructor(public navParams: NavParams, public events: Events) {
    super(navParams, events);
    this.inverse = false;
    if (this.status && !this.status.locked) {
      this.inverse = true;
    }

    if (this.statusCompare && !this.statusCompare.locked) {
      this.inverse = true;
    }
  }

  switch_lock_unlock(){

    if(this.type == 'thing'){
      if(this.status.locked){
        this.status.locked =  false
      }else{
        this.status.locked = true
      }
      this.onStatusChange();

    } else if(this.type == 'thingCompare'){
      if(this.statusCompare.locked){
        this.statusCompare = {locked: false};
      }else{
        this.statusCompare = {locked: true};
      }

      this.onStatusChangeCompare();
    }
  }

  defaultStatus() {
    this.status = { locked: true };
  }
  defaultStatusCompare() {
    this.statusCompare = { locked: true };
  }
}
