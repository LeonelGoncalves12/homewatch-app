import translate from 'translate';
import {Config} from "../config";
import {Injectable} from "@angular/core";

@Injectable()
export class Translate {
  constructor(public config: Config) {

  }

  async TranslateText(input, language) {
    if (language == "en"){
      return input;
    }
    try{

      let APIKey = await this.config.getTranslateAPIKey();

      let params = {
        from: 'en',
        to: language,
        engine: 'yandex',
        key: APIKey
      };

      return await translate(input, params);
    }catch {
      return input;
    }
  }

  async translateList(list, attribute, storage){
    let language = await storage.get("LANGUAGE");
    for(let i = 0; i< list.length; i++){
      this.TranslateText(list[i][attribute], language).then(data => {list[i][attribute] = data});
    }

    return list
  }


  async translateArray(array, storage){
    let language = await storage.get("LANGUAGE");
    for(let i = 0; i< array.length; i++){
      this.TranslateText(array[i], language).then(data => {array[i] = data});
    }
    return array
  }


  async translateLabels(storage){
    let language = await storage.get("LANGUAGE");
    console.error(language)
    this.TranslateText("Homes", language).then(data => {storage.set("homesLabel",data)});
    this.TranslateText("Rooms", language).then(data => {storage.set("roomsLabel",data)});
    this.TranslateText("Devices", language).then(data => {storage.set("devicesLabel",data)});
    this.TranslateText("Device", language).then(data => {storage.set("deviceLabel",data)});
    this.TranslateText("Scenarios", language).then(data => { storage.set("scenariosLabel",data)});
    this.TranslateText("Scenario",language).then(data => { storage.set("scenarioLabel",data)});
    this.TranslateText("Tasks",language).then(data => {storage.set("tasksLabel",data)});
    this.TranslateText("Add home",language).then(data => {storage.set("addHomeLabel",data) });
    this.TranslateText("Address",language).then(data => {storage.set("addressLabel",data) });
    this.TranslateText("City",language).then(data => {storage.set("cityLabel",data)});
    this.TranslateText("Timed Tasks:",language).then(data => {storage.set("timedTasksLabel",data)  });
    this.TranslateText("Triggered Tasks:",language).then(data => {storage.set("triggeredTasksLabel",data) });

    this.TranslateText("Weather",language).then(data => {storage.set("weatherLabel",data)});
    this.TranslateText("Statistics",language).then(data => {storage.set("statisticsLabel",data)});

    this.TranslateText("Settings",language).then(data => {storage.set("settingsLabel",data)});
    this.TranslateText("Profile",language).then(data => {storage.set("profileLabel",data)});
    this.TranslateText("Notifications",language).then(data => {storage.set("notificationsLabel",data)});
    this.TranslateText("Preferences",language).then(data => {storage.set("preferencesLabel",data)});
    this.TranslateText("Help",language).then(data => {storage.set("helpLabel",data)});
    this.TranslateText("Try Again",language).then(data => {storage.set("tryAgainLabel",data)});

    this.TranslateText("Name",language).then(data => {storage.set("nameLabel",data)});
    this.TranslateText("Location",language).then(data => {storage.set("locationLabel",data)});
    this.TranslateText("Port",language).then(data => {storage.set("portLabel",data)});
    this.TranslateText("Tunnel", language).then(data => {storage.set("tunnelLabel",data)});

    this.TranslateText("Create",language).then(data => {storage.set("createLabel",data)});
    this.TranslateText("Edit",language).then(data => {storage.set("editLabel",data)});
    this.TranslateText("Delete home",language).then(data => {storage.set("deleteHomeLabel",data)});




    this.TranslateText("Something failed.",language).then(data => {storage.set("somethingFailedLabel",data)});

    this.TranslateText("Room's devices",language).then(data => {storage.set("roomDevicesLabel",data)});
    this.TranslateText("Add Room",language).then(data => {storage.set("addRoomLabel",data)});
    this.TranslateText("Owner",language).then(data => {storage.set("ownerLabel",data)});
    this.TranslateText("Remove Room",language).then(data => {storage.set("removeRoomLabel",data)});
    this.TranslateText("Add Device",language).then(data => {storage.set("addDeviceLabel",data)});
    this.TranslateText("Remove device",language).then(data => {storage.set("removeDeviceLabel",data)});

    this.TranslateText("Save",language).then(data => {storage.set("saveLabel",data)});
    this.TranslateText("Find Devices",language).then(data => {storage.set("findDevicesLabel",data)});

    this.TranslateText("Scenarios",language).then(data => {storage.set("scenariosLabel",data)});
    this.TranslateText("New Scenario",language).then(data => {storage.set("newScenarioLabel",data)});
    this.TranslateText("Create Scenario",language).then(data => {storage.set("createScenarioLabel",data)});
    this.TranslateText("Scenario Devices",language).then(data => {storage.set("scenariosDevicesLabel",data)});
    this.TranslateText("Apply Scenario",language).then(data => {storage.set("applyScenarioLabel",data)});
    this.TranslateText("Remove Scenario",language).then(data => {storage.set("removeScenarioLabel",data)});
    this.TranslateText("Edit Devices",language).then(data => {storage.set("editDevicesLabel",data)});

    this.TranslateText("Choose an icon",language).then(data => {storage.set("chooseIconLabel",data)});

    this.TranslateText("New Scenario Device",language).then(data => {storage.set("newScenarioThingLabel",data)});

    this.TranslateText("New Task",language).then(data => {storage.set("newTaskLabel",data)});
    this.TranslateText("Remove Task",language).then(data => {storage.set("removeTaskLabel",data)});
    this.TranslateText("Timed",language).then(data => {storage.set("timedLabel",data)});
    this.TranslateText("Triggered",language).then(data => {storage.set("triggeredLabel",data)});

    this.TranslateText("Device(s)",language).then(data => {storage.set("devicesTasksLabel",data)});

    this.TranslateText("when",language).then(data => {storage.set("whenLabel",data)});
    this.TranslateText("Activate",language).then(data => {storage.set("activateLabel",data)});
    this.TranslateText("Device to Compare",language).then(data => {storage.set("deviceToCompareLabel",data)});
    this.TranslateText("Create Triggered Task",language).then(data => {storage.set("createTriggeredTaskLabel",data)});
    this.TranslateText("Create Timed Task",language).then(data => {storage.set("createTimedTaskLabel",data)});

    this.TranslateText("Choose device", language).then(data => {storage.set("chooseDeviceLabel",data)});
    this.TranslateText("Choose scenario", language).then(data => {storage.set("chooseScenarioLabel",data)});

    this.TranslateText("Minutes", language).then(data => {storage.set("minutesLabel",data)});
    this.TranslateText("Hours", language).then(data => {storage.set("hoursLabel",data)});
    this.TranslateText("Days (Month)", language).then(data => {storage.set("daysMonthLabel",data)});
    this.TranslateText("Months", language).then(data => {storage.set("monthsLabel",data)});
    this.TranslateText("Days (Week)", language).then(data => {storage.set("daysWeekLabel",data)});

    this.TranslateText("Every minutes", language).then(data => {storage.set("everyMinuteLabel",data)});
    this.TranslateText("Every hours", language).then(data => {storage.set("everyHourLabel",data)});
    this.TranslateText("Every days", language).then(data => {storage.set("everyDayLabel",data)});
    this.TranslateText("Every months", language).then(data => {storage.set("everyMonthLabel",data)});
    this.TranslateText("Every Days of Week", language).then(data => {storage.set("everyDaysWeekLabel",data)});
    this.TranslateText("Every", language).then(data => {storage.set("everyLabel",data)});
    this.TranslateText("Start at", language).then(data => {storage.set("startAtLabel",data)});
    this.TranslateText("Days", language).then(data => {storage.set("daysLabel",data)});

    this.TranslateText("Usage", language).then(data => {storage.set("usageLabel",data)});
    this.TranslateText("Consumo", language).then(data => {storage.set("consumeLabel",data)});
    this.TranslateText("hour", language).then(data => {storage.set("hourLabel",data)});
    this.TranslateText("Times Locked", language).then(data => {storage.set("timesLockedLabel",data)});
    this.TranslateText("Average temperature", language).then(data => {storage.set("averageTemperatureLabel",data)});

    this.TranslateText("Number of ", language).then(data => {storage.set("numberOfLabel",data)});
    this.TranslateText("Favorite room", language).then(data => {storage.set("favoriteRoomLabel",data)});
    this.TranslateText("Favorite home", language).then(data => {storage.set("favoriteHomeLabel",data)});


    this.TranslateText("Times used by timed tasks ", language).then(data => {storage.set("timesByTimedLabel",data)});
    this.TranslateText("Times used by triggered tasks", language).then(data => {storage.set("timesByTriggeredLabel",data)});
    this.TranslateText("Times used by activation", language).then(data => {storage.set("timesByActivationLabel",data)});

    this.TranslateText("Trigger device", language).then(data => {storage.set("triggerDeviceLabel",data)});
    this.TranslateText("Times runned", language).then(data => {storage.set("timesRunnedLabel",data)});

    this.TranslateText("Email", language).then(data => {storage.set("emailLabel",data)});
    this.TranslateText("Password", language).then(data => {storage.set("passwordLabel",data)});

    this.TranslateText("Notifications", language).then(data => {storage.set("notificationsLabel",data)});

    this.TranslateText("Preferences", language).then(data => {storage.set("preferencesLabel",data)});
    this.TranslateText("Theme", language).then(data => {storage.set("themeLabel",data)});
    this.TranslateText("Language", language).then(data => {storage.set("languageLabel",data)});
    this.TranslateText("Find Hub", language).then(data => {storage.set("findHubLabel",data)});

    this.TranslateText("There aren't devices installed.", language).then(data => {storage.set("noDevicesInstalledLabel",data)});
    this.TranslateText("There aren't scenarios installed.", language).then(data => {storage.set("noScenariosInstalledLabel",data)});

    return storage;
  }
}
