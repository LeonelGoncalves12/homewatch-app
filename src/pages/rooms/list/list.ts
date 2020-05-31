import {Component, ComponentFactoryResolver, ViewChild, ViewContainerRef} from '@angular/core';
import {Events, NavController, NavParams, PopoverController, ToastController} from 'ionic-angular';
import {NewRoomPage} from "../new/new";
import {ArraySorterHelper} from "../../../helpers/array_sorter";
import {HomewatchApi} from "homewatch-js";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {EditThingPage} from "../../things/edit/edit";
import {NewThingPage} from "../../things/new/new";
import {Storage} from "@ionic/storage";
import {Translate} from "../../../helpers/Translate";

/**
 * Generated class for the ListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'room-page',
  templateUrl: 'list.html'
})

export class ListRoomPage {
  @ViewChild("thingStatus", {read: ViewContainerRef}) thingStatus: ViewContainerRef;
  homewatch: HomewatchApi;
  user: any;
  rooms: Array<any> = [];
  home: any;
  thing: any;
  status: any;
  interval: NodeJS.Timer;
  roomThings: any = [];
  room: any;
  roomIndex: any;
  indexThing: any;
  loading = true;
  loadingThings = false;
  failed = false;
  theme = 'default';
  roomsLabel;
  roomDevicesLabel;
  addRoomLabel;
  addDeviceLabel;

  constructor(public translate: Translate, public navCtrl: NavController, public storage: Storage, public navParams: NavParams, homewatchApiService: HomewatchApiService, public popoverCtrl: PopoverController, public events: Events, public compFactoryResolver: ComponentFactoryResolver, public toastCtrl: ToastController) {
    this.homewatch = homewatchApiService.getApi();
    this.home = this.navParams.get("home");
    this.translateLabels();
  }

  async translateLabels(){
    this.roomsLabel = await this.storage.get("roomsLabel");
    this.roomDevicesLabel = await this.storage.get("roomDevicesLabel");

    this.addRoomLabel = await this.storage.get("addRoomLabel");
    this.addDeviceLabel = await this.storage.get("addDeviceLabel");
  }

  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    this.failed = false;
    this.loading = true;
    this.roomThings = [];
    try {
      this.user = this.navParams.get("user");
      const response = await this.listRoomsAPI();
      this.rooms = ArraySorterHelper.sortArrayByID(response.data);
      if (this.rooms.length > 0) {
        this.room = this.rooms[0];
        this.roomIndex = this.rooms[0].id;
        const resp = await this.listThingsAPI(this.rooms[0]);
        if (resp.data.length > 0) {
          for (let j = 0; j < resp.data.length; j++) {
            if (resp.data[j].type == 'Things::Light' || resp.data[j].type == 'Things::Lock' || resp.data[j].type == 'Things::MotionSensor') {
              try {
                const respstatus = await this.getStatusAPI(resp, j);
                resp.data[j].status = respstatus.data;
              } catch (error) {
                resp.data[j].status = null;
                console.error("Status não obtido")
              }
            }
            this.roomThings.push(resp.data[j]);
          }
          this.indexThing = this.roomThings[0].id;
        }
      }
      this.translate.translateList(this.rooms, 'name', this.storage);
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.failed = true;
      console.error(error);
    }
  }

  async listRoomsAPI(){
    return await this.homewatch.rooms(this.home).listRooms();
  }
  async listThingsAPI(room) {
    return await this.homewatch.things(room).listThings();
  }
  async getStatusAPI(resp, j){
    return await this.homewatch.status(resp.data[j]).getStatus();
  }
  newRoom(home: Object) {
    this.navCtrl.push(NewRoomPage, {home});
  }

  editRoom(home: Object, room: Object) {
    this.navCtrl.push(NewRoomPage, {home, room});
  }

  newDevice(room: Object) {
    this.navCtrl.push(NewThingPage, {room});
  }


  editDevice(thing: Object, room: Object) {
    this.navCtrl.push(EditThingPage, {thing, room});
  }


  async chooseRoom(room) {
    this.loadingThings = true;
    this.roomThings = [];
    this.room = room;
    this.roomIndex = room.id;
    const resp = await this.listThingsAPI(room);
    for (let j = 0; j < resp.data.length; j++) {

      try {
        const respstatus = await this.getStatusAPI(resp, j);
        resp.data[j].status = respstatus.data;
      } catch (error) {
        resp.data[j].status = null;
        console.error("Status não obtido")
      }
      this.roomThings.push(resp.data[j]);

    }


    this.loadingThings = false;
  }

  tryAgain() {
    this.ionViewWillEnter();
  }

}
