import { Component } from "@angular/core";
import { HomewatchApi } from "homewatch-js";
import { NavController, NavParams, PopoverController } from "ionic-angular";

import { ArraySorterHelper } from "../../../helpers/array_sorter";
import { HomewatchApiService } from "../../../services/homewatch_api";
import { NewScenarioThingPage } from "../../scenario_things/new/new";
import {Storage} from "@ionic/storage";
import {Translate} from "../../../helpers/Translate";
import {ThingsTranslator} from "../../../helpers/ThingsTranslator";


@Component({
  selector: "show-scenario-page",
  templateUrl: "show.html"
})
export class ShowScenarioPage {
  homewatch: HomewatchApi;
  scenario: any;
  scenarioThings: any;
  home: any;
  loading = true;
  theme = 'default';
  addDeviceLabel;

  constructor(public thingsTranslator : ThingsTranslator, public translate: Translate, public navCtrl: NavController,public storage: Storage, public navParams: NavParams, public homewatchApi: HomewatchApiService, public popoverCtrl: PopoverController) {
    this.homewatch = homewatchApi.getApi();
    this.scenario = this.navParams.get("scenario");
    this.home = this.navParams.get("home");
    this.translateLabels();
  }

  async translateLabels(){
    this.addDeviceLabel = await this.storage.get("addDeviceLabel");

  }

  async listScenarioThingsAPI(scenario){
    return await this.homewatch.scenarioThings(scenario).listScenarioThings();
  }

  async ionViewWillEnter() {
    let language = await this.storage.get("LANGUAGE");
    this.theme = await this.storage.get("THEME");

    this.loading = true;
    const response = await this.listScenarioThingsAPI(this.scenario);

    this.scenarioThings = ArraySorterHelper.sortArrayByID(response.data);

    for(let j = 0 ; j < this.scenarioThings.length ; j++){
      this.translate.TranslateText(this.scenarioThings[j].thing.room.name, language).then(data => {this.scenarioThings[j].thing.room.name = data});
      this.scenarioThings[j].action = await this.thingsTranslator.getThingAction(this.scenarioThings[j].status, this.scenarioThings[j].thing.name, language)
    }
    this.loading = false;
  }

  newScenarioThing() {
    this.navCtrl.push(NewScenarioThingPage, {
      home: this.home,
      scenario: this.scenario,
      selectedThings: this.scenarioThings
    });
  }

  editScenarioThing(scenarioThing: any) {
    this.navCtrl.push(NewScenarioThingPage, {
      home: this.home,
      scenario: this.scenario,
      selectedThings: this.scenarioThings,
      scenarioThing
    });
  }


}
