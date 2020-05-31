import {ChangeDetectorRef, Component, ElementRef, ViewChild} from "@angular/core";
import {HomewatchApi} from "homewatch-js";
import {LoadingController, NavController, NavParams} from "ionic-angular";

import {ArraySorterHelper} from "../../../helpers/array_sorter";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {NewHomePage} from "../new/new";
import {Storage} from "@ionic/storage";

// import { NewRoomPage } from "../../rooms/new/new";
import {ListRoomPage} from "../../rooms/list/list";
import {NewScenarioPage} from "../../scenarios/new/new";
import {ListTasksPage} from "../../tasks/list/list";
import {ListScenariosPage} from "../../scenarios/list/list";
import {NewRoomPage} from "../../rooms/new/new";

@Component({
  selector: "list-pagee",
  templateUrl: "list.html"
})
export class ListHomesPage {
  homewatch: HomewatchApi;
  user: any;
  homes: Array<any> = [];
  rooms: any = [];
  things: any = [];
  home: any;
  scenarios: Array<any> = [];
  tasks: Array<any> = [];
  condition: any = {};
  type = 'rooms';
  indexHome: any;
  minIndexHome:any;
  maxIndexHome:any;
  failed = false;
  loading = true;
  theme = 'default';
  @ViewChild('uploadedIMG', {read: ElementRef}) private uploadedIMG: ElementRef;

  addressLabel;
  cityLabel;
  addHomeLabel;
  roomsLabel;
  devicesLabel;
  scenariosLabel;
  tasksLabel;
  timedTasksLabel;
  triggeredTasksLabel;
  somethingFailedLabel;
  tryAgainLabel;



  constructor(private changeDetector : ChangeDetectorRef,  public storage: Storage, public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, homewatchApiService: HomewatchApiService) {
    this.homewatch = homewatchApiService.getApi();
    this.translateLabels();
  }

  async translateLabels(){
    this.roomsLabel = await this.storage.get("roomsLabel");
    this.devicesLabel = await this.storage.get("devicesLabel");
    this.scenariosLabel = await this.storage.get("scenariosLabel");
    this.tasksLabel = await this.storage.get("tasksLabel");
    this.addressLabel = await this.storage.get("addressLabel");
    this.addHomeLabel = await this.storage.get("addHomeLabel");
    this.cityLabel = await this.storage.get("cityLabel");
    this.timedTasksLabel = await this.storage.get("timedTasksLabel");
    this.triggeredTasksLabel = await this.storage.get("triggeredTasksLabel");
    this.somethingFailedLabel = await this.storage.get("somethingFailedLabel");
    this.tryAgainLabel = await this.storage.get("tryAgainLabel");

  }

  async listHomesAPI(){
    return await this.homewatch.homes.listHomes();
  }
  async listRoomsAPI(i){
    return await this.homewatch.rooms(this.homes[i]).listRooms();
  }
  async listThingsAPI(resp, j) {
    return await this.homewatch.things(resp.data[j]).listThings();
  }

  async getStatusAPI(respthings, z){
    return await this.homewatch.status(respthings.data[z]).getStatus();
  }
  async listScenariosAPI(i){
    return await this.homewatch.scenarios(this.homes[i]).listScenarios();
  }

  async listTimedTasksAPI(i){
    return await this.homewatch.timedTasks(this.homes[i]).listTimedTasks();
  }

  async listTriggeredTasksAPI(i){
    return await this.homewatch.triggeredTasks(this.homes[i]).listTriggeredTasks();
  }

  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");

    this.rooms = [];
    this.things = [];
    this.scenarios = [];
    this.tasks = [];
    this.loading = true;
    this.failed = false;
    this.home= null;

    try {
      this.user = this.navParams.get("user");
      const response = await this.listHomesAPI();

      this.homes = ArraySorterHelper.sortArrayByID(response.data);

      console.log(this.homes);
      for (let i = 0; i < this.homes.length; i++) {
        this.homes[i].numberRooms = 0;
        this.homes[i].numberScenarios = 0;
        this.homes[i].numberThings = 0;
        this.home = this.homes[i];


        this.indexHome = this.homes[0].id;
        const resp = await this.listRoomsAPI(i);

        console.log(resp.data);
        this.homes[i].numberRooms = resp.data.length;
        for (let j = 0; j < resp.data.length; j++) {
          this.rooms.push(resp.data[j]);
          const respthings = await this.listThingsAPI(resp, j);

          console.log(respthings.data);
          this.homes[i].numberThings += respthings.data.length;

          for (let z = 0; z < respthings.data.length; z++) {

            respthings.data[z].home = this.homes[i].id;
            respthings.data[z].room = resp.data[j];

            if (respthings.data[z].type == 'Things::Light' || respthings.data[z].type == 'Things::Lock') {
              try {
                const respstatus = await this.getStatusAPI(respthings, z);
                respthings.data[z].status = respstatus.data;
              } catch (error) {
                respthings.data[z].status = null
              }
            }
            this.things.push(respthings.data[z]);

          }
        }
        this.failed = false;
        this.loading = false;
        this.changeDetector.detectChanges();
        console.log(this.home);
        this.setHomeSrc(this.home);

        const respscenarios = await this.listScenariosAPI(i);

        for (let l = 0; l < respscenarios.data.length; l++) {
          respscenarios.data[l].home = this.homes[i].id;
          this.scenarios.push(respscenarios.data[l]);
          this.homes[i].numberScenarios = respscenarios.data.length;
        }
        const respstaskstimed = await this.listTimedTasksAPI(i);
        let object = {countTimed:0, countTriggered:0, home:this.homes[i].id}
        for (let k = 0; k < respstaskstimed.data.length; k++) {
          object.countTimed++;
        }

        const respstaskstriggered = await this.listTriggeredTasksAPI(i);
        for (let k = 0; k < respstaskstriggered.data.length; k++) {
          object.countTriggered++;
        }

        this.tasks.push(object);

        this.minIndexHome = this.homes[0].id;
        this.maxIndexHome = this.homes[this.homes.length-1].id;
      }

        this.loading = false;
    } catch (error) {
      this.loading = false;
      this.failed = true;
      console.error(error);
    }
  }

  newHome() {
    this.navCtrl.push(NewHomePage);
  }

  editHome(home: Object) {
    this.navCtrl.push(NewHomePage, {home});
  }


  goToRoom(home: Object) {
    this.navCtrl.push(ListRoomPage, {home});
  }

  listRooms(home: Object) {
    this.navCtrl.push(ListRoomPage, {home});
  }

  listTasks(home: Object) {
    this.navCtrl.push(ListTasksPage, {home});
  }

  newRoom(home: Object) {
    this.navCtrl.push(NewRoomPage, {home});
  }
  newScenario(home: Object) {
    this.navCtrl.push(NewScenarioPage, {home});
  }

  listScenarios(home: Object) {
    this.navCtrl.push(ListScenariosPage, {home});
  }

  chooseType(type) {
    this.type = type;
  }

  setHomeSrc(home){
    this.changeDetector.detectChanges();

    if(!home.image){
      this.uploadedIMG.nativeElement.src= "./assets/Home-icon (2).png";
    }else{
      this.uploadedIMG.nativeElement.src= home.image;
    }
  }

  chooseHome(direction){
    if( direction == 'next'){
      for (let j = 0; j < this.homes.length; j++) {
        if(this.indexHome == this.homes[j].id){
          this.indexHome = this.homes[j+1].id;
          this.home = this.homes[j+1];
          this.setHomeSrc(this.homes[j+1]);

          break;
        }
      }
    }else if(direction == 'previous'){
      for (let j = 1; j < this.homes.length; j++) {
        if(this.indexHome == this.homes[j].id){
          this.indexHome = this.homes[j-1].id;
          this.home = this.homes[j-1];
          this.setHomeSrc(this.homes[j-1]);

          break;
        }
      }
    }
  }
  tryAgain() {
    this.ionViewWillEnter();
  }
}
