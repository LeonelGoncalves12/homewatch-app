import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HomewatchApi} from "homewatch-js";
import {Events, NavController, NavParams, PopoverController} from "ionic-angular";

import {ArraySorterHelper} from "../../../../helpers/array_sorter";
import {ThingsInfoHelper} from "../../../../helpers/things_info";
import {HomewatchApiService} from "../../../../services/homewatch_api";
import {Storage} from "@ionic/storage";
import {Translate} from "../../../../helpers/Translate";

@Component({
  selector: "list-tasks-page",
  templateUrl: "new.html"
})
export class NewTimedTaskPage {
  @ViewChild("thingStatus", {read: ViewContainerRef}) thingStatus: ViewContainerRef;
  toApply = "thing";
  editMode = false;
  timedTaskForm: FormGroup;
  timedTask: any;
  homewatch: HomewatchApi;
  home: any;
  things: any = [];
  assignableThings: Array<any>;
  scenarios: Array<any>;
  thing: any;
  rooms: Array<any>;
  time_type = "minutes";
  theme = 'default';
  minutesArray: any
  hoursArray: any
  daysMonthArray: any
  monthsArray: any
  daysWeekArray: any

  minutes: Array<any> = [];
  hours: Array<any> = [];
  daysMonth: Array<any> = [];
  months: Array<any> = [];
  daysWeek: Array<any> = [];

  intervalMinutes = 0;
  intervalHours= 1;
  intervalDaysMonth= 1;
  intervalMonths= 1;
  intervalDaysWeek ='Sunday';

  startAtMinutes = 0;
  startAtHours = 0;
  startAtDaysMonth = 1;
  startAtMonths = 1;
  startAtDayWeek = 'Sunday';

  indexMinutes = 1;
  indexHours = 1;
  indexDaysMonth = 1;
  indexMonth = 1;
  indexDaysWeek = 1;

  indexThing: any;
  indexScenario: any;

  editLabel;
  createTimedTaskLabel;
  chooseDeviceLabel; //choose a thingM
  chooseScenarioLabel //ch...
  removeTaskLabel;
  deviceLabel;
  scenarioLabel;
  chooseThingLabel;
  whenLabel;
  minutesLabel;
  hoursLabel;
  daysMonthLabel; //Days (Month)
  monthsLabel;
  daysWeekLabel; //Days (Week)
  everyMinuteLabel;
  everyHourLabel;
  everyDayLabel;
  everyMonthLabel;
  everyDaysWeekLabel; //Every Days of Week
  everyLabel;
  startAtLabel; //Start at
  daysLabel;
  noScenariosInstalledLabel;
  noDevicesInstalledLabel;
  saveLabel;

  resultedCron: String;

  constructor(public translate: Translate, public navCtrl: NavController,public storage: Storage,  public navParams: NavParams, homewatchApi: HomewatchApiService, public formBuilder: FormBuilder, public popoverCtrl: PopoverController, public compFactoryResolver: ComponentFactoryResolver, public events: Events) {
    this.homewatch = homewatchApi.getApi();
    this.home = this.navParams.get("home");

    this.timedTaskForm = formBuilder.group({
      id: [""],
      thing_id: [""],
      scenario_id: [""],
      status: [""],
      cron: ["", Validators.required]
    });
    this.minutesArray = Array.from(Array(60).keys());
    this.minutes = Array(60).fill(0).map(() => false);

    this.hoursArray = Array.from(Array(24).keys());
    this.hours = Array(24).fill(0).map(() => false);

    this.daysMonthArray = Array.from({length: 31}, (v, k) => k+1);
    this.daysMonth = Array(31).fill(0).map(() => false);

    this.monthsArray =Array.from({length: 12}, (v, k) => k+1);
    this.months = Array(12).fill(0).map(() => false);

    this.daysWeekArray = this.translate.translateArray(["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], this.storage);
    this.daysWeek = Array(7).fill(0).map(() => false);
    // this.minutes[0]=true;
    this.resultedCron = "* * * * *";
    this.initializeTheme();
    this.translateLabels();
  }

  async translateLabels() {
    this.editLabel = await this.storage.get("editLabel");
    this.createTimedTaskLabel = await this.storage.get("createTimedTaskLabel");
    this.chooseDeviceLabel = await this.storage.get("chooseDeviceLabel");
    this.chooseScenarioLabel = await this.storage.get("chooseScenarioLabel");
    this.removeTaskLabel = await this.storage.get("removeTaskLabel");
    this.deviceLabel = await this.storage.get("deviceLabel");

    this.scenarioLabel = await this.storage.get("scenarioLabel");
    this.chooseThingLabel = await this.storage.get("chooseThingLabel");
    this.whenLabel = await this.storage.get("whenLabel");
    this.minutesLabel = await this.storage.get("minutesLabel");
    this.hoursLabel = await this.storage.get("hoursLabel");
    this.daysMonthLabel = await this.storage.get("daysMonthLabel");
    this.monthsLabel = await this.storage.get("monthsLabel");
    this.daysWeekLabel = await this.storage.get("daysWeekLabel");
    this.everyMinuteLabel = await this.storage.get("everyMinuteLabel");
    this.everyHourLabel = await this.storage.get("everyHourLabel");
    this.everyDayLabel = await this.storage.get("everyDayLabel");
    this.everyMonthLabel = await this.storage.get("everyMonthLabel");

    this.everyDaysWeekLabel = await this.storage.get("everyDaysWeekLabel");
    this.everyLabel = await this.storage.get("everyLabel");
    this.startAtLabel = await this.storage.get("startAtLabel");
    this.daysLabel = await this.storage.get("daysLabel");

    this.noScenariosInstalledLabel = await this.storage.get("noScenariosInstalledLabel");
    this.noDevicesInstalledLabel = await this.storage.get("noDevicesInstalledLabel");

    this.saveLabel = await this.storage.get("saveLabel");

  }


  async initializeTheme() {
    this.theme = await this.storage.get("THEME");
  }

  async loadThingStatus(thing) {
    this.thing = thing;


    this.events.subscribe(`thing:status:update:out${thing.id}`, status => {

      this.onStatusChange(status);
    });
    this.navParams.data.thing = thing;
    this.navParams.data.type = "thing";
    this.thingStatus.clear();
    const compFactory = this.compFactoryResolver.resolveComponentFactory(ThingsInfoHelper.getThingInfo(thing.type).showPage);
    this.thingStatus.createComponent(compFactory);
  }

  async listScenariosAPI(home) {
    return await this.homewatch.scenarios(home).listScenarios();
  }

  async listRoomsAPI(home) {
    return await this.homewatch.rooms(home).listRooms();
  }

  async listThingsAPI(room) {
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
    this.assignableThings = ArraySorterHelper.filterAssignableThings(this.things);
  }

  async loadScenarios() {
    const response = await this.listScenariosAPI(this.home);
    this.scenarios = ArraySorterHelper.sortArrayByID(response.data);
  }

  async ionViewWillEnter() {

    this.timedTask = this.navParams.get("timed_task");

    if (this.timedTask) {
      this.editMode = true;
      this.navParams.data.status = this.timedTask.status_to_apply;
      this.navParams.data.type = 'thing';
      if (this.timedTask.thing) {
        this.toApply = "thing";
        this.timedTaskForm.patchValue({thing_id: this.timedTask.thing.id});
        this.timedTaskForm.patchValue({status: this.timedTask.status_to_apply});
        this.loadThingStatus(this.timedTask.thing);
      } else {
        this.toApply = "scenario";
        this.timedTaskForm.patchValue({scenario_id: this.timedTask.scenario.id});

      }

      this.timedTaskForm.patchValue(this.timedTask);
    }

    this.timedTaskForm.get("thing_id").valueChanges.subscribe(thing_id => {
      const thing = this.things.find(t => t.id === thing_id);
      if (thing) this.loadThingStatus(thing);
    });
    await Promise.all([this.loadThings(), this.loadScenarios()]);
  }

  onStatusChange(status) {

    this.timedTaskForm.patchValue({status});
  }

  onToApplyChange(toApply) {
    if (this.timedTaskForm.controls.scenario_id) this.timedTaskForm.controls.scenario_id.reset();
    if (this.timedTaskForm.controls.thing_id) this.timedTaskForm.controls.thing_id.reset();
    if (this.timedTaskForm.controls.status) this.timedTaskForm.controls.status.reset();

    this.toApply = toApply;
  }

  validForm() {
    return this.timedTaskForm.valid && this.validateDate() &&
      ((this.timedTaskForm.value.thing_id && this.timedTaskForm.value.status) || this.timedTaskForm.value.scenario_id);
  }

  async onSubmit(form: FormGroup) {
    const timed_task = this.buildTimedTask(form);

    if (this.editMode)
      await this.updateTask(this.home, form, timed_task);
    else
      await this.createTask(this.home, timed_task);

    this.navCtrl.pop();
  }

  async updateTask(home, form ,timed_task){
    return  await this.homewatch.timedTasks(home).updateTimedTask(form.value.id, timed_task);
  }

  async createTask(home, timed_task){
    return await this.homewatch.timedTasks(home).createTimedTask(timed_task);
  }

  private buildTimedTask(form: FormGroup) {
    const timed_task = {cron: form.value.cron, status_to_apply: undefined, thing_id: null, scenario_id: null};

    if (this.toApply === "thing") {
      timed_task.thing_id = form.value.thing_id;
      timed_task.status_to_apply = form.value.status;
    } else if (this.toApply === "scenario") {
      timed_task.scenario_id = form.value.scenario_id;
    }

    return timed_task;
  }

  async onTypeChange(type) {
    this.time_type = type;

  }


  chooseIndex(n , type){
    switch(type){
      case 'minute':
        this.intervalMinutes = n;
        break;
      case 'minuteStart':
        this.startAtMinutes = n;
        break;
      case 'hour':
        this.intervalHours = n;
        break;
      case 'hourStart':
        this.startAtHours = n;
        break;
      case 'month':
        this.intervalMonths = n;
        break;
      case 'monthStart':
        this.startAtMonths = n;
        break;
      case 'dayMonth':
        this.intervalDaysMonth = n;
        break;
      case 'dayMonthStart':
        this.startAtDaysMonth = n;
        break;
      case 'dayWeek':
        this.intervalDaysWeek = n;
        break;
      case 'dayWeekStart':
        this.startAtDayWeek = n;
        break;

    }
  }
  active(time, j) {

    let exists = false
    switch (time) {
      case "minutes":
        if (this.minutes) {
          for (let i = 0; i < this.minutes.length; i++) {
            if ((i === j) && (this.minutes[i] === true)) {
              this.minutes[i] = false
              exists = true;
            }
          }
        }

        if (!exists) {

          this.minutes[j] = true;
        }
        this.choose_option("minutes", 3)
        break;


      case "hours":
        if (this.hours) {
          for (let i = 0; i < this.hours.length; i++) {
            if ((i === j) && (this.hours[i] === true)) {
              this.hours[i] = false
              exists = true;
            }
          }
        }

        if (!exists) {

          this.hours[j] = true;
        }
        this.choose_option("hours", 3)
        break;

      case "daysMonth":
        if (this.daysMonth) {
          for (let i = 0; i < this.daysMonth.length; i++) {
            if ((i === j) && (this.daysMonth[i] === true)) {
              this.daysMonth[i] = false
              exists = true;
            }
          }
        }

        if (!exists) {

          this.daysMonth[j] = true;
        }
        this.choose_option("daysMonth", 3)
        break;

      case "months":
        if (this.months) {
          for (let i = 0; i < this.months.length; i++) {
            if ((i === j) && (this.months[i] === true)) {
              this.months[i] = false
              exists = true;
            }
          }
        }

        if (!exists) {

          this.months[j] = true;
        }
        this.choose_option("months", 3)
        break;

      case "daysWeek":
        if (this.daysWeek) {
          for (let i = 0; i < this.daysWeek.length; i++) {
            if ((i === j) && (this.daysWeek[i] === true)) {
              this.daysWeek[i] = false
              exists = true;
            }
          }
        }

        if (!exists) {

          this.daysWeek[j] = true;
        }
        this.choose_option("daysWeek", 3)
        break;
    }
  }

  interval(time, selectTime, type) {

    switch (time) {
      case "minutes":
        if (type == 'intervalMinutes') {
          this.intervalMinutes = selectTime
        }
        if (type == 'startAt') {
          this.startAtMinutes = selectTime
        }
        this.choose_option("minutes", 2)
        break;

      case "hours":
        if (type == 'intervalHours') {
          this.intervalHours = selectTime
        }
        if (type == 'startAt') {
          this.startAtHours = selectTime
        }
        this.choose_option("hours", 2)
        break;

      case "daysMonth":
        if (type == 'intervalDaysMonth') {
          this.intervalDaysMonth = selectTime
        }
        if (type === 'startAt') {
          this.startAtDaysMonth = selectTime
        }
        this.choose_option("daysMonth", 2)
        break;

      case "months":
        if (type == 'intervalMonths') {
          this.intervalMonths = selectTime
        }
        if (type == 'startAt') {
          this.startAtMonths = selectTime
        }
        this.choose_option("months", 2)
        break;

      case "daysWeek":
        if (type == 'intervalDaysWeek') {
          this.intervalDaysWeek = selectTime
        }
        if (type == 'startAt') {
          this.startAtDayWeek = selectTime
        }
        this.choose_option("daysWeek", 2)
        break;
    }
  }

  resultcron(type, value) {
    let ArrayCron = this.resultedCron.split(" ")
    switch (type) {
      case "minutes":
        ArrayCron[0] = value
        break;
      case "hours":
        ArrayCron[1] = value
        break;
      case "daysMonth":
        ArrayCron[2] = value
        break;
      case "months":
        ArrayCron[3] = value
        break;
      case "daysWeek":
        ArrayCron[4] = value
        break;
    }
    let CronFinal = ""
    for (let i = 0; i < ArrayCron.length; i++) {
      if (i === 0) {
        CronFinal = ArrayCron[i];
      }
      else {
        CronFinal = CronFinal + " " + ArrayCron[i];
      }
    }

    this.resultedCron = CronFinal;


    this.timedTaskForm.patchValue({cron: this.resultedCron});
  }

  choose_option(tab, option) {
    let value = "";
    switch (tab) {
      case "minutes":
        this.indexMinutes = option;
        switch (parseInt(option)) {
          case 1:
            value = "*"
            break;
          case 2:
            value = this.startAtMinutes + "/" + this.intervalMinutes
            break;
          case 3:
            let exists = false;
            for (let i = 0; i < this.minutes.length; i++) {
              if (this.minutes[i] == true) {
                if (exists == false) {
                  value = i.toString();
                } else {
                  value = value + "," + i.toString();
                }
                exists = true;
              }
            }
            if (!exists) {
              value = "*"
            }
            break;
        }
        this.resultcron("minutes", value)
        break;

      case "hours":
        this.indexHours = option;
        switch (parseInt(option)) {
          case 1:
            value = "*"
            break;
          case 2:
            value = this.startAtHours + "/" + this.intervalHours
            break;
          case 3:
            let exists = false;
            for (let i = 0; i < this.hours.length; i++) {
              if (this.hours[i] == true) {
                if (exists == false) {
                  value = i.toString();
                } else {
                  value = value + "," + i.toString();
                }
                exists = true;
              }
            }
            if (!exists) {
              value = "*"
            }
            break;
        }
        this.resultcron("hours", value)
        break;

      case "daysMonth":
        this.indexDaysMonth = option;
        switch (parseInt(option)) {
          case 1:
            value = "*"
            break;
          case 2:
            value = this.startAtDaysMonth + "/" + this.intervalDaysMonth
            break;
          case 3:
            let exists = false;
            for (let i = 0; i < this.daysMonth.length; i++) {
              if (this.daysMonth[i] == true) {
                if (exists == false) {
                  value = (i + 1).toString();
                } else {
                  value = value + "," + (i + 1).toString();
                }
                exists = true;
              }
            }
            if (!exists) {
              value = "*"
            }
            break;
        }
        this.resultcron("daysMonth", value)
        break;

      case "months":


        this.indexMonth = option;
        switch (parseInt(option)) {
          case 1:
            value = "*"
            break;
          case 2:
            value = this.startAtMonths + "/" + this.intervalMonths
            break;
          case 3:
            let exists = false;
            for (let i = 0; i < this.months.length; i++) {
              if (this.months[i] == true) {
                if (exists == false) {
                  value = (i + 1).toString();
                } else {
                  value = value + "," + (i + 1).toString();
                }
                exists = true;
              }
            }
            if (!exists) {
              value = "*"
            }
            break;
        }
        this.resultcron("months", value)
        break;

      case "daysWeek":
        this.indexDaysWeek = option;

        switch (parseInt(option)) {
          case 1:
            value = "*"
            break;
          case 2:



            value = this.convertDay(this.startAtDayWeek) + "/" + this.convertDay(this.intervalDaysWeek)
            break;
          case 3:
            let exists = false;
            for (let i = 0; i < this.daysWeek.length; i++) {
              if (this.daysWeek[i] == true) {
                if (exists == false) {
                  value = (i).toString();
                } else {
                  value = value + "," + (i).toString();
                }
                exists = true;
              }
            }
            if (!exists) {
              value = "*"
            }
            break;
        }
        this.resultcron("daysWeek", value)
        break;
    }
  }


  convertDay(day){
    switch (day){
      case 'Sunday':
        return 0;
      case 'Monday':
        return 1;
      case 'Tuesday':
        return 2;
      case 'Wednesday':
        return 3;
      case 'Thursday':
        return 4;
      case 'Friday':
        return 5;
      case 'Saturday':
        return 6;
    }
  }

  validateDate() {
    // 0 2 4 6 7 9 11 - 31 dias
    // 1 - 28 dias
    // 3 5 6 8 10 - 30 dias
    let isValid = true;
    for (let i = 0; i < this.months.length; i++) {
      if (this.months[i] == true) {
        switch (i) {
          case 1:
            for (let j = 27; j < this.daysMonth.length; j++) {
              if (this.daysMonth[j] == true) {
                isValid = false;
                break;
              }
            }
            break;
          case 3:
          case 5:
          case 6:
          case 8:
          case 10:
            if (this.daysMonth[30] == true) {
              isValid = false;
            }
            break;
        }
      }
    }
    return isValid
  }

  activething(thing) {
    this.timedTaskForm.patchValue({thing_id: thing.id});
    this.indexThing = thing.id;
    this.loadThingStatus(thing);

  }

  activescenario(scenario) {
    this.timedTaskForm.patchValue({scenario_id: scenario.id});
    this.indexScenario = scenario.id;
  }

  async deleteTimed(){
    await this.homewatch.timedTasks(this.home).deleteTimedTask(this.timedTask.id);
    this.navCtrl.pop();
  }

}
