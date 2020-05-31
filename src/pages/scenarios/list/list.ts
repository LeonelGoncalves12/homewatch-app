import { Component ,ViewChild } from "@angular/core";
import { HomewatchApi } from "homewatch-js";
import { NavController, NavParams , Slides, ToastController} from "ionic-angular";


import { ArraySorterHelper } from "../../../helpers/array_sorter";
import { HomewatchApiService } from "../../../services/homewatch_api";
import { NewScenarioPage } from "../new/new";
import { ShowScenarioPage } from "../show/show";
import {Storage} from "@ionic/storage";
import {Translate} from "../../../helpers/Translate";

@Component({
  selector: "list-scenarios-page",
  templateUrl: "list.html"
})
export class ListScenariosPage {
  homewatch: HomewatchApi;
  home: any;
  loading = true;
  scenarios: Array<any> = [];
  scenario: any;
  scenarioThings: any ;
  scenarioIndex: any;
  theme = 'default';
  @ViewChild('slider') slider: Slides;

  scenariosLabel;
  newScenarioLabel;
  scenariosDevicesLabel;
  addDeviceLabel;
  applyScenarioLabel;
  editDevicesLabel;


  constructor(public translate: Translate, public navCtrl: NavController, public storage: Storage, public navParams: NavParams, public toastCtrl: ToastController,  homewatchApiService: HomewatchApiService) {
    this.homewatch = homewatchApiService.getApi();
    this.home = this.navParams.get("home");
    this.translateLabels();
  }

  async translateLabels(){
    this.scenariosLabel = await this.storage.get("scenariosLabel");
    this.newScenarioLabel = await this.storage.get("newScenarioLabel");
    this.scenariosDevicesLabel = await this.storage.get("scenariosDevicesLabel");
    this.applyScenarioLabel = await this.storage.get("applyScenarioLabel");
    this.addDeviceLabel = await this.storage.get("addDeviceLabel");
    this.editDevicesLabel = await this.storage.get("editDevicesLabel");
  }

  async listScenariosAPI(home){
    return await this.homewatch.scenarios(home).listScenarios();
  }
  async listScenarioThingsAPI(scenario){
    return await this.homewatch.scenarioThings(this.scenario).listScenarioThings();
  }

  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    let language = await this.storage.get("LANGUAGE");

    this.loading = true;
    try {
      const response = await this.listScenariosAPI(this.home);

      this.scenarios = ArraySorterHelper.sortArrayByID(response.data);


      if (this.scenarios.length > 0) {
        this.scenario = this.scenarios[0];
        this.scenarioIndex = this.scenarios[0].id;
        const response = await this.listScenarioThingsAPI(this.scenario);

        this.scenarioThings = response.data;

        for(let j = 0 ; j < this.scenarioThings.length ; j++){
          this.translate.TranslateText(this.scenarioThings[j].thing.room.name, language).then(data => {this.scenarioThings[j].thing.room.name = data});
        }
      }

      this.loading = false;
    } catch (error) {
      console.error(error);
    }
  }

  newScenario() {
    this.navCtrl.push(NewScenarioPage, { home: this.home });
  }

  showScenario(scenario: any) {
    this.navCtrl.push(ShowScenarioPage, { home: this.home, scenario });
  }

  editScenario(scenario: any) {
    this.navCtrl.push(NewScenarioPage, { home: this.home, scenario });
  }


  async chooseScenario(scenario){
    this.scenario=scenario;
    this.scenarioIndex = this.scenario.id;

    const response = await this.listScenarioThingsAPI(scenario);
    this.scenarioThings = response.data;
  }

  @ViewChild(Slides) slides: Slides;
  slidePrev() {
    this.slides.slidePrev();
  }
  slideNext() {
    this.slides.slideNext();
  }


  async applyScenario() {
    try {
      await this.homewatch.scenarioApplier(this.scenario).applyScenario();

      this.toastCtrl.create ({
        message: "Scenario applied!",
        showCloseButton: true,
        duration: 2000
      }).present();
    } catch (error) {
      console.error(error);
    }
  }


}
