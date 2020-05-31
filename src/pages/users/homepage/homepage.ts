import {ChangeDetectorRef, Component, ElementRef, ViewChild} from "@angular/core";
import {HomewatchApi} from "homewatch-js";

import { NavController} from "ionic-angular";
import {NavParams, Slides} from "ionic-angular";
import {Storage} from "@ionic/storage";
// import { ArraySorterHelper } from "../../../helpers/array_sorter";
import {HomewatchApiService} from "../../../services/homewatch_api";
// import { NewHomePage } from "../new/new";
// import { HomeTabsPage } from "../tabs/tabs";
import {ListHomesPage} from "../../homes/list/list";
import {NewRoomPage} from "../../rooms/new/new";
import {NewHomePage} from "../../homes/new/new";
import {apiWeather} from "../../../services/apiWeather"
import {EditProfilePage} from "../../users/sign-up/edit";
import {ListStatisticsThings} from "../../statistics/thing_stats/list";
import {ListStatisticsRoomsHomes} from "../../statistics/rooms_stats/list";
import {ListStatisticsTasks} from "../../statistics/tasks_stats/list";
import {ListStatisticsScenarios} from "../../statistics/scenarios_stats/list";
import {ArraySorterHelper} from "../../../helpers/array_sorter";
import {ListRoomPage} from "../../rooms/list/list";
import {ListScenariosPage} from "../../scenarios/list/list";
import {ListTasksPage} from "../../tasks/list/list";
import {EditNotificationsPage} from "../notifications/edit/edit";
import {EditPreferencesPage} from "../preferences/edit/edit";
import {LoginPage} from "../login/login";

//import {HttpClient} from '@angular/common/http';


@Component({
  selector: "homepage",
  templateUrl: "homepage.html",
  providers: [apiWeather]
})


export class Homepage {

  @ViewChild('slider') slider: Slides;

  homewatch: HomewatchApi;
  user: any;
  loading = true;
  id:any;
  wind: any;
  humidity: any;
  sunrise: any;
  sunset: any;
  description: any;
  icon: any;
  city: any;
  WeatherID: any;
  update: any;
  temperature: any;
  displaySunrise: any;
  displaySunset: any;
  data: any = {};
  homes: Array<any> = [];
  home: any;
  failed = false;
  theme = 'default';

  homesLabel;
  roomsLabel;
  devicesLabel;
  scenariosLabel;
  tasksLabel;
  weatherLabel;
  statisticsLabel;
  settingsLabel;
  profileLabel;
  notificationsLabel;
  preferencesLabel;
  helpLabel;
  tryAgainLabel;
  somethingFailedLabel;

  @ViewChild('uploadedIMG', {read: ElementRef}) private uploadedIMG: ElementRef;

  constructor(private changeDetector : ChangeDetectorRef, public storage: Storage, public apiWeather: apiWeather, public navCtrl: NavController, public navParams: NavParams, homewatchApiService: HomewatchApiService) {
    this.homewatch = homewatchApiService.getApi();

    this.translateLabels();
  }

  async translateLabels(){
    this.roomsLabel = await this.storage.get("roomsLabel");
    this.devicesLabel = await this.storage.get("devicesLabel");
    this.scenariosLabel = await this.storage.get("scenariosLabel");
    this.tasksLabel = await this.storage.get("tasksLabel");
    this.homesLabel = await this.storage.get("homesLabel");
    this.weatherLabel = await this.storage.get("weatherLabel");
    this.statisticsLabel = await this.storage.get("statisticsLabel");
    this.settingsLabel = await this.storage.get("settingsLabel");
    this.profileLabel = await this.storage.get("profileLabel");
    this.notificationsLabel = await this.storage.get("notificationsLabel");
    this.preferencesLabel = await this.storage.get("preferencesLabel");
    this.helpLabel = await this.storage.get("helpLabel");
    this.tryAgainLabel = await this.storage.get("tryAgainLabel");
    this.somethingFailedLabel = await this.storage.get("somethingFailedLabel");
  }

  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    this.loading = true;
    this.failed = false;


    try {
      this.user = this.navParams.get("user");
      // this.WeatherData(true)
      this.getWeather();

      const response = await this.getHomes();
      //console.error(response.data)
      this.homes = ArraySorterHelper.sortArrayByID(response.data);

      if (this.homes.length> 0 ) {
        this.home = this.homes[0];
        this.loading = false;
        this.failed = false;

        this.changeDetector.detectChanges();

        if(!this.home.image){
          this.uploadedIMG.nativeElement.src = "./assets/Home-icon (2).png";
        }else{
          this.uploadedIMG.nativeElement.src= this.home.image;
        }
      }

      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.failed = true;
      console.error("erro")
    }
  }

  async getHomes(){
    return await this.homewatch.homes.listHomes();
  }


  listHomes(user: Object) {
    this.navCtrl.push(ListHomesPage, {user});
  }

  goToRoom(home: Object) {
    this.navCtrl.push(NewRoomPage, {home});
  }

  newHome() {
    this.navCtrl.push(NewHomePage);
  }

  listStatisticsThings(user: Object) {
    this.navCtrl.push(ListStatisticsThings, {user});
  }

  listStatisticsRoomsHomes(user: Object) {
    this.navCtrl.push(ListStatisticsRoomsHomes, {user});
  }

  listStatisticsScenarios(user: Object) {
    this.navCtrl.push(ListStatisticsScenarios, {user});
  }

  listStatisticsTasks(user: Object) {
    this.navCtrl.push(ListStatisticsTasks, {user})
    ;
  }

  editUser(user: Object) {
    this.navCtrl.push(EditProfilePage, {user});
  }

  async getWeatherAPI(city) {
    let weather;
    await this.apiWeather.getWeather(city).then(data => {
      weather=data;
    });

    return weather;
  }



  setDisplayDates() {

    this.displaySunrise = new Date(this.sunrise).getHours() + ":" + new Date(this.sunrise).getMinutes();

    this.displaySunset = new Date(this.sunset).getHours() + ":" + new Date(this.sunset).getMinutes();

  }

  async getConditions() {
    return this.homewatch.conditions.listConditions();
  }

  getTime(weather){
    let newDate = new Date().getTime();
      return Math.abs(newDate - (new Date(weather.updated_at).getTime()));
  }

  async getWeather() {

    let notExists = false
    let total = null;
    const response = await this.getConditions();
    let weather;

    if (response.data.length == 0) {
      notExists = true;
    } else {
      weather = response.data[0];
      this.WeatherID = weather.id;
      this.update = weather.updated_at;

      total = this.getTime(weather);

      //60.000 milisegundos = 1 min - 600.000 = 10min
    }

    if (!notExists) {
      if (total > 600000) {
        this.WeatherData(notExists)
      } else {
        this.city = weather.city;
        this.temperature = weather.temperature;
        this.wind = weather.wind;
        this.humidity = weather.humidity;
        this.sunrise = weather.sunrise;
        this.sunset = weather.sunset;
        this.description = weather.description;
        this.icon = weather.icon;
        this.setDisplayDates();
      }

    } else {
      this.WeatherData(notExists)
    }
  }

  async WeatherData(notExists) {
    this.city = this.user.city
    this.data = await this.getWeatherAPI(this.city);
    this.temperature = (this.data.main.temp).toFixed(0);
    this.wind = (this.data.wind.speed * 3, 6).toFixed(0)
    this.humidity = (this.data.main.humidity).toFixed(0)
    this.sunrise = new Date(this.data.sys.sunrise * 1000)
    this.sunset = new Date(this.data.sys.sunset * 1000);
    this.description = this.data.weather[0].description;
    this.icon = this.data.weather[0].icon
    //get img
    this.SetWeather(notExists);
  }

  async SetWeather(notExists) {
    let weather: any = {}
    //weather.id = this.WeatherID;

    weather.city = this.city;
    weather.temperature = this.temperature;
    weather.wind = this.wind;
    weather.humidity = this.humidity;
    weather.sunrise = this.sunrise;
    weather.sunset = this.sunset;
    weather.description = this.description;
    //	weather.user_id = this.user.id;
    weather.icon = this.icon;
    //weather.updated_at = this.update;
    this.setDisplayDates();

    if (notExists) {
      console.error("Creating weather")
      this.createWeather(weather);
    } else {
      //weather.updated_at = this.update;
      console.log("Updating weather")
      this.updateWeather(weather);
    }
  }



  async updateWeather(weather){
    await this.homewatch.conditions.updateCondition(this.WeatherID, weather);
  }

  async createWeather(weather){
    await this.homewatch.conditions.createCondition(weather);
  }

  tryAgain() {
    this.ionViewWillEnter();
  }

  goToRooms() {
    let home = this.home;
    this.navCtrl.push(ListRoomPage, {home});
  }

  goToScenarios() {
    let home = this.home;
    this.navCtrl.push(ListScenariosPage, {home});
  }

  goToTasks() {
    let home = this.home;
    this.navCtrl.push(ListTasksPage, {home});
  }


  goToNotifictions(user) {
    this.navCtrl.push(EditNotificationsPage, {user});
  }

  goToPreferences(user) {
    this.navCtrl.push(EditPreferencesPage, {user});
  }


  async logout()
  {
    await this.storage.remove("HOMEWATCH_USER");
    this.navCtrl.setRoot(LoginPage);
  }
}
