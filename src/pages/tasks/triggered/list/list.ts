import { Component, Input, OnChanges } from "@angular/core";
import { HomewatchApi } from "homewatch-js";
import { LoadingController, NavController, NavParams } from "ionic-angular";

import { HomewatchApiService } from "../../../../services/homewatch_api";
import { NewTriggeredTaskPage } from "../new/new";
import {Storage} from "@ionic/storage";

@Component({
  selector: "list-triggered-tasks-page",
  templateUrl: "list.html"
})
export class ListTriggeredTasksPage implements OnChanges {
  @Input() tasks: Array<any>;
  triggered_tasks: Array<any> = [];
  typeIndex = 'things';

  homewatch: HomewatchApi;
  user: any;
  home: any;
  theme = 'default';
  devicesLabel;
  scenariosLabel;

   constructor(public navCtrl: NavController, public storage: Storage,public navParams: NavParams, public loadingCtrl: LoadingController, homewatchApiService: HomewatchApiService) {
    this.homewatch = homewatchApiService.getApi();
    this.home = this.navParams.get("home");
    this.initializeTheme();
    this.translateLabels();
   }

  async translateLabels(){
    this.devicesLabel = await this.storage.get("devicesLabel");
    this.scenariosLabel = await this.storage.get("scenariosLabel");

  }
  async initializeTheme() {
    this.theme = await this.storage.get("THEME");
    console.error(this.theme )
  }

  ngOnChanges(changes: any): void {
    if (changes.tasks.currentValue) {
      this.triggered_tasks = changes.tasks.currentValue;
    }
  }

  editTriggeredTask(triggered_task: any) {
    this.navCtrl.push(NewTriggeredTaskPage, { home: this.home, triggered_task });
  }

  async deleteTriggeredTask(triggered_task: any, index: number) {
    await this.homewatch.triggeredTasks(this.home).deleteTriggeredTask(triggered_task.id);
    this.triggered_tasks.splice(index, 1);
  }

  // formatDate(date_string: string) {
  //   return new Date(date_string).toLocaleString();
  // }

  chooseType(type) {
    if (type == 'thing') {
      this.typeIndex = 'things';

    } else if (type == 'scenario') {
      this.typeIndex = 'scenarios';
    }
  }
}
