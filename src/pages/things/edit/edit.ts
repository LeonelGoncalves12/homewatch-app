import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HomewatchApi} from 'homewatch-js';
import {Events, NavController, NavParams, ToastController} from 'ionic-angular';

import {ThingsInfoHelper} from '../../../helpers/things_info';
import {HomewatchApiService} from '../../../services/homewatch_api';
import {Storage} from "@ionic/storage";

@Component({
  selector: "page-new-thing",
  templateUrl: "edit.html"
})
export class EditThingPage {

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
  loading = true;
  failed = false;
  theme = 'default';
  thingUnavailable = true;
  saveLabel;
  editLabel;
  deviceLabel;
  removeDeviceLabel;
  somethingFailedLabel;

  constructor(public navCtrl: NavController, public storage: Storage, public toastCtrl: ToastController, public navParams: NavParams, homewatchApi: HomewatchApiService, public formBuilder: FormBuilder, public events: Events, public compFactoryResolver: ComponentFactoryResolver) {
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
      favorite: ["", Validators.required]
    });

    this.thingForm.valueChanges.subscribe(data => {
      if (data.type) this.subTypeOptions = ThingsInfoHelper.getThingInfo(data.type).subTypes;
    });
    this.translateLabels();
  }

  async translateLabels() {
    this.saveLabel = await this.storage.get("saveLabel");
    this.deviceLabel = await this.storage.get("deviceLabel");
    this.removeDeviceLabel = await this.storage.get("removeDeviceLabel");
    this.somethingFailedLabel = await this.storage.get("somethingFailedLabel");
  }

  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    this.loading = true;
    this.failed = false;
    this.room = this.navParams.get("room");
    this.thing = this.navParams.get("thing");
    this.home = this.room.home;
    try {
      this.editMode = true;
      const extraInfo = {...this.thing.connection_info};
      delete extraInfo["address"];
      delete extraInfo["port"];

      this.thingForm.setValue({
        id: this.thing.id,
        name: this.thing.name,
        type: this.thing.type,
        subtype: this.thing.subtype,
        connection_info: {
          address: this.thing.connection_info.address,
          port: this.thing.connection_info.port || ""
        },
        extra_info: JSON.stringify(extraInfo),
        favorite: this.thing.favorite
      });

      this.checkUsage();
      this.navParams.data.status = this.thing.status;
      if (this.thing.status != null) {
        this.thingUnavailable = false;
      }
      this.navParams.data.type = 'thing';
      this.navParams.data.thing = this.thing;
      this.events.subscribe(`thing:status:update:out${this.thing.id}`, status => {
        this.onStatusChange(status);
      });

      this.initRealtimeUpdates();

      this.thingStatus.clear();
      const compFactory = this.compFactoryResolver.resolveComponentFactory(ThingsInfoHelper.getThingInfo(this.thing.type).showPage);
      this.thingStatus.createComponent(compFactory);

      this.loading = false;
    }
    catch (error) {
      this.loading = false;
      this.failed = true;
      console.error(error);
    }
  }

  async onSubmit(form: FormGroup) {

    Object.assign(form.value.connection_info, JSON.parse(form.value.extra_info));

    const response = await this.updateThing(this.room, form);
    this.events.publish("things:updated", response.data);

    this.navCtrl.pop();
  }

  async updateThing(room, form) {
    return await this.homewatch.things(room).updateThing(form.value.id, form.value);
  }

  initRealtimeUpdates() {
  }

  async onStatusChange(newStatus) {
    clearInterval(this.interval);

    try {
      const response = await this.putStatus(newStatus);
      this.status = response.data;
    } catch (error) {
      console.error(error);
    }

    this.initRealtimeUpdates();
  }

    async putStatus(newStatus){
        return await this.homewatch.status(this.thing).putStatus(newStatus);
    }

  tryAgain() {
    this.ionViewWillEnter();
  }


  ionViewWillLeave() {

    if (this.editMode) {
      this.events.unsubscribe(`thing:status:update:out${this.thing.id}`);
      this.events.unsubscribe("things:updated");
      clearInterval(this.interval);
    }
  }

  async listTimedTasksAPI(home) {
    return await this.homewatch.timedTasks(home).listTimedTasks();
  }

  async listTriggeredTasksAPI(home) {
    return await this.homewatch.triggeredTasks(home).listTriggeredTasks();
  }

  async listScenariosAPI(home) {
    return await this.homewatch.scenarios(home).listScenarios();
  }

  async checkUsage() {
    //timed_tasks
    const timed = await this.listTimedTasksAPI(this.room.home);

    for (let j = 0; j < timed.data.length; j++) {

      if (timed.data[j].thing && (timed.data[j].thing.id == this.thing.id)) {
        this.using = true;
        return;
      }
    }

    //triggered_tasks
    const triggered = await this.listTriggeredTasksAPI(this.room.home);
    for (let j = 0; j < triggered.data.length; j++) {
      if ((triggered.data[j].thing && (triggered.data[j].thing.id == this.thing.id)) || triggered.data[j].thing_to_compare.id == this.thing.id) {
        this.using = true;
        return;
      }
    }
    const scenarios = await this.listScenariosAPI(this.room.home);
    for (let j = 0; j < scenarios.data.length; j++) {
      const scenariosThings = scenarios.data[j].scenario_things;

      for (let l = 0; l < scenariosThings.length; l++) {
        if (scenariosThings[l].thing.id == this.thing.id) {
          this.using = true;
          return;
        }
      }
    }
  }

  async removeThing() {
    await this.homewatch.things(this.room.id).deleteThing(this.thing.id);
    this.navCtrl.pop();
  }
}
