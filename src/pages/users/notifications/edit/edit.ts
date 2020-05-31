import {Component, ComponentFactoryResolver} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {HomewatchApi} from "homewatch-js";
import {Events, NavController, NavParams, PopoverController} from "ionic-angular";
import {Storage} from "@ionic/storage";

import {HomewatchApiService} from "../../../../services/homewatch_api";

@Component({
  selector: "notifications-page",
  templateUrl: "edit.html"
})
export class EditNotificationsPage {
  editMode = false;
  homewatch: HomewatchApi;
  loading = true;
  failed = false;
  notifications: any;
  timedValue = 0;
  timedInitialValue = 0;
  triggeredValue = 0;
  triggeredInitialValue =0;
  settingID;
  user;
  teste = 1;
  theme = 'default';
  notificationsLabel;
  timedTasksLabel;
  triggeredTasksLabel;
  somethingFailedLabel;

  constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams, homewatchApi: HomewatchApiService, public formBuilder: FormBuilder, public popoverCtrl: PopoverController, public compFactoryResolver: ComponentFactoryResolver, public events: Events) {
    this.homewatch = homewatchApi.getApi();
    this.user = this.navParams.get("user");

    this.translateLabels();
  }

  async translateLabels() {
    this.notificationsLabel = await this.storage.get("notificationsLabel");
    this.timedTasksLabel = await this.storage.get("timedTasksLabel");
    this.triggeredTasksLabel = await this.storage.get("triggeredTasksLabel");
    this.somethingFailedLabel = await this.storage.get("somethingFailedLabel");
  }

  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    this.loading = true;
    this.failed = false;
    try {

      const response = await this.listSettings();
      if (response.data) {
        this.timedValue = response.data[0].timed_tasks_not;
        this.timedInitialValue = response.data[0].timed_tasks_not;
        this.triggeredValue = response.data[0].triggered_tasks_not;
        this.triggeredInitialValue = response.data[0].triggered_tasks_not;
        this.settingID = response.data[0].id;
      }

      this.loading = false;
    }
    catch (error) {
      this.loading = false;
      this.failed = true;
      alert("Something went wrong!");
    }
  }

  async listSettings(){
    return await this.homewatch.settings.listSettings();
  }

  async switchTimed() {
    this.timedValue = this.timedValue == 1 ?  this.timedValue = 0 :  this.timedValue = 1;
    await this.homewatch.settings.updateSetting(this.settingID,{id:this.settingID, user_id: this.user.id, timed_tasks_not: this.timedValue , triggered_tasks_not: this.triggeredValue })
    console.error(this.timedValue)
  }

  async switchTriggered() {
    this.triggeredValue = this.triggeredValue == 1 ?  this.triggeredValue = 0 :  this.triggeredValue = 1;
    await this.homewatch.settings.updateSetting(this.settingID,{id:this.settingID, user_id: this.user.id, timed_tasks_not: this.timedValue , triggered_tasks_not: this.triggeredValue })
    console.error(this.triggeredValue)

  }


}
