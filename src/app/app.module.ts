import {ErrorHandler, NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";

import {IonicStorageModule} from "@ionic/storage";
import {IonicApp, IonicErrorHandler, IonicModule} from "ionic-angular";
import {SplashScreen} from "@ionic-native/splash-screen/ngx";
import {StatusBar} from "@ionic-native/status-bar/ngx";
import {ListHomesPage} from "../pages/homes/list/list";
import {NewHomePage} from "../pages/homes/new/new";
import {NewScenarioThingPage} from "../pages/scenario_things/new/new";
import {ListScenariosPage} from "../pages/scenarios/list/list";
import {NewScenarioPage} from "../pages/scenarios/new/new";
import {ShowScenarioPage} from "../pages/scenarios/show/show";
import {ListTasksPage} from "../pages/tasks/list/list";
import {ListTimedTasksPage} from "../pages/tasks/timed/list/list";
import {NewTimedTaskPage} from "../pages/tasks/timed/new/new";
import {ListTriggeredTasksPage} from "../pages/tasks/triggered/list/list";
import {NewTriggeredTaskPage} from "../pages/tasks/triggered/new/new";
import {ShowLightPage} from "../pages/things/devices/light/show";
import {ShowLockPage} from "../pages/things/devices/lock/show";
import {ShowMotionSensorPage} from "../pages/things/devices/motion_sensor/show";
import {ShowThermostatPage} from "../pages/things/devices/thermostat/show";
import {ShowWeatherPage} from "../pages/things/devices/weather/show";
import {EditThingPage} from "../pages/things/edit/edit";
import {NewThingPage} from "../pages/things/new/new";
import {LoginPage} from "../pages/users/login/login";
import {EditProfilePage} from "../pages/users/sign-up/edit";
import {SignUpPage} from "../pages/users/sign-up/sign-up";
import {HomewatchApiService} from "../services/homewatch_api";
import {MyApp} from "./app.component";
import {Homepage} from "../pages/users/homepage/homepage";
import {NewRoomPage} from "../pages/rooms/new/new";
import {ValidatorLoginPage} from "../pages/users/login/validator-login";
import {ListRoomPage} from "../pages/rooms/list/list";
import {LongPressModule} from "ionic-long-press";

import {ListStatisticsThings} from "../pages/statistics/thing_stats/list";
import {ListStatisticsTasks} from "../pages/statistics/tasks_stats/list";
import {ListStatisticsRoomsHomes} from "../pages/statistics/rooms_stats/list";
import {ListStatisticsScenarios} from "../pages/statistics/scenarios_stats/list";
import {HttpClientModule} from '@angular/common/http';

import {TriggeredTaskPopoverPage} from "../pages/tasks/triggered/new/popover";
import {DatePicker} from '@ionic-native/date-picker/ngx';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';
import { ChartsModule } from 'ng2-charts';
import {EditNotificationsPage} from "../pages/users/notifications/edit/edit";
import {EditPreferencesPage} from "../pages/users/preferences/edit/edit";

import { Geolocation } from '@ionic-native/geolocation/ngx';
import {Camera} from "@ionic-native/camera/ngx";
import {Translate} from "../helpers/Translate";
import {Config} from "../config";
import {OneSignal} from "@ionic-native/onesignal/ngx";
import {ThingsTranslator} from "../helpers/ThingsTranslator";
import {DateCalculator} from "../helpers/NextRunDisplay";

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignUpPage,
    ListHomesPage,
    NewHomePage,
    EditThingPage,
    EditProfilePage,
    ShowLightPage,
    ShowLockPage,
    ShowThermostatPage,
    ShowWeatherPage,
    ShowMotionSensorPage,
    ListScenariosPage,
    NewScenarioPage,
    ShowScenarioPage,
    NewScenarioThingPage,
    ListTasksPage,
    ListTimedTasksPage,
    NewTimedTaskPage,
    ListTriggeredTasksPage,
    NewTriggeredTaskPage,
    Homepage,
    NewRoomPage,
    ValidatorLoginPage,
    ListRoomPage,
    TriggeredTaskPopoverPage,
    ListStatisticsThings,
    ListStatisticsTasks,
    ListStatisticsRoomsHomes,
    ListStatisticsScenarios,
    NewThingPage,
    EditNotificationsPage,
    EditPreferencesPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LongPressModule,
    ChartsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: "__homewatchdb",
      driverOrder: ["sqlite", "indexeddb", "websql"]
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignUpPage,
    ListHomesPage,
    NewHomePage,
    EditThingPage,
    EditProfilePage,
    ShowLightPage,
    ShowLockPage,
    ShowThermostatPage,
    ShowWeatherPage,
    ShowMotionSensorPage,
    ListScenariosPage,
    NewScenarioPage,
    ShowScenarioPage,
    NewScenarioThingPage,
    ListTasksPage,
    ListTimedTasksPage,
    NewTimedTaskPage,
    ListTriggeredTasksPage,
    NewTriggeredTaskPage,
    Homepage,
    NewRoomPage,
    ValidatorLoginPage,
    ListRoomPage,
    TriggeredTaskPopoverPage,
    ListStatisticsThings,
    ListStatisticsTasks,
    ListStatisticsRoomsHomes,
    ListStatisticsScenarios,
    NewThingPage,
    EditNotificationsPage,
    EditPreferencesPage
  ],

  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    HomewatchApiService,
    LocalNotifications,
    DatePicker,
    Geolocation,
    Camera,
    Translate,
    Config,
    OneSignal,
    ThingsTranslator,
    DateCalculator
  ]
})

export class AppModule {
}
