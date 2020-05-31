import { Component } from "@angular/core";
import { HomewatchApi } from "homewatch-js";
import { LoadingController, NavController, NavParams } from "ionic-angular";

import { ArraySorterHelper } from "../../../helpers/array_sorter";
import { HomewatchApiService } from "../../../services/homewatch_api";
import {Storage} from "@ionic/storage";

@Component({
  selector: "list-page",
  templateUrl: "list.html"
})
export class ListStatisticsRoomsHomes {
  homewatch: HomewatchApi;
  user: any;
  // loading = true;
  homes: Array<any> = [];
  things: Array<any> = [];
  rooms: any = [];
  statistics: any = [];
  loading = true;
  theme = 'default';
  FavoriteRoom: any;
  FavoriteHome: any;
  thingRooms: Array<any> = [];
  type = 'homes';
  CountHomes = 0;
  CountRooms = 0;
  typeActive = 'homes';

  homesLabel;
  roomsLabel;
  numberOfLabel;
  favoriteHomeLabel;
  favoriteRoomLabel

  constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams, public loadingCtrl: LoadingController, homewatchApiService: HomewatchApiService) {
    this.homewatch = homewatchApiService.getApi();
    this.translateLabels();
  }

  async translateLabels() {
    this.homesLabel = await this.storage.get("homesLabel");
    this.roomsLabel = await this.storage.get("roomsLabel");
    this.numberOfLabel = await this.storage.get("numberOfLabel");
    this.favoriteHomeLabel = await this.storage.get("favoriteHomeLabel");
    this.favoriteRoomLabel = await this.storage.get("favoriteRoomLabel");
  }

  async listHomesAPI(){
    return await this.homewatch.homes.listHomes();
  }

  async listRoomsAPI(home) {
    return await this.homewatch.rooms(home).listRooms();
  }

  async listThingsAPI(room) {
    return await this.homewatch.things(room).listThings();
  }

  async listStatisticsAPI() {
    return await this.homewatch.statistics.listStatistics();
  }


  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    this.rooms = [];
    this.statistics = [];
    this.loading = true;
    try {
      this.user = this.navParams.get("user");

      //number of homes
      const response = await this.listHomesAPI();
      this.homes = ArraySorterHelper.sortArrayByID(response.data);

      this.CountHomes = this.homes.length;

      console.error("nº homes:" + this.CountHomes);

      //number of rooms
      for (let i = 0; i < this.CountHomes; i++) {
        const resp = await this.listRoomsAPI(this.homes[i]);

        for (let j = 0; j < resp.data.length; j++) {
          this.rooms.push(resp.data[j])
        }
      }

      for (let j = 0; j < this.rooms.length; j++) {
        const respsthings = await this.listThingsAPI(this.rooms[j]);

        for (let i = 0; i < respsthings.data.length; i++) {
          this.things.push(respsthings.data[i])
        }
      }

      this.CountRooms = this.rooms.length;
      const respstatistics = await this.listStatisticsAPI();
      this.statistics = respstatistics.data;


      for (let j = 0; j < this.statistics.length; j++) {
        if (this.statistics[j].thingID) {

          for (let l = 0; l < this.things.length; l++) {
            if (this.statistics[j].thingID == this.things[l].id) {

              this.thingRooms.push(this.things[l].room)
            }
          }
        }
      }

      let sortedRooms = this.thingRooms.sort(function (a, b) {
        return b.id - a.id
      });

      let RoomsCount = [];
      let countRoom = 1;

      for (let z = 0; z < sortedRooms.length; z = z + countRoom) {
        countRoom = 1;
        for (let j = z + 1; j < sortedRooms.length; j++) {
          if (sortedRooms[z].id === sortedRooms[j].id)
            countRoom++;
        }
        let aux = { room: sortedRooms[z].id, count: countRoom };
        RoomsCount.push(aux)
      }

      //favorite room

      for (let j = 0; j < this.rooms.length; j++) {
        if(RoomsCount[0].room == this.rooms[j].id){
          this.FavoriteRoom = this.rooms[j].name;
          this.FavoriteHome = this.rooms[j].home.name;
        }
      }
      this.loading = false;
    } catch (error) {
      console.error("erro");
    }
  }
  onTypeChange(type) {
    this.type = type;
    this.typeActive = type;
  }
}
