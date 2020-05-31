import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HomewatchApi} from "homewatch-js";
import {Events, NavController, NavParams, PopoverController} from "ionic-angular";

import {ArraySorterHelper} from "../../../helpers/array_sorter";
import {ThingsInfoHelper} from "../../../helpers/things_info";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {Storage} from "@ionic/storage";


@Component({
  selector: "new-scenario-thing-page",
  templateUrl: "new.html"
})
export class NewScenarioThingPage {
  @ViewChild("thingStatus", {read: ViewContainerRef}) thingStatus: ViewContainerRef;
  editMode = false;
  scenarioThingForm: FormGroup;
  scenarioThing: any;
  homewatch: HomewatchApi;
  scenario: any;
  home: any;
  things: any = [];
  status: any;
  loading = true;
  thingCompareIndex: any;
  failed = false;
  theme = 'default';

  newScenarioThingLabel;
  editLabel;
  removeDeviceLabel;
  saveLabel;
  tryAgainLabel;
  somethingFailedLabel;

  constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams, homewatchApi: HomewatchApiService, public formBuilder: FormBuilder, public popoverCtrl: PopoverController, public compFactoryResolver: ComponentFactoryResolver, public events: Events) {
    this.homewatch = homewatchApi.getApi();
    this.scenario = this.navParams.get("scenario");
    this.home = this.navParams.get("home");

    this.scenarioThingForm = formBuilder.group({
      id: [""],
      thing_id: ["", Validators.required],
      status: ["", Validators.required]
    });
    this.translateLabels();
  }

  async translateLabels() {
    this.newScenarioThingLabel = await this.storage.get("scenariosLabel");
    this.editLabel = await this.storage.get("editLabel");
    this.removeDeviceLabel = await this.storage.get("removeDeviceLabel");
    this.saveLabel = await this.storage.get("saveLabel");
    this.tryAgainLabel = await this.storage.get("tryAgainLabel");
    this.somethingFailedLabel = await this.storage.get("somethingFailedLabel");
  }

  async loadThingStatus(thing) {
    this.events.subscribe(`thing:status:update:out${thing.id}`, (status => {
      this.onStatusChange(status);
    }));
    this.navParams.data.thing = thing;
    if (this.editMode) this.navParams.data.status = this.scenarioThing.status;
    this.thingStatus.clear();
    const compFactory = this.compFactoryResolver.resolveComponentFactory(ThingsInfoHelper.getThingInfo(thing.type).showPage);
    this.thingStatus.createComponent(compFactory);
  }


  async listRoomsAPI(home) {
    return await this.homewatch.rooms(home).listRooms();
  }

  async listThingsAPI(room){
    return await this.homewatch.things(room).listThings();
  }

  async loadThings() {
    const response_rooms = await this.listRoomsAPI(this.home);
    for (let j = 0; j < response_rooms.data.length; j++) {
      const respthings = await this.listThingsAPI(response_rooms.data[j]);
      for (let z = 0; z < respthings.data.length; z++) {
        this.things.push(respthings.data[z]);
      }
    }

    this.things = ArraySorterHelper.sortArrayByID(this.things);
    this.things = ArraySorterHelper.filterAssignableThings(this.things);
  }

  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    this.loading = true;
    this.failed = false;
    await this.loadThings();
    this.scenarioThing = this.navParams.get("scenarioThing");
    this.navParams.data.type = 'thing';
    try {
      if (this.scenarioThing) {
        this.editMode = true;

        this.preloadThingStatus();
        await this.loadThingStatus(this.scenarioThing.thing);

        this.scenarioThingForm.patchValue({
          id: this.scenarioThing.id,
          thing_id: this.scenarioThing.thing.id,
          status: this.scenarioThing.status
        });
      }
      this.loading = false;
    }
    catch (error) {
      this.loading = false;
      this.failed = true;
      console.error(error)
    }


  }

  onStatusChange(status) {

    this.scenarioThingForm.patchValue({status});
  }


  async preloadThingStatus() {
    this.status = this.scenarioThing.status;
    this.navParams.data.status = this.status;
  }


  async removeScenarioThing() {
    await this.homewatch.scenarioThings(this.scenario).deleteScenarioThing(this.scenarioThing.id);
    this.navCtrl.pop();
  }

  onThingChange(thing) {
    this.thingCompareIndex = thing.id;
    this.scenarioThingForm.patchValue({thing_id: thing.id});
    this.loadThingStatus(thing);
  }

  async onSubmit(form: FormGroup) {

    if (this.editMode) {

      await this.homewatch.scenarioThings(this.scenario).updateScenarioThing(form.value.id, {
        thing_id: form.value.thing_id,
        status: form.value.status
      });
    }
    else {
      await this.homewatch.scenarioThings(this.scenario).createScenarioThing({
        thing_id: form.value.thing_id,
        status: form.value.status
      });
    }
    this.navCtrl.pop();
  }
}
