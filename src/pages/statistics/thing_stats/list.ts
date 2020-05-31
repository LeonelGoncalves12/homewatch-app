import { Component } from "@angular/core";
import { HomewatchApi } from "homewatch-js";
import { LoadingController, NavController, NavParams } from "ionic-angular";

import { ArraySorterHelper } from "../../../helpers/array_sorter";
import { HomewatchApiService } from "../../../services/homewatch_api";
import {DateCalculator} from "../../../helpers/NextRunDisplay";
import {Storage} from "@ionic/storage";
import {ThingsInfoHelper} from "../../../helpers/things_info";
import {Translate} from "../../../helpers/Translate";
// import { NewRoomPage } from "../../rooms/new/new";


@Component({
  selector: "list-page",
  templateUrl: "list.html"
})
export class ListStatisticsThings {
  homewatch: HomewatchApi;
  user: any;
  loading = true;
  homes: Array<any> = [];
  rooms: any = [];
  statistics: any = [];
  things: any = [];
  home: any;
  scenarios: Array<any> = [];
  tasks: Array<any> = [];
  condition: any = {};
  lights: any = [];
  lightsHours: any = [];
  locks: any = [];
  thermostats: any = [];
  typeActive: any;
  types: any = [];
  theme = 'default';

  usageLabel;
  consumeLabel;
  hourLabel;
  timesLockedLabel;
  averageTemperatureLabel;
  devicesLabel;

  public lineChartData: Array<any> = [
    { data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Usage' }
  ];


  public lineChartLabels: Array<any> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  public lineChartOptions: any = {
    responsive: true,
    title: {
      display: false,
      text: 'Things'
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          beginAtZero: true,
          stepSize: 1,
          fontColor: "white",
        }
      }],
      yAxes: [{
        gridLines: {
          display: false
        },
        ticks: {
          fontColor: "white",
          display: false,
          beginAtZero: true,
          userCallback: function (label) {
            if (Math.floor(label) === label) {
              return label;
            }

          },
        }
      }],
    }
  };
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend: boolean = true;
  public lineChartType: string = 'line';

  constructor(public translate : Translate, public dateCalculator: DateCalculator, public navCtrl: NavController,public storage: Storage,  public navParams: NavParams, public loadingCtrl: LoadingController, homewatchApiService: HomewatchApiService) {
    this.homewatch = homewatchApiService.getApi();
    this.translateLabels();
  }

  async translateLabels() {
    this.usageLabel = await this.storage.get("usageLabel");
    this.consumeLabel = await this.storage.get("consumeLabel");
    this.hourLabel = await this.storage.get("hourLabel");
    this.timesLockedLabel = await this.storage.get("timesLockedLabel");
    this.averageTemperatureLabel = await this.storage.get("averageTemperatureLabel");
    this.devicesLabel = await this.storage.get("devicesLabel");

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
    let language = await this.storage.get("LANGUAGE");
    this.rooms = [];
    this.things = [];
    this.scenarios = [];
    this.tasks = [];
    this.statistics = [];
    this.loading = true;

    this.user = this.navParams.get("user");

    const response = await this.listHomesAPI();
    this.homes = ArraySorterHelper.sortArrayByID(response.data);

    const respstatistics = await this.listStatisticsAPI();
    this.statistics = respstatistics.data;

    for (let i = 0; i < this.homes.length; i++) {
      const resp = await this.listRoomsAPI(this.homes[i]);
      for (let j = 0; j < resp.data.length; j++) {
        this.rooms.push(resp.data[j]);

        const respthings = await this.listThingsAPI(resp.data[j]);
        for (let z = 0; z < respthings.data.length; z++) {
          respthings.data[z].home = this.homes[i].id;
          respthings.data[z].room = resp.data[j];
          respthings.data[z].room.name = await this.translate.TranslateText(respthings.data[z].room.name, language );
          this.things.push(respthings.data[z]);
        }
      }
    }

    for (let i = 0; i < this.things.length; i++) {

      let auxStats = [];

      for (let j = 0; j < this.statistics.length; j++) {
        if (this.statistics[j].thingID == this.things[i].id) {
          auxStats.push(this.statistics[j])
        }
      }
      auxStats = ArraySorterHelper.sortArrayByID(auxStats);

      switch (this.things[i].type) {
        case 'Things::Light':

          let isOn = false;
          let initialTime: any;
          let finalTime: any;
          let total = 0;

          for (let z = 0; z < auxStats.length; z++) {
            if (auxStats[z].status) {
              const keys = Object.keys(auxStats[z].status);
              const aux = keys[0];
              if (auxStats[z].status[aux] == true && (z < auxStats.length - 1)) {
                if (!isOn) {
                  initialTime = new Date(auxStats[z].created_at)
                  isOn = true
                }
              } else if ((auxStats[z].status[aux] == false) || (auxStats[z].status[aux] == true && z == auxStats.length - 1)) {
                if (isOn) {
                  finalTime = new Date(auxStats[z].created_at)
                  let aux = { thing: this.things[i].id, initial: initialTime, final: finalTime };
                  this.lightsHours.push(aux);

                  total = total + (Math.abs(finalTime.getTime() - initialTime.getTime()) )
                  initialTime = null
                  finalTime = null
                  isOn = false
                }
              }
            }


          }

          const kWatts = 0.06
          const priceKhW = 0.16

          let totalkWatts = ((total / 3600000) * kWatts)
          let totalPrice = totalkWatts * priceKhW
          const humanizeDuration = require('humanize-duration')

          this.things[i].time = humanizeDuration(Math.round(total) , {units:['d','h','m'], round:true})

          this.things[i].totalWatts = Math.round(totalkWatts*1000)/1000 + " khW"
          this.things[i].totalPrice = Math.round(totalPrice*1000)/1000  + " €/khW"
          this.lights.push(this.things[i])

          if (this.lights[0]) {
            this.populateGraph(this.lights[0]);
          }
          break;

        case 'Things::Lock':
          let counter = 0;
          let isLocked = false;
          for (let z = 0; z < auxStats.length; z++) {
            if (auxStats[z].status) {
              const keys = Object.keys(auxStats[z].status);
              const aux = keys[0];
              if (auxStats[z].status[aux] == true && (z < auxStats.length - 1)) {
                if (!isLocked) {
                  counter = counter + 1;
                  isLocked = true
                }
              } else if ((auxStats[z].status[aux] == false) || (auxStats[z].status[aux] == true && z == auxStats.length - 1)) {
                if (isLocked) {
                  isLocked = false
                }
              }
            }

          }

          this.things[i].counter = counter;

          this.locks.push(this.things[i])
          break;

        case 'Things::Thermostat':
          let temperature = null;
          let counterThermostat = 0;

          for (let z = 0; z < auxStats.length; z++) {
            if (auxStats[z].status) {
              const keys = Object.keys(auxStats[z].status);
              const aux = keys[0];
              if (!isNaN(auxStats[z].status[aux])) {
                counterThermostat += 1;
                temperature = temperature + parseInt(auxStats[z].status[aux])
              }
            }
          }

          temperature = temperature / counterThermostat
          this.things[i].temperatureAVG = temperature.toFixed(2);

          this.thermostats.push(this.things[i])
          break;
      }

      this.things[i].type = this.setType(this.things[i].type)
    }


    this.existingTypes();
    this.translate.translateList(this.types, 'text', this.storage);
    this.loading = false;

  }


  //auxStats tem todas s stats relativas a uma lampada
  buildDataForGraph(auxStats, thing) {

    let Hours = [];
    for (let s = 0; s < auxStats.length; s++) {


      if (auxStats[s].thing == thing.id) {

        // console.error(new Date(auxStats[s].initial))
        // console.error(new Date(auxStats[s].final))
        // console.error("---")
        let rangeHours = this.dateCalculator.calculateHourRange(new Date(auxStats[s].initial), new Date(auxStats[s].final))
        // console.error(rangeHours)
        for (let value of rangeHours)
        {
          Hours.push(value)
        }
      }
    }
    let sortedHours = Hours.sort(function (a, b) {
      return b - a
    });


    let HoursCount = [];
    let count = 1;
    for (var z = 0; z < sortedHours.length; z = z + count) {
      count = 1;
      for (var j = z + 1; j < sortedHours.length; j++) {
        if (sortedHours[z] === sortedHours[j])
          count++;
      }
      let aux = { hour: sortedHours[z], count: count };
      HoursCount.push(aux)
    }

    var HoursValuesGraph = Array(24).fill(0);

    for (let s = 0; s < HoursCount.length; s++) {
      HoursValuesGraph[HoursCount[s].hour] = HoursCount[s].count
    }

    return HoursValuesGraph;
  }

  populateGraph(thing) {
    let HoursValuesGraph = this.buildDataForGraph(this.lightsHours, thing);
    // HoursValuesGraph = [4, 5, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]

    this.lineChartData = [
      { data: HoursValuesGraph, label: 'Usage' }
    ];
  }


  chooseType(type) {
    this.typeActive = type.icon;

  }

  existingTypes() {
    this.types = ThingsInfoHelper.getAssignableTypeOptions();
    if(this.types){
      this.typeActive = this.types[0].icon;
    }
  }

  buildGraph(index) {

    this.populateGraph(this.lights[index]);
  }

  setType(type) {
    switch (type) {
      case "Things::Light":
        return "Lights";
      case "Things::Lock":
        return "Locks";
      case "Things::Weather":
        return "Weather";
      case "Things::Thermostat":
        return "Thermostats";
      case "Things::MotionSensor":
        return "Motion Sensor";
    }
  }
}
