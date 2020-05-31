import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HomewatchApi } from "homewatch-js";
import { Events, NavController, NavParams } from "ionic-angular";
import {Storage} from "@ionic/storage";
import { HomewatchApiService } from "../../../services/homewatch_api";

@Component({
  selector: "list-scenarios-page",
  templateUrl: "new.html"
})
export class NewScenarioPage {
  editMode = false;
  scenarioForm: FormGroup;
  homewatch: HomewatchApi;
  submitted = false;
  home: any;
  link: any;
  scenario: any;
  icons=[1,2,3];
  iconIndex = 1;
  using = false;
  theme = 'default';
  editLabel;
  createScenarioLabel;
  removeScenarioLabel;
  nameLabel;
  chooseIconLabel;

  constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams, homewatchApi: HomewatchApiService, public formBuilder: FormBuilder, public events: Events) {
    this.homewatch = homewatchApi.getApi();

    this.scenarioForm = formBuilder.group({
      id: [""],
      name: ["", Validators.required],
      icon: ["", Validators.required]
    });
    this.translateLabels();
  }

  async translateLabels(){
    this.editLabel = await this.storage.get("editLabel");
    this.createScenarioLabel = await this.storage.get("createScenarioLabel");
    this.removeScenarioLabel = await this.storage.get("removeScenarioLabel");
    this.nameLabel = await this.storage.get("nameLabel");
    this.chooseIconLabel=  await this.storage.get("chooseIconLabel");

  }
  async ionViewWillEnter() {
    this.home = this.navParams.get("home");
    this.theme = await this.storage.get("THEME");
    this.scenario = this.navParams.get("scenario");
    this.scenarioForm.patchValue({ icon: 1 });

    if (this.scenario) {
      this.editMode = true;
      this.iconIndex= this.scenario.icon;
      this.scenarioForm.setValue({
        id: this.scenario.id,
        name: this.scenario.name,
        icon: this.scenario.icon
      });

      this.checkUsage();
    }
  }

  async onSubmit(form: FormGroup) {
    if (this.editMode) {
      await this.homewatch.scenarios(this.home).updateScenario(form.value.id, form.value);
    } else {
      await this.homewatch.scenarios(this.home).createScenario(form.value);
    }
    this.navCtrl.pop();
  }



  chooseIcon(icon){
    this.iconIndex = icon;
    this.scenarioForm.patchValue({ icon: icon });
  }

  async removeScenario(){
    await this.homewatch.scenarios(this.home).deleteScenario(this.scenario.id);
    this.navCtrl.pop();
  }

  async listTimedTasksAPI(home){
    return await this.homewatch.timedTasks(home).listTimedTasks();
  }
  async listTriggeredTasksAPI(home){
    return await this.homewatch.triggeredTasks(this.home).listTriggeredTasks();
  }

  async checkUsage(){
    //timed_tasks
    const timed = await this.listTimedTasksAPI(this.home);
    for (let j = 0; j < timed.data.length; j++) {

      if(timed.data[j].scenario && (timed.data[j].scenario.id == this.scenario.id)) {
        this.using = true;
        break;
      }
    }

    //triggered_tasks
    const triggered = await this.listTriggeredTasksAPI(this.home);

    for (let j = 0; j < triggered.data.length; j++) {
      if(triggered.data[j].scenario && (triggered.data[j].scenario.id == this.scenario.id)) {
        this.using = true;
        break;
      }
    }
  }
}

