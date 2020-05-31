import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from "@angular/core";
import {HomewatchApi} from "homewatch-js";
import {Events, NavController, NavParams, PopoverController, ToastController, ViewController} from "ionic-angular";

import {HomewatchApiService} from "../../../../services/homewatch_api";

@Component({
  selector: "new-page",
  templateUrl: "popover.html"
})
export class TriggeredTaskPopoverPage {
  @ViewChild("thingStatus", {read: ViewContainerRef}) thingStatus: ViewContainerRef;
  homewatch: HomewatchApi;
  cleanHomewatch: HomewatchApi;
  thing: any;
  temperature: any;
  wind: any;
  options: any = [];
  index: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, homewatchApiService: HomewatchApiService, public compFactoryResolver: ComponentFactoryResolver, public popoverCtrl: PopoverController, public events: Events, public viewCtrl: ViewController) {
    this.homewatch = homewatchApiService.getApi();
    this.cleanHomewatch = homewatchApiService.getCleanApi();
    this.thing = this.viewCtrl.data.thing;
  }

  async ionViewWillEnter() {
    this.checkType();
    console.error("teste");
  }

  editThing() {
    this.viewCtrl.dismiss();
  }

  choose_option(option) {
    this.index = option.id;
  }

  checkType() {
    let myObject = {};
    switch (this.thing.type) {
      case 'Things::Thermostat' :
        myObject = {
          id: 1,
          title: "Temperature"
        };
        this.options.push(myObject);
        break;
      case 'Things::Weather':
        myObject = {
          id: 1,
          title: "Temperature"
        };
        this.options.push(myObject);
        myObject = {
          id: 2,
          title: "Wind Speed"
        };
        this.options.push(myObject);
        myObject = {
          id: 3,
          title: "Cloudy?"
        };
        this.options.push(myObject);
        myObject = {
          id: 4,
          title: "Raining?"
        };
        this.options.push(myObject);
        break;
      default:

    }
  }

  async submit() {
    this.viewCtrl.dismiss({id: this.index, type: this.thing.type});
  }
}
