import { Component, Input, OnChanges,ViewChild } from "@angular/core";
import { HomewatchApi } from "homewatch-js";
import { LoadingController, NavController, NavParams,Slides } from "ionic-angular";

import { HomewatchApiService } from "../../../../services/homewatch_api";
import { NewTimedTaskPage } from "../new/new";
import {Storage} from "@ionic/storage";


@ Component({
  selector: "list-timed-tasks-page",
  templateUrl: "list.html"
})
export class ListTimedTasksPage implements OnChanges {
  @ViewChild('slider') slider: Slides;
  @Input() tasks: Array<any> ;
  timed_tasks: Array<any> = [];
  ThingsStatus: Array<any> = [];
  homewatch: HomewatchApi;
  user: any;
  home: any;
  typeIndex = 'things';
  theme = 'default';
  devicesLabel;
  scenariosLabel;
  devicesTasksLabel;


   constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams, public loadingCtrl: LoadingController, homewatchApiService: HomewatchApiService) {
    this.homewatch = homewatchApiService.getApi();
    this.home = this.navParams.get("home");
     this.initializeTheme();
     this.translateLabels();
   }

  async translateLabels(){
    this.devicesLabel = await this.storage.get("devicesLabel");
    this.scenariosLabel = await this.storage.get("scenariosLabel");
    this.devicesTasksLabel = await this.storage.get("devicesTasksLabel");
  }

  async initializeTheme() {
    this.theme = await this.storage.get("THEME");
    console.error(this.theme )
  }


  ngOnChanges(changes: any): void {

    if (changes.tasks.currentValue  ) {
      this.timed_tasks = changes.tasks.currentValue;
    }
  }

  async deleteTimedTask(timed_task: any, index: number) {
    await this.homewatch.timedTasks(this.home).deleteTimedTask(timed_task.id);
    this.timed_tasks.splice(index, 1);
  }

  editTimedTask(timed_task: any) {
    this.navCtrl.push(NewTimedTaskPage, { home: this.home, timed_task });
  }
  //
  // formatDate(date_string: string) {
  //   return new Date(date_string).toLocaleString();
  // }

  @ViewChild(Slides) slides: Slides;
  slidePrev() {
    this.slides.slidePrev();
  }
  slideNext() {
    this.slides.slideNext();
  }

  chooseType(type){
    if(type == 'thing'){
      this.typeIndex = 'things';

    }else if (type == 'scenario'){
      this.typeIndex = 'scenarios';
    }
  }
}









