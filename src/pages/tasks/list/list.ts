import {Component} from "@angular/core";
import {HomewatchApi} from "homewatch-js";
import {NavController, NavParams} from "ionic-angular";

import {ArraySorterHelper} from "../../../helpers/array_sorter";
import {ThingsTranslator} from "../../../helpers/ThingsTranslator"
import {DateCalculator} from "../../../helpers/NextRunDisplay"
import {HomewatchApiService} from "../../../services/homewatch_api";
import {NewTimedTaskPage} from "../timed/new/new";
import {NewTriggeredTaskPage} from "../triggered/new/new";
import {Storage} from "@ionic/storage";
import {Translate} from "../../../helpers/Translate";

@Component({
  selector: "list-tasks-page",
  templateUrl: "list.html"
})
export class ListTasksPage {
  homewatch: HomewatchApi;
  home: any;
  tasks_type = "timed";
  timed_tasks: Array<any>;
  triggered_tasks: Array<any>;
  scenarioThings: any;
  ThingsStatus: Array<any>;
  loading = true;
  theme = 'default';
  newTaskLabel;
  timedLabel;
  triggeredLabel;
  tasksLabel;
  whenLabel;
  activateLabel;

  constructor(public translate: Translate, public dateCalculator: DateCalculator, public thingsTranslator: ThingsTranslator, public navParams: NavParams, public storage: Storage, public navCtrl: NavController, homewatchApi: HomewatchApiService) {
    this.homewatch = homewatchApi.getApi();

    this.home = this.navParams.get("home");
    this.translateLabels();
  }

  async translateLabels() {
    this.newTaskLabel = await this.storage.get("newTaskLabel");
    this.timedLabel = await this.storage.get("timedLabel");
    this.triggeredLabel = await this.storage.get("triggeredLabel");
    this.tasksLabel = await this.storage.get("tasksLabel");
    this.whenLabel = await this.storage.get("whenLabel");
    this.activateLabel = await this.storage.get("activateLabel");
  }

  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    this.loading = true;
    this.scenarioThings = [];
    await this.loadTask(this.tasks_type);
    this.loading = false;
  }

  async onTypeChange(type) {
    this.loading = true;
    this.tasks_type = type;
    await this.loadTask(type);
    this.loading = false;
  }

  async loadTask(tasks_type) {
    switch (tasks_type) {
      case "triggered":
        await this.loadTriggeredTasks();
        break;
      case "timed":
        await this.loadTimedTasks();
        break;
    }
  }


  async listScenariosAPI(home) {
    return await this.homewatch.scenarios(home).listScenarios();
  }

  async listTimedTasksAPI(home) {
    return await this.homewatch.timedTasks(home).listTimedTasks();
  }

  async listTriggeredTasksAPI(home) {
    return await this.homewatch.triggeredTasks(home).listTriggeredTasks();
  }

  async listRoomsAPI(home) {
    return await this.homewatch.rooms(home).listRooms();
  }

  async listThingsAPI(room) {
    return await this.homewatch.things(room).listThings();
  }

  async getRoomAPI(home, room) {
    return await this.homewatch.rooms(home).getRoom(room);
  }

  async loadTimedTasks() {
    const response = await this.listTimedTasksAPI(this.home);
    let language = await this.storage.get("LANGUAGE");

    for (let i = 0; i < response.data.length; i++) {
      this.scenarioThings = [];
      this.ThingsStatus = [];
      if (response.data[i].thing) {

        const resprooms = await this.listRoomsAPI(this.home);
        for (let j = 0; j < resprooms.data.length; j++) {
          const respthings = await this.listThingsAPI(resprooms.data[j]);
          for (let z = 0; z < respthings.data.length; z++) {
            if (response.data[i].thing.id === respthings.data[z].id) {
              response.data[i].room = resprooms.data[j];
              response.data[i].room.name = await this.translate.TranslateText(response.data[i].room.name, language);
              let auxText = await this.thingsTranslator.getThingAction(response.data[i].status_to_apply, response.data[i].thing.name, language)
              let finalText = auxText + await this.translate.TranslateText(" on " + resprooms.data[j].name, language);
              response.data[i].statusText = finalText
            }
          }
        }
      }
      if (response.data[i].scenario) {
        response.data[i].count = response.data[i].scenario.scenario_things.length;
        for (let x = 0; x < response.data[i].scenario.scenario_things.length; x++) {
          response.data[i].scenario.scenario_things[x].scenario_id = response.data[i].scenario.id
          this.scenarioThings.push(response.data[i].scenario.scenario_things[x])
        }

        let auxText = ""
        let finalText = ""
        let room: any;

        for (let x = 0; x < this.scenarioThings.length; x++) {

          auxText = await this.thingsTranslator.getThingAction(this.scenarioThings[x].status, this.scenarioThings[x].thing.name, language)

          room = await this.getRoomAPI(this.home, this.scenarioThings[x].thing.room.id);

          finalText = auxText + await this.translate.TranslateText(" on " + room.data.name, language);
          let myObject = {statusText: finalText};
          this.ThingsStatus.push(myObject);

        }
        response.data[i].ThingsStatus = this.ThingsStatus;
      }
      response.data[i].display = await this.dateCalculator.TranslateNextRun(response.data[i].next_run, language);
    }
    this.timed_tasks = ArraySorterHelper.sortArrayByID(response.data);
  }

  async loadTriggeredTasks() {
    const response = await this.listTriggeredTasksAPI(this.home);
    let language = await this.storage.get("LANGUAGE");

    for (let i = 0; i < response.data.length; i++) {
      response.data[i].display = await this.generateDisplay(response.data[i])
      this.scenarioThings = [];
      this.ThingsStatus = [];

      if (response.data[i].thing) {

        const resprooms = await this.listRoomsAPI(this.home);
        for (let j = 0; j < resprooms.data.length; j++) {
          const respthings = await this.listThingsAPI(resprooms.data[j]);
          for (let z = 0; z < respthings.data.length; z++) {
            if (response.data[i].thing.id === respthings.data[z].id) {
              response.data[i].room = resprooms.data[j];
              response.data[i].room.name = await this.translate.TranslateText(response.data[i].room.name, language);
              let auxText = await this.thingsTranslator.getThingAction(response.data[i].status_to_apply, response.data[i].thing.name, language);
              let finalText = auxText + await this.translate.TranslateText(" on " + resprooms.data[j].name, language);
              response.data[i].statusText = finalText;
            }
          }
        }
      }
      if (response.data[i].scenario) {
        response.data[i].count = response.data[i].scenario.scenario_things.length;
        for (let x = 0; x < response.data[i].scenario.scenario_things.length; x++) {
          response.data[i].scenario.scenario_things[x].scenario_id = response.data[i].scenario.id;
          this.scenarioThings.push(response.data[i].scenario.scenario_things[x])
        }
      }
      response.data[i].thing_to_compare.room.name = await this.translate.TranslateText(response.data[i].thing_to_compare.room.name, language);
    }

    this.triggered_tasks = ArraySorterHelper.sortArrayByID(response.data);
  }

  newTask() {
    switch (this.tasks_type) {
      case "timed":
        this.navCtrl.push(NewTimedTaskPage, {home: this.home});
        break;
      case "triggered":
        this.navCtrl.push(NewTriggeredTaskPage, {home: this.home});
        break;
    }
  }

  async generateDisplay(triggered_task) {
    let language = await this.storage.get("LANGUAGE");
    if (triggered_task.thing) {
      let thingString = await this.thingsTranslator.getThingAction(triggered_task.status_to_apply, triggered_task.thing.name, language)
      let thingtoCompareString = await this.thingsTranslator.getThingCompareAction(triggered_task.status_to_compare, triggered_task.comparator, language);

      return thingString + ' ' + this.whenLabel + ' ' + triggered_task.thing_to_compare.name + thingtoCompareString.text;
    } else if (triggered_task.scenario) {
      let thingtoCompareString = await this.thingsTranslator.getThingCompareAction(triggered_task.status_to_compare, triggered_task.comparator, language);

      return this.activateLabel + ' ' + triggered_task.scenario.name + ' ' + this.whenLabel + ' ' + triggered_task.thing_to_compare.name + thingtoCompareString.text;
    }
  }
}
