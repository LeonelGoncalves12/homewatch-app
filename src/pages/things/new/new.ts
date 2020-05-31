import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HomewatchApi} from 'homewatch-js';
import {AlertController, Events, NavController, NavParams, PopoverController, ToastController} from 'ionic-angular';

import {ThingsInfoHelper} from '../../../helpers/things_info';
import {HomewatchApiService} from '../../../services/homewatch_api';
import {Storage} from "@ionic/storage";
import {Translate} from "../../../helpers/Translate";
import {VibrateHelper} from "../../../helpers/vibration";

@Component({
  selector: "page-new-thing",
  templateUrl: "new.html"
})
export class NewThingPage {
  @ViewChild("thingStatus", {read: ViewContainerRef}) thingStatus: ViewContainerRef;
  editMode = false;
  thingForm: FormGroup;
  typeOptions: Array<Object>;
  subTypeOptions: Array<string> = [];
  homewatch: HomewatchApi;
  submitted = false;
  home: any;
  room: any;
  thing: any;
  status: any;
  interval: NodeJS.Timer;
  using = false;
  selectedType;
  selectedSubType;
  renderName = false;
  searching = false;
  theme = 'default';
  loading = true;
  addressLabel;
  portLabel;
  findDevicesLabel;
  nameLabel;
  addDeviceLabel;
  saveLabel;
  typeLabel;

  constructor(public translate: Translate, public navCtrl: NavController, public toastCtrl: ToastController, public storage: Storage, public alertCtrl: AlertController, public navParams: NavParams, homewatchApi: HomewatchApiService, public formBuilder: FormBuilder, public events: Events, public popoverCtrl: PopoverController, public compFactoryResolver: ComponentFactoryResolver) {
    this.homewatch = homewatchApi.getApi();
    this.typeOptions = ThingsInfoHelper.getTypeOptions();

    this.thingForm = formBuilder.group({
      id: [""],
      name: ["", Validators.required],
      type: ["", Validators.required],
      subtype: ["", Validators.required],
      connection_info: formBuilder.group({
        address: ["", Validators.required],
        port: [""]
      }),
      extra_info: [""],
      favorite: [""]
    });

    this.thingForm.valueChanges.subscribe(data => {
      if (data.type) this.subTypeOptions = ThingsInfoHelper.getThingInfo(data.type).subTypes;
    });

    this.translateLabels();
  }

  async translateLabels() {
    this.typeLabel = await this.storage.get("typeLabel");
    this.addressLabel = await this.storage.get("addressLabel");
    this.portLabel = await this.storage.get("portLabel");
    this.findDevicesLabel = await this.storage.get("findDevicesLabel");
    this.nameLabel = await this.storage.get("nameLabel");
    this.saveLabel = await this.storage.get("saveLabel");
    this.addDeviceLabel = await this.storage.get("addDeviceLabel")
  }

  async ionViewWillEnter() {

    this.theme = await this.storage.get("THEME");
    this.room = this.navParams.get("room");
    this.thing = this.navParams.get("thing");
    this.home = this.room.home
    this.translate.translateList(this.typeOptions, 'text', this.storage)
    this.loading = false;
  }

  async onSubmit(form: FormGroup) {

    Object.assign(form.value.connection_info, JSON.parse(form.value.extra_info));
    await this.createThing(this.room, form);

    this.navCtrl.pop();
  }

  async createThing(room, form) {
    return await this.homewatch.things(room).createThing(form.value);
  }

  async onStatusChange(newStatus) {
    clearInterval(this.interval);
    try {
      const response = await this.putStatus(newStatus);
      this.status = response.data;
    } catch (error) {
      this.showErrorToast("Couldn't change the device status");
    }
  }

  async putStatus(newStatus) {
    return await this.homewatch.status(this.thing).putStatus(newStatus);
  }

  showErrorToast(message: string) {
    this.toastCtrl.create({
      message,
      duration: 3000,
      showCloseButton: true
    }).present();
  }

  private buildDiscoveryParams() {
    return {
      type: this.thingForm.value.type,
      subtype: this.thingForm.value.subtype,
      port: this.thingForm.value.connection_info.port
    };
  }

  private popoverCallback = async data => {
    if (!data) return;

    VibrateHelper.vibrate();

    delete data.address;
    delete data.port;
    delete data.type;
    delete data.subtype;


    if (!this.thingForm.value.extra_info) {

      this.thingForm.patchValue({
        extra_info: JSON.stringify(data),
        favorite: "1"
      });
    } else {
      this.thingForm.patchValue({
        favorite: "1"
      });

    }

    this.renderName = true;
  };

  showAlert(title, message) {
    const alert = this.alertCtrl.create({
      title,
      message,
      buttons: [
        {
          text: "OK",
          role: "cancel"
        }
      ]
    });

    alert.present();
  }

  showRadioAlert(devices: Array<any>) {
    const alert = this.alertCtrl.create({
      title: "Discovered Things"
    });

    devices.forEach(device => {
      alert.addInput({
        type: 'radio',
        label: `${device.address}`,
        value: device
      });
    });
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Okay',
      handler: (data: any) => {
        console.log("handler started");
        this.popoverCallback(data);
      }
    });
    this.presentAlert(alert);
  }

  presentAlert(alert) {
    alert.present();
  }

  async discoverDevices() {
    try {
      this.searching = true;
      let params = this.buildDiscoveryParams();
      const response = await this.discoverThingsAPI(this.room, params);

      if (response.data.length === 0)
        this.showAlert("Error", "Couldn't find any device on your network!");
      else
        this.showRadioAlert(response.data);
    } catch (error) {

      console.error(error);

      this.showAlert("Error", "Couldn't find any device on your network!");

      this.popoverCallback(undefined);
    }
    this.searching = false
  }

  async discoverThingsAPI(room, params) {
    return await  this.homewatch.things(room).discoverThings(params);
  }

  chooseType(option) {
    this.selectedType = option.text;
    this.thingForm.patchValue({type: option.type})
  }


  chooseSubType(option) {
    this.selectedSubType = option;
    this.thingForm.patchValue({subtype: option})
  }

}
