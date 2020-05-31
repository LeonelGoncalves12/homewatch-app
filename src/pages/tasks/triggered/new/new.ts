import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from "@angular/core";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HomewatchApi} from "homewatch-js";
import {Events, NavController, NavParams, PopoverController} from "ionic-angular";

import {ArraySorterHelper} from "../../../../helpers/array_sorter";
import {ThingsInfoHelper} from "../../../../helpers/things_info";
import {HomewatchApiService} from "../../../../services/homewatch_api";
import {Storage} from "@ionic/storage";
import {ThingsTranslator} from "../../../../helpers/ThingsTranslator";

@Component({
  selector: "new-page",
  templateUrl: "new.html"
})
export class NewTriggeredTaskPage {
  @ViewChild("thingStatus", {read: ViewContainerRef}) thingStatus: ViewContainerRef;
  @ViewChild("thingCompareStatus", {read: ViewContainerRef}) thingCompareStatus: ViewContainerRef;

  comparators: Array<string> = ["==", "<", ">", ">=", "<="];
  toApply = "thing";
  editMode = false;
  triggeredTaskForm: FormGroup;
  triggeredTask: any;
  homewatch: HomewatchApi;
  home: any;
  things: any = [];
  assignableThings: Array<any>;
  scenarios: Array<any>;
  thing: any;
  scenario: any;
  comparator_thing: any;
  index1: any;
  index2: any;
  index3: any;
  index4: any;
  comparator_options: any = [];
  status: any;
  statusCompare: any;
  action: any;
  checkTemperature: any;
  temperature: any;
  checkWind: any;
  wind: any;
  sensor: any;
  thingIndex = 0;
  scenarioIndex = 0;
  thingCompareIndex = 0;
  statusAction: any;
  statusCompareAction: any;
  operator = '==';
  option: any;
  indexOption = false;
  targetTemperature = false;
  theme = 'default';
  whenLabel;
  activateLabel;
  deviceLabel;
  scenarioLabel;
  deviceToCompareLabel;
  createTriggeredTaskLabel;
  noDevicesInstalledLabel;
  noScenariosInstalledLabel;
  removeTaskLabel;
  editLabel;
  saveLabel

  constructor(public thingsTranslator: ThingsTranslator, public navCtrl: NavController, public storage: Storage, public navParams: NavParams, homewatchApi: HomewatchApiService, public formBuilder: FormBuilder, public popoverCtrl: PopoverController, public compFactoryResolver: ComponentFactoryResolver, public events: Events) {
    this.homewatch = homewatchApi.getApi();
    this.home = this.navParams.get("home");

    this.triggeredTaskForm = formBuilder.group({
      id: [""],
      thing_id: ["", !Validators.required],
      temperature: ["", !Validators.required],
      wind: ["", !Validators.required],
      status_to_apply: [""],
      scenario_id: [""],
      thing_to_compare_id: ["", Validators.required],
      comparator: ["", Validators.required],
      status_to_compare: ["", Validators.compose([Validators.required, this.JSONValidator])],
      display: [""]
    });
    this.initializeTheme();
    this.translateLabels();
  }

  async translateLabels(){
    this.whenLabel = await this.storage.get("whenLabel");
    this.activateLabel = await this.storage.get("activateLabel");
    this.deviceLabel = await this.storage.get("deviceLabel");
    this.scenarioLabel = await this.storage.get("scenarioLabel");
    this.deviceToCompareLabel = await this.storage.get("deviceToCompareLabel");
    this.createTriggeredTaskLabel = await this.storage.get("createTriggeredTaskLabel");
    this.removeTaskLabel = await this.storage.get("removeTaskLabel");
    this.editLabel = await this.storage.get("editLabel");
    this.saveLabel = await this.storage.get("saveLabel");
    this.noDevicesInstalledLabel = await this.storage.get("noDevicesInstalledLabel");
    this.noScenariosInstalledLabel = await this.storage.get("noScenariosInstalledLabel");

  }

  async initializeTheme() {
    this.theme = await this.storage.get("THEME");

  }

  async ionViewWillEnter() {
    this.triggeredTask = this.navParams.get("triggered_task");

    if (this.triggeredTask) {
      this.editMode = true;
      if (this.triggeredTask.thing) {
        this.thing = this.triggeredTask.thing;
        this.triggeredTaskForm.patchValue({thing_id: this.triggeredTask.thing.id});
        this.toApply = "thing";
        this.triggeredTask.thing_id = this.triggeredTask.thing.id;
        this.thingIndex = this.triggeredTask.thing.id;
        this.loadThingStatus(this.triggeredTask.thing, 'thing', this.triggeredTask.status_to_apply);
        this.status = this.triggeredTask.status_to_apply;
        await this.setStatus();
      } else {
        this.scenario = this.triggeredTask.thing;
        this.triggeredTaskForm.patchValue({scenario_id: this.triggeredTask.scenario.id});
        this.toApply = "scenario";
        this.thingIndex = this.triggeredTask.scenario.id;
        this.triggeredTask.scenario_id = this.triggeredTask.scenario.id;
      }
      this.thingCompareIndex = this.triggeredTask.thing_to_compare.id;

      this.comparator_thing = this.triggeredTask.thing_to_compare;
      this.triggeredTaskForm.patchValue({thing_to_compare_id: this.triggeredTask.thing_to_compare.id});


      this.loadThingStatus(this.triggeredTask.thing_to_compare, 'thingCompare', this.triggeredTask.status_to_compare);
      this.triggeredTask.thing_to_compare_id = this.triggeredTask.thing_to_compare.id;
      this.statusCompare = this.triggeredTask.status_to_compare;
      await this.setStatusCompare();
      this.triggeredTaskForm.patchValue(this.triggeredTask);
      this.populateOptions();

    }

    await Promise.all([this.loadThings(), this.loadScenarios()]);

  }

  async loadThingStatus(thing, type, status?) {

    if (type == 'thing') {

      this.thing = thing;

      this.navParams.data.type = type;
      this.navParams.data.thing = thing;
      this.navParams.data.status = status;
      this.navParams.data.statusCompare = null;
      await this.events.subscribe(`thing:status:update:out${thing.id}`, newStatus => {
        this.onStatusToApplyChange(newStatus, 'thing');
      });


      this.thingStatus.clear();
      const compFactory = this.compFactoryResolver.resolveComponentFactory(ThingsInfoHelper.getThingInfo(thing.type).showPage);
      this.thingStatus.createComponent(compFactory);


    } else if (type == 'thingCompare') {
      this.navParams.data.type = type;
      this.navParams.data.thingCompare = thing;
      this.navParams.data.statusCompare = status;
      this.navParams.data.status = null;

      await this.events.subscribe(`thingCompare:statusCompare:update:out${thing.id}`, newStatus => {
        this.onStatusToApplyChange(newStatus, 'thingCompare');
      });

      this.thingCompareStatus.clear();
      const compFactory = this.compFactoryResolver.resolveComponentFactory(ThingsInfoHelper.getThingInfo(thing.type).showPage);
      this.thingCompareStatus.createComponent(compFactory);
    }
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
        respthings.data[z].room = response_rooms.data[j];
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

  async onStatusToApplyChange(status_to_apply, type) {
    if (type == 'thing') {

      this.triggeredTaskForm.patchValue({status_to_apply});
      this.status = status_to_apply;
      await this.setStatus();
    } else if (type == 'thingCompare') {
      this.statusCompare = status_to_apply;

      await this.setStatusCompare();
    }
    if ((this.thing || this.scenario) && this.comparator_thing) {

      this.populateOptions();
    }
  }

  onThingToApplyChange(thing, type) {

    this.loadThingStatus(thing, type);
  }

  onToApplyChange(toApply) {
    if (this.triggeredTaskForm.controls.scenario_id) this.triggeredTaskForm.controls.scenario_id.reset();
    if (this.triggeredTaskForm.controls.thing_id) this.triggeredTaskForm.controls.thing_id.reset();
    if (this.triggeredTaskForm.controls.status) this.triggeredTaskForm.controls.status.reset();
    this.thing = null;
    this.scenario = null;
    // this.comparator_thing = null;
    this.toApply = toApply;
    this.index1 = null;
    this.index4 = null;
  }

  validForm() {
    return this.triggeredTaskForm.valid &&
      ((this.triggeredTaskForm.value.thing_id && this.triggeredTaskForm.value.status_to_apply) || this.triggeredTaskForm.value.scenario_id);
  }

  async onSubmit(form: FormGroup) {
    const triggered_task = this.buildTriggeredTask(form);

    if (this.editMode)
      await this.updateTask(this.home, form, triggered_task);
    else
      await this.createTask(this.home, triggered_task);

    this.navCtrl.pop();
  }

  async updateTask(home, form ,triggered_task){
    return await this.homewatch.triggeredTasks(home).updateTriggeredTask(form.value.id, triggered_task);
  }

  async createTask(home, triggered_task){
    return await this.homewatch.triggeredTasks(home).createTriggeredTask(triggered_task);
  }


  activething(thing, zone) {
    // this.triggeredTaskForm.value.thing_id = thing.id;
    if (zone === 1) {
      this.triggeredTaskForm.patchValue({thing_id: thing.id});
      this.thingIndex = thing.id;
      this.onThingToApplyChange(thing, 'thing');
      if ((this.thing || this.scenario) && this.comparator_thing) {
        this.populateOptions();
      }
    }

    if (zone === 2) {
      this.triggeredTaskForm.patchValue({thing_to_compare_id: thing.id});
      this.thingCompareIndex = thing.id;
      this.temperature = 0;
      this.checkWind = 0;
      this.sensor = null;
      this.targetTemperature = false;
      this.comparator_thing = thing;
      this.onThingToApplyChange(thing, 'thingCompare');
      if ((this.thing || this.scenario) && this.comparator_thing) {
        this.populateOptions();
      }

      switch (thing.type) {
        case 'Things::Thermostat':
          this.checkTemperature = true;
          this.targetTemperature = true;
          break;
        case 'Things::Weather':
          this.checkWind = true;
          break;
        default:
          this.checkTemperature = false;
          this.checkWind = false;
      }
      //this.comparator();

    }
  }


  activescenario(scenario, zone) {

    if (zone === 1) {
      this.triggeredTaskForm.patchValue({scenario_id: scenario.id});
      this.scenarioIndex = scenario.id;
      this.scenario = scenario;
      if ((this.thing || this.scenario) && this.comparator_thing) {
        this.populateOptions();
      }
    }
  }

  choose_option() {

    this.triggeredTaskForm.patchValue({comparator: this.operator});
    const status = JSON.stringify(this.statusCompare);
    this.triggeredTaskForm.patchValue({status_to_compare: status});

    this.triggeredTaskForm.patchValue({display: this.option});
    // this.triggeredTaskForm.patchValue({thing_id: option.comparator});

    this.indexOption = true;
  }


  async setStatus() {

    if (this.thing && this.status) {
      this.indexOption = false;
      let language = await this.storage.get("LANGUAGE");

      await this.thingsTranslator.getThingAction(this.status, this.thing.name, language).then(data => {
        this.statusAction = data
      })

    }
  }

  async setStatusCompare() {
    if (this.comparator_thing && this.statusCompare) {
      this.indexOption = false;

      var output = null;
      let language = await this.storage.get("LANGUAGE");

      await this.thingsTranslator.getThingCompareAction(this.statusCompare, this.operator, language).then(data => {
        output = data
      })
      this.sensor = output.sensor;
      this.statusCompareAction = output.text;
      this.operator = output.operator;
    }
  }

  populateOptions() {
    this.triggeredTaskForm.patchValue({status_to_compare: null});
    this.comparator_options = [];


    if (this.thing) {
      this.option = this.statusAction + ' '+ this.whenLabel + ' ' + this.comparator_thing.name + this.statusCompareAction;
    }
    if (this.scenario) {
      this.option = this.activateLabel + ' ' + this.scenario.name+ ' '+ this.whenLabel + ' ' +this.comparator_thing.name + this.statusCompareAction;
    }

  }

  isValid() {

    if ((this.thing || this.scenario) && this.comparator_thing) {
      return true;
    }
    return false;
  }


  async chooseThing(thing) {
    this.thingIndex = thing.id;
  }

  async chooseScenario(scenario) {
    this.scenarioIndex = scenario.id;
  }

  async chooseThingCompare(thing) {
    this.thingCompareIndex = thing.id;
  }


  private buildTriggeredTask(form: FormGroup) {
    try {
      const status_to_compare = JSON.parse(form.value.status_to_compare);
      const triggered_task = {
        status_to_apply: undefined,
        thing_id: null,
        scenario_id: null,
        thing_to_compare_id: form.value.thing_to_compare_id,
        status_to_compare,
        comparator: form.value.comparator.trim(),
        display: form.value.display
      };
      if (this.toApply == "thing") {
        triggered_task.thing_id = this.thing.id;
        triggered_task.status_to_apply = form.value.status_to_apply;
      } else if (this.toApply == "scenario") {
        triggered_task.scenario_id = form.value.scenario_id;
      }
      return triggered_task;
    } catch (error) {
      console.error(error);
    }
  }

  async setOperator(operator) {
    this.operator = operator;
    await this.setStatusCompare();
    this.populateOptions();
  }

  private JSONValidator = (control: FormControl) => {
    try {
      const json = control.value;
      if (json !== undefined) {
        JSON.parse(json);
      }
    } catch (e) {
      return {json: "invalid"};
    }

    return undefined;
  }

  async deleteTriggered() {
    await this.homewatch.triggeredTasks(this.home).deleteTriggeredTask(this.triggeredTask.id);
    this.navCtrl.pop();
  }

}
