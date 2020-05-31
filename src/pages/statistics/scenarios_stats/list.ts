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
export class ListStatisticsScenarios {
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
  ScenariosTimedTasks: Array<any> = [];
  ScenariosTriggeredTasks: Array<any> = [];
  list: Array<any> = [];
  listTimedCount: Array<any> = [];
  listTriggeredCount: Array<any> = [];
  timedtasks: Array<any> = [];
  triggeredtasks: Array<any> = [];
  MostUsedScenarioTimed = [];
  MostUsedScenarioTriggered = [];
  MostUsedScenario = [];
  Scenario: any;
  TimesUsed = 0;
  TimesUsedbyTimed = 0;
  TimesUsedbyTriggered = 0;
  scenarioIndex: any;
  scenarioStats: any = [];
  totalStats: any = [];
  theme = 'default';

  scenariosLabel;
  timesByTimedLabel;
  timesByTriggeredLabel;
  timesByActivationLabel;

  type = 'general';

  //charts
  public lineChartData: Array<any> = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Usage'}
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
          userCallback: function (label, index, labels) {
            // when the floored value is the same as the value we have a whole number
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
    this.scenariosLabel = await this.storage.get("scenariosLabel");
    this.timesByTimedLabel = await this.storage.get("timesByTimedLabel");
    this.timesByTriggeredLabel = await this.storage.get("timesByTriggeredLabel");
    this.timesByActivationLabel = await this.storage.get("timesByActivationLabel");
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

  async listScenariosAPI(home){
    return await this.homewatch.scenarios(home).listScenarios();
  }

  async listTimedTasksAPI(home){
    return await this.homewatch.timedTasks(home).listTimedTasks();
  }

  async listTriggeredTasksAPI(home){
    return await this.homewatch.triggeredTasks(home).listTriggeredTasks();
  }


  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME")
    this.rooms = [];
    this.things = [];
    this.scenarios = [];
    this.timed_tasks = [];
    this.triggered_tasks = [];
    this.statistics = [];
    this.ScenariosTimedTasks = [];
    this.loading = true;

    this.user = this.navParams.get("user");

    const response = await this.listHomesAPI();
    this.homes = ArraySorterHelper.sortArrayByID(response.data);

    const respstatistics = await this.listStatisticsAPI();
    this.statistics = respstatistics.data;

    let timedStats = [];
    let triggeredStats = [];

    for (let i = 0; i < this.homes.length; i++) {
      const response_Scenarios = await this.listScenariosAPI(this.homes[i]);
      this.scenarios = ArraySorterHelper.sortArrayByID(response_Scenarios.data);

      const response_timed = await this.listTimedTasksAPI(this.homes[i]);
      this.timed_tasks = ArraySorterHelper.sortArrayByID(response_timed.data);

      const response_triggered = await this.listTriggeredTasksAPI(this.homes[i]);
      this.triggered_tasks = ArraySorterHelper.sortArrayByID(response_triggered.data);


      for (let j = 0; j < this.statistics.length; j++) {
        if (this.statistics[j].scenario) {
          try {
            for (let responseScenario of this.scenarios) {
              if (responseScenario.id == parseInt(this.statistics[j].scenario)) {
                this.statistics[j].scenario = parseInt(this.statistics[j].scenario);
                this.statistics[j].icon = responseScenario.icon;
                this.statistics[j].name = responseScenario.name;
                this.totalStats.push(this.statistics[j])
                break;
              }
            }
          }
          catch (error) {
            continue;
          }
        }
        else {
          if (this.statistics[j].timed_task) {
            try {
              for (let responseTimed of this.timed_tasks) {
                if (responseTimed.id == parseInt(this.statistics[j].timed_task)) {
                  if (responseTimed.scenario) {
                    this.statistics[j].scenario = responseTimed.scenario.id;
                    this.statistics[j].icon = responseTimed.scenario.icon;
                    this.statistics[j].name = responseTimed.scenario.name;
                    timedStats.push(this.statistics[j])
                    this.totalStats.push(this.statistics[j])
                    break;
                  }
                }
              }
            }
            catch (error) {
              continue;
            }
          } else {
            if (this.statistics[j].triggered_task) {
              try {

                for (let responseTriggered of this.triggered_tasks) {
                  if (responseTriggered.id == parseInt(this.statistics[j].triggered_task)) {
                    if (responseTriggered.scenario) {
                      this.statistics[j].scenario =
                        responseTriggered.scenario.id;
                      this.statistics[j].icon = responseTriggered.scenario.icon;
                      this.statistics[j].name = responseTriggered.scenario.name;
                      triggeredStats.push(this.statistics[j])
                      this.totalStats.push(this.statistics[j])
                      break;
                    }
                  }
                }
              }
              catch (error) {
                continue;
              }
            }
          }
        }
      }

    }
    this.MostUsedScenario = this.getMaxCount(this.totalStats)

    this.MostUsedScenarioTimed = this.getMaxCount(timedStats)
    this.MostUsedScenarioTriggered = this.getMaxCount(triggeredStats)


    if (this.MostUsedScenario && this.MostUsedScenario.length > 0) {


      this.scenarioIndex = this.MostUsedScenario[0].scenario;
      this.Scenario = this.MostUsedScenario[0];
      this.CountTimes2(this.MostUsedScenario[0].scenario);

      let HoursValuesGraph = this.buildDataForGraph(this.scenarioStats)

      this.lineChartData = [
        {data: HoursValuesGraph, label: 'Usage'}
      ];
    }

    this.loading = false;
  }

  getMaxCount(Stats) {
    let sortedArr = [];
    let count = 1;
    //maybe parse para int
    sortedArr = Stats.sort(function (a, b) {
      return b.scenario - a.scenario
    });

    let list: Array<any> = [];
    for (let z = 0; z < sortedArr.length; z = z + count) {
      count = 1;
      for (let j = z + 1; j < sortedArr.length; j++) {
        if (sortedArr[z].scenario === sortedArr[j].scenario)
          count++;
      }
      let aux = {scenario: sortedArr[z].scenario, count: count, icon: sortedArr[z].icon, name: sortedArr[z].name};
      list.push(aux)
    }
    if (list.length > 0) {
      return list
    } else {
      return [];
    }
  }

  resetCount() {
    this.TimesUsed = 0;
    this.TimesUsedbyTimed = 0;
    this.TimesUsedbyTriggered = 0;
    this.scenarioStats = [];
  }


  CountTimes2(scenario) {
    console.error("CountTimes2 - 1 ")
    console.error(this.scenarioStats)
    for (let j = 0; j < this.totalStats.length; j++) {
      if (this.totalStats[j].scenario == scenario) {
        this.scenarioStats.push(this.totalStats[j])
      }
    }
    console.error("CountTimes2 - 2 ")
    console.error(this.scenarioStats)


    for (let k = 0; k < this.scenarioStats.length; k++) {
      if (scenario === this.scenarioStats[k].scenario) {

        if (this.scenarioStats[k].timed_task) {
          this.TimesUsedbyTimed++;
        } else if (this.scenarioStats[k].triggeredd_task) {
          this.TimesUsedbyTriggered++;
        } else {
          this.TimesUsed++;
        }
      }
    }
  }


  chooseScenario(scenario) {
    this.Scenario = scenario

    this.scenarioIndex = scenario.scenario;


    this.resetCount()

    this.CountTimes2(scenario.scenario)


    let HoursValuesGraph = this.buildDataForGraph(this.scenarioStats)


    this.lineChartData = [
      {data: HoursValuesGraph, label: 'Usage'}
    ];
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

    for (var z = 0; z < sortedHours.length; z = z + count) {
      count = 1;
      for (var j = z + 1; j < sortedHours.length; j++) {
        if (sortedHours[z] === sortedHours[j])
          count++;
      }
      let aux = {hour: sortedHours[z], count: count};
      HoursCount.push(aux)
    }


    var HoursValuesGraph = Array(24).fill(0);

    for (let s = 0; s < HoursCount.length; s++) {
      HoursValuesGraph[HoursCount[s].hour] = HoursCount[s].count
    }

    return HoursValuesGraph;
  }
}
