import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {HomewatchApi} from "homewatch-js";
import {NavController, NavParams} from "ionic-angular";
import {Storage} from "@ionic/storage";

import {HomewatchApiService} from "../../../services/homewatch_api";
import {Translate} from "../../../helpers/Translate";

@Component({
  selector: "room-page",
  templateUrl: "new.html"
})

export class NewRoomPage {

  roomForm: FormGroup;
  homewatch: HomewatchApi;

  rooms: any = [{id:1 ,name:"Kitchen", icon:1} ,{id:2 ,name:"Room", icon:2} ,{id:3 ,name:"Bathroom", icon:3} ,{id:4 ,name:"Living Room", icon:4} ,{id:5 ,name:"Dinner Room", icon:5} ,{id:6 ,name:"Garage", icon:6} ,{id:7 ,name:"Garden", icon:7} ]

  home: any;
  isRoom: any = false;
  roomIndex= 0;
  room :any;
  editMode : any;
  loading = true;
  theme = 'default';
  editLabel;
  roomsLabel;
  removeRoomLabel;
  addRoomLabel;
  ownerLabel;


  constructor(public translate: Translate, public navCtrl: NavController,public storage: Storage, public navParams: NavParams, homewatchApi: HomewatchApiService, public formBuilder: FormBuilder) {
    this.homewatch = homewatchApi.getApi();
    this.home = this.navParams.get("home");
    this.roomForm = formBuilder.group({
      id: [""],
      name: ["", Validators.required],
      owner: [""],
      icon: ["", Validators.required]
    });
    this.translateLabels();
  }

  async translateLabels(){
    this.editLabel = await this.storage.get("editLabel");
    this.roomsLabel = await this.storage.get("roomsLabel");
    this.addRoomLabel = await this.storage.get("addRoomLabel");
    this.removeRoomLabel = await this.storage.get("removeRoomLabel");
    this.ownerLabel = await this.storage.get("ownerLabel");
  }

  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    this.loading = true;
    this.home = this.navParams.get("home");


    this.room = this.navParams.get("room");
    if (this.room) {
      this.editMode = true;
      this.roomForm.setValue({
        id: this.room.id,
        name: this.room.name,
        owner: this.room.owner,
        icon: this.room.icon
      });
      this.roomIndex = this.roomForm.value.icon;
    }
    this.loading = false;

    this.translate.translateList(this.rooms, 'name', this.storage);
  }

  async onSubmit(form: FormGroup) {
    if(this.editMode) {
      this.updateRoom(form);
    }else {
      this.createRoom(form);
    }
    this.navCtrl.pop();
  }

  async updateRoom(form){
    await this.homewatch.rooms(this.home).updateRoom(form.value.id, form.value);
  }
  async createRoom(form){
    await this.homewatch.rooms(this.home).createRoom(form.value);
  }

  checkIfRoom(){
    if(this.roomForm.value.icon == 2){
      this.isRoom= true;
    }else{
      this.isRoom= false;
    }
  }

  chooseRoom(room){
    this.roomIndex = room.id;
    this.roomForm.patchValue({ name: room.name });
    this.roomForm.patchValue({ icon: room.icon });
    this.checkIfRoom();
  }

  async deleteRoom(){
    await this.homewatch.rooms(this.home).deleteRoom(this.roomForm.value.id)
    this.navCtrl.last();
  }

  // https://www.npmjs.com/package/image-to-blob
  // https://stackoverflow.com/questions/7650587/using-javascript-to-display-a-blob
}
