import {Component} from "@angular/core";
import {HomewatchApi} from "homewatch-js";
import {LoadingController, NavController, NavParams} from "ionic-angular";

import {ArraySorterHelper} from "../../../helpers/array_sorter";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {Storage} from "@ionic/storage";

@Component({
  selector: "list-page",
  templateUrl: "list.html"
})
export class ListStatisticsTasks {
  homewatch: HomewatchApi;
  user: any;
  loading = true;
  homes: Array<any> = [];
  rooms: any = [];
  statistics: any = [];
  things: any = [];
  home: any;
  scenarios: Array<any> = [];
  timed_tasks: Array<any> = [];
  triggered_tasks: Array<any> = [];
  condition: any = {};
  CountTimed = 0;
  CountTriggered = 0;
  NextTimedToRun: any;
  listTimedCount: any = [];
  listTriggeredCount: any = [];
  timedTaskID
  triggeredTaskID
  timedCount = 0;
  triggeredCount = 0;
  typeActive = 'timed'
  theme = 'default';

  tasksLabel;
  timedLabel;
  triggeredLabel;
  scenarioLabel;
  deviceLabel;
  timesRunnedLabel;
  triggerDeviceLabel;


  //charts
  public lineChartDataTimed: Array<any> = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Usage'}
  ];

  public lineChartDataTriggered: Array<any> = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Usage'}
  ];

  public lineChartLabels: Array<any> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  public lineChartOptions: any = {
    responsive: true,
    title: {
      display: false,
      text: 'Color test'
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
          fontColor: "white", // this here
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
    { // grey
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

  constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams, public loadingCtrl: LoadingController, homewatchApiService: HomewatchApiService) {
    this.homewatch = homewatchApiService.getApi();
    this.translateLabels();
  }

  async translateLabels() {
    this.tasksLabel = await this.storage.get("tasksLabel");
    this.timedLabel = await this.storage.get("timedLabel");
    this.triggeredLabel = await this.storage.get("triggeredLabel");
    this.scenarioLabel = await this.storage.get("scenarioLabel");
    this.deviceLabel = await this.storage.get("deviceLabel");
    this.timesRunnedLabel = await this.storage.get("timesRunnedLabel");
    this.triggerDeviceLabel = await this.storage.get("triggerDeviceLabel");
    this.scenarioLabel = await this.storage.get("scenarioLabel");
  }

  async listHomesAPI(){
    return await this.homewatch.homes.listHomes();
  }

  async listStatisticsAPI() {
    return await this.homewatch.statistics.listStatistics();
  }

  async listTimedTasksAPI(home){
    return await this.homewatch.timedTasks(home).listTimedTasks();
  }

  async listTriggeredTasksAPI(home){
    return await this.homewatch.triggeredTasks(home).listTriggeredTasks();
  }

  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    this.loading = true;
    this.rooms = [];
    this.things = [];
    this.scenarios = [];
    this.timed_tasks = [];
    this.triggered_tasks = [];
    this.statistics = [];


    this.user = this.navParams.get("user");

    const response = await this.listHomesAPI();
    this.homes = ArraySorterHelper.sortArrayByID(response.data);

    const respstatistics = await this.listStatisticsAPI();
    this.statistics = respstatistics.data

    for (let i = 0; i < this.homes.length; i++) {
      const response_timed = await this.listTimedTasksAPI(this.homes[i]);
      const response_triggered = await this.listTriggeredTasksAPI(this.homes[i]);


      for(let resp of response_timed.data){
        this.timed_tasks.push(resp)
      }
      for(let resp of response_triggered.data){
        this.triggered_tasks.push(resp)
      }

      this.CountTimed = this.CountTimed + this.timed_tasks.length;
      this.CountTriggered = this.CountTimed + this.triggered_tasks.length;
    }

    let auxStatsTimed = [];
    let auxStatsTriggered = [];

    for (let j = 0; j < this.statistics.length; j++) {
      if (this.statistics[j].timed_task) {

        try {
          for (let timed_task of this.timed_tasks) {
            if (timed_task.id == parseInt(this.statistics[j].timed_task)) {

              if (timed_task.scenario) {
                this.statistics[j].name = timed_task.scenario.name
                this.statistics[j].type = "Scenario"

              } else if (timed_task.thing) {
                this.statistics[j].name = timed_task.thing.name
                this.statistics[j].type = "Thing"
              }

              auxStatsTimed.push(this.statistics[j])
            }
          }
        }
        catch (error) {

          continue;
        }

      } else if (this.statistics[j].triggered_task) {
        try {
          for (let triggered_task of this.triggered_tasks) {
            if (triggered_task.id == parseInt(this.statistics[j].triggered_task)) {
              if (triggered_task.scenario) {

                this.statistics[j].name = triggered_task.scenario.name
                this.statistics[j].type = "Scenario"

              } else if (triggered_task.thing) {
                this.statistics[j].name = triggered_task.thing.name
                this.statistics[j].type = "Thing"
              }

              this.statistics[j].thing_to_compare = triggered_task.thing_to_compare.name

              auxStatsTriggered.push(this.statistics[j])
            }
          }
        }
        catch (error) {
          continue;
        }
      }
    }
    auxStatsTimed = ArraySorterHelper.sortArrayByID(auxStatsTimed);
    auxStatsTriggered = ArraySorterHelper.sortArrayByID(auxStatsTriggered);

    ///// ir buscar o cenario que aparece mais  //////
    let sortedArrTimed = [];
    let sortedArrTriggered = [];


    let countTimed = 1;
    let countTriggered = 1;

    //maybe parse para int
    sortedArrTimed = auxStatsTimed.sort(function (a, b) {
      return a.timed_task - b.timed_task
    });


    sortedArrTriggered = auxStatsTriggered.sort(function (a, b) {
      return a.triggered_task - b.triggered_task
    });


    for (let z = 0; z < sortedArrTimed.length; z = z + countTimed) {
      countTimed = 1;
      for (let j = z + 1; j < sortedArrTimed.length; j++) {
        if (sortedArrTimed[z].timed_task === sortedArrTimed[j].timed_task)
          countTimed++;
      }

      if (sortedArrTimed[z].type == "Scenario") {
        let aux = {
          Timed: sortedArrTimed[z].timed_task,
          count: countTimed,
          type: "Scenario",
          name: sortedArrTimed[z].name
        };
        this.listTimedCount.push(aux)
      } else {
        let aux = {
          Timed: sortedArrTimed[z].timed_task,
          count: countTimed,
          type: "Thing",
          name: sortedArrTimed[z].name
        };
        this.listTimedCount.push(aux)

      }
    }



    for (let z = 0; z < sortedArrTriggered.length; z = z + countTriggered) {
      countTriggered = 1;
      for (let j = z + 1; j < sortedArrTriggered.length; j++) {
        if (sortedArrTriggered[z].triggered_task === sortedArrTriggered[j].triggered_task)
          countTriggered++;
      }

      if (sortedArrTriggered[z].type == "Scenario") {
        let aux = {
          Triggered: sortedArrTriggered[z].triggered_task,
          count: countTriggered,
          type: "Scenario",
          name: sortedArrTriggered[z].name,
          thingCompare: sortedArrTriggered[z].thing_to_compare
        };
        this.listTriggeredCount.push(aux)
      } else {
        let aux = {
          Triggered: sortedArrTriggered[z].triggered_task,
          count: countTriggered,
          type: "Thing",
          name: sortedArrTriggered[z].name,
          thingCompare: sortedArrTriggered[z].thing_to_compare
        };
        this.listTriggeredCount.push(aux)

      }
    }




    //horario medio de timed - obtem as horas das timed tasks q vem das stat e agrupa num array com o count das horas

    let TimedHoursValuesGraph = this.buildDataForGraph(auxStatsTimed)
    let TriggeredHoursValuesGraph = this.buildDataForGraph(auxStatsTriggered)

    this.lineChartDataTimed = [
      {data: TimedHoursValuesGraph, label: 'Usage'}
    ];

    this.lineChartDataTriggered = [
      {data: TriggeredHoursValuesGraph, label: 'Usage'}
    ];


    this.loading = false;
  }

  resetCount(typeActive) {
    if (typeActive == 'timed') {
      this.timedCount = 0;
    } else {
      this.triggeredCount = 0;
    }
  }

  onTypeChange(typeActive) {
    this.typeActive = typeActive;
  }

  buildDataForGraph(auxStats) {

    let Hours = [];
    for (let s = 0; s < auxStats.length; s++) {
      let hour = (new Date(auxStats[s].created_at)).getHours();
      Hours.push(hour)
    }
    let sortedHours = Hours.sort(function (a, b) {
      return b - a
    });


    let HoursCount = [];
    let count = 1;
    for (let z = 0; z < sortedHours.length; z = z + count) {
      count = 1;
      for (let j = z + 1; j < sortedHours.length; j++) {
        if (sortedHours[z] === sortedHours[j])
          count++;
      }
      let aux = {hour: sortedHours[z], count: count};
      HoursCount.push(aux)
    }

    let HoursValuesGraph = Array(24).fill(0);

    for (let s = 0; s < HoursCount.length; s++) {
      HoursValuesGraph[HoursCount[s].hour] = HoursCount[s].count
    }

    return HoursValuesGraph;
  }


  chooseTask(type, task) {
    if (type == 'timed') {

      this.timedTaskID = task;
      this.resetCount('timed');

      if (this.listTimedCount != null) {

        for (let k = 0; k < this.listTimedCount.length; k++) {
          if (task == this.listTimedCount[k].Timed) {
            this.timedCount = this.listTimedCount[k].count
          }
        }
      }
    } else {
      this.triggeredTaskID = task;
      this.resetCount('triggered');

      if (this.listTriggeredCount != null) {

        for (let k = 0; k < this.listTriggeredCount.length; k++) {
          if (task == this.listTriggeredCount[k].Triggered) {
            this.triggeredCount = this.listTriggeredCount[k].count
          }
        }
      }
    }
  }

}
