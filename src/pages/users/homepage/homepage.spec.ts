import {IonicModule, NavController, Navbar,NavParams} from "ionic-angular";
import { Storage } from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {
  ConfigMock, HomewatchApiServiceMock, HttpClientMock, NavBarMock, NavMock, NavParamsMock, OneSignalMock,
  StorageMock, TranslateMock
} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import { FormBuilder} from "@angular/forms";
import {Config} from "../../../config";
import {Translate} from "../../../helpers/Translate";

import {OneSignal} from "@ionic-native/onesignal/ngx";
import {Homepage} from "./homepage";
import {HttpClient} from "@angular/common/http";
import {ListHomesPage} from "../../homes/list/list";
import {NewRoomPage} from "../../rooms/new/new";
import {NewHomePage} from "../../homes/new/new";
import {ListStatisticsThings} from "../../statistics/thing_stats/list";
import {ListStatisticsRoomsHomes} from "../../statistics/rooms_stats/list";
import {ListStatisticsScenarios} from "../../statistics/scenarios_stats/list";
import {ListStatisticsTasks} from "../../statistics/tasks_stats/list";
import {EditProfilePage} from "../sign-up/edit";
import {ListRoomPage} from "../../rooms/list/list";
import {ListScenariosPage} from "../../scenarios/list/list";
import {EditNotificationsPage} from "../notifications/edit/edit";
import {EditPreferencesPage} from "../preferences/edit/edit";
import {LoginPage} from "../login/login";
import {ListTasksPage} from "../../tasks/list/list";


describe('Login', () => {
  let fixture;
  let component;
  let nav;
  let storage;
  let user = {
      id: 1,
      name: "Leonel",
      email: "test@test.com",
      city: "Lisboa",
      jwt: "token"
  };

  let home = {
    id: 1,
    name : "Home 1",
    address: "Lisbon",
    image: "imageURL",
    tunnel: "tunnel"
  };

  let homes = {
    data: [{
      id: 1,
      name : "Home 1",
      address: "Lisbon",
      image: "imageURL",
      tunnel: "tunnel"
    }]
  };

  let conditions = {
    data: [{
      id: 1,
      city: "Lisboa",
      temperature: 11,
      wind: 6,
      humidity: 71,
      icon: "04n",
      descrption: "overcast clouds",
      sunrise: "Thu Apr 23 2020 06:38:45 GMT+0100 (Hora de verão da Europa Ocidental) {}",
      sunset: "Thu Apr 23 2020 20:19:19 GMT+0100 (Hora de verão da Europa Ocidental) {}"
    }]
  };
  let weather = {
    base: "stations",
    clouds: {all: 99},
    cod: 200,
    coord: {lon: -7.74, lat: 41.3},
    dt: 1587672837,
    id: 2732438,
    main: {
      feels_like: 11.89,
      humidity: 7,
      pressure: 1016,
      temp: 16.4,
      temp_max: 16.67,
      temp_min: 16.11
    },
    name: "Vila Real",
    sys: {type: 3, id: 2021767, country: "PT", sunrise: 1587620325, sunset: 1587669559},
    timezone: 3600,
    weather: [{id: 804, main: "Clouds", description: "overcast clouds", icon: "04n"}],
    wind: {speed: 1.34, deg: 131, gust: 1.34}
  };




  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Homepage
      ],
      imports: [
        IonicModule.forRoot(Homepage)
      ],
      providers: [
        { provide: NavController, useClass: NavMock},
        { provide: Storage, useClass: StorageMock},
        { provide: NavParams, useClass: NavParamsMock},
        { provide: Config, useClass: ConfigMock},
        { provide: Translate, useClass: TranslateMock},
        { provide: Navbar, useClass: NavBarMock},
        { provide: OneSignal, useClass: OneSignalMock},
        { provide: HttpClient, useClass: HttpClientMock},
        { provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(Homepage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    spyOn(nav, 'push');
    spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof Homepage).toBe(true);
  });

  it('Load Page', fakeAsync(() => {
    storage = TestBed.get(Storage);
    spyOn(component, 'getWeather');
    spyOn(component.navParams, 'get').and.returnValue(user);
    spyOn(storage, 'get').and.returnValue("green");
    spyOn(component, 'getHomes').and.returnValue(Promise.resolve(homes));
    fixture.detectChanges();
    component.ionViewWillEnter();

    tick(5000);
   expect(component.uploadedIMG.nativeElement.src).toBe('http://localhost:9876/imageURL');

  }));


  it('Load Page failed', fakeAsync(() => {
    storage = TestBed.get(Storage);
    spyOn(component, 'getWeather');
    spyOn(component.navParams, 'get').and.returnValue(user);
    spyOn(storage, 'get').and.returnValue("green");
    spyOn(component, 'getHomes').and.throwError('My Error');

    component.ionViewWillEnter();

    tick(5000);
    expect(component.failed).toBe(true);

  }));


  it('Go to Homes', () => {
    component.listHomes(user);
    expect(nav.push).toHaveBeenCalledWith(ListHomesPage , {user})
  });

  it('Go to Room', () => {
    component.goToRoom(home);
    expect(nav.push).toHaveBeenCalledWith(NewRoomPage , {home})
  });

  it('Go New Home', () => {
    component.newHome();
    expect(nav.push).toHaveBeenCalledWith(NewHomePage)
  });

  it('Statistics for things', () => {
    component.listStatisticsThings(user);
    expect(nav.push).toHaveBeenCalledWith(ListStatisticsThings, {user})
  });


  it('Statistics for rooms and homes', () => {
    component.listStatisticsRoomsHomes(user);
    expect(nav.push).toHaveBeenCalledWith(ListStatisticsRoomsHomes, {user})
  });


  it('Statistics for scenarios', () => {
    component.listStatisticsScenarios(user);
    expect(nav.push).toHaveBeenCalledWith(ListStatisticsScenarios, {user})
  });


  it('Statistics for tasks', () => {
    component.listStatisticsTasks(user);
    expect(nav.push).toHaveBeenCalledWith(ListStatisticsTasks, {user})
  });

  it('Go to Edit User', () => {
    component.editUser(user);
    expect(nav.push).toHaveBeenCalledWith(EditProfilePage, {user})
  });

  it('Try Again', () => {
    spyOn(component, 'ionViewWillEnter')
    component.tryAgain();
    expect(component.ionViewWillEnter).toHaveBeenCalled();
  });

  it('Go To Rooms', () => {
    component.home = home;
    component.goToRooms();
    expect(nav.push).toHaveBeenCalledWith(ListRoomPage, {home})
  });

  it('Go To Scenarios', () => {
    component.home = home;
    component.goToScenarios();
    expect(nav.push).toHaveBeenCalledWith(ListScenariosPage, {home})
  });

  it('Go To Tasks', () => {
    component.home = home;
    component.goToTasks();
    expect(nav.push).toHaveBeenCalledWith(ListTasksPage, {home})
  });

  it('Go To Notifications', () => {
    component.goToNotifictions(user);
    expect(nav.push).toHaveBeenCalledWith(EditNotificationsPage, {user})
  });

  it('Go To Preferences', () => {
    component.goToPreferences(user);
    expect(nav.push).toHaveBeenCalledWith(EditPreferencesPage, {user})
  });

  it('Logout', fakeAsync(() => {
    spyOn(storage, 'remove');
    component.logout();
    tick(4000)
    expect(nav.setRoot).toHaveBeenCalledWith(LoginPage)
  }));


  it('update getWeather', fakeAsync(() => {

    component.user = user;
    spyOn(component, 'getConditions').and.returnValue(Promise.resolve(conditions));
    spyOn(component, 'getTime').and.returnValue(610000);
    spyOn(component, 'updateWeather');
    spyOn(component, 'getWeatherAPI').and.returnValue(Promise.resolve(weather));


    component.getWeather();
    tick(5000);
    expect(component.updateWeather).toHaveBeenCalled();
    expect(component.displaySunrise).toBe("6:38");
    expect(component.displaySunset).toBe("20:19");
  }));



  it('not update getWeather', fakeAsync(() => {

    component.user = user;
    spyOn(component, 'getConditions').and.returnValue(Promise.resolve(conditions));
    spyOn(component, 'getTime').and.returnValue(590000);
    spyOn(component, 'updateWeather');

    component.getWeather();
    tick(5000);
    expect(component.updateWeather).not.toHaveBeenCalled();

  }));


  it('create', fakeAsync(() => {

    let empty = {
      data:[]
    };
    component.user = user;
    spyOn(component, 'getConditions').and.returnValue(Promise.resolve(empty));
    spyOn(component, 'createWeather');
    spyOn(component, 'getWeatherAPI').and.returnValue(Promise.resolve(weather));
    component.getWeather();
    tick(5000);
    expect(component.createWeather).toHaveBeenCalled();

  }));

});
