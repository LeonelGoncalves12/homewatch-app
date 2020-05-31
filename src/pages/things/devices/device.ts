import { OnDestroy } from "@angular/core";
import { Events, NavParams } from "ionic-angular";

export abstract class DevicePage implements OnDestroy {
  thing: any;
  type: any;
  status: any;
  thingCompare: any;
  statusCompare: any;
  readOnly: false;
  sensor : any;
  finalStatus: any;


  typeLabel;
  addressLabel;
  portLabel;
  findDevicesLabel;
  nameLabel;
  deviceLabel;
  saveLabel;


  constructor(public navParams: NavParams, public events: Events) {

    this.thing = this.navParams.get("thing");
    this.status = this.navParams.get("status")
    this.statusCompare = this.navParams.get("statusCompare")
    this.thingCompare = this.navParams.get("thingCompare");
    this.type = this.navParams.get("type");

console.log(this.type);
    if(this.type == 'thing'){
      this.events.subscribe(`thing:status:update:in${this.thing.id}`, status => this.status = status);

      if (this.status === undefined) {
        this.defaultStatus();
        this.onStatusChange();
      }

    } else if(this.type == 'thingCompare'){
      this.events.subscribe(`thingCompare:statusCompare:update:in${this.thingCompare.id}`, status => this.statusCompare = status);
      if (this.statusCompare === undefined) {
        this.defaultStatusCompare();
        this.onStatusChangeCompare();
      }
    }
  }


  async onStatusChange() {
      this.events.publish(`thing:status:update:out${this.thing.id}`, this.status);
  }

  async onStatusChangeCompare() {
    this.events.publish(`thingCompare:statusCompare:update:out${this.thingCompare.id}`, this.statusCompare);
  }

  async onStatusChangeCompare2() {
    this.events.publish(`thingCompare:statusCompare:update:out${this.thingCompare.id}`, this.finalStatus);
  }

  ngOnDestroy() {
    if(this.type == 'thing'){
      this.events.unsubscribe(`thing:status:update:in${this.thing.id}`);
    } else if(this.type == 'thingCompare') {
      this.events.unsubscribe(`thingCompare:statusCompare:update:in${this.thingCompare.id}`);
    }
  }

  abstract defaultStatus();
  abstract defaultStatusCompare();
}
