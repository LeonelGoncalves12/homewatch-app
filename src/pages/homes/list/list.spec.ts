import {IonicModule, NavController, Navbar,NavParams} from "ionic-angular";
import { Storage } from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock,
} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import { FormBuilder} from "@angular/forms";
import {ListHomesPage} from "./list";
import {ListRoomPage} from "../../rooms/list/list";
import {ListTasksPage} from "../../tasks/list/list";
import {ListScenariosPage} from "../../scenarios/list/list";
import {NewHomePage} from "../new/new";
import {NewScenarioPage} from "../../scenarios/new/new";
import {NewRoomPage} from "../../rooms/new/new";


describe('New/Edit Home', () => {
  let fixture;
  let component;
  let nav;
  // let navParams;

  let homes = {
    data: [{
      id: 1,
      name : "Home 1",
      address: "Lisbon",
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
      tunnel: "https://0a3b45b6.eu.ngrok.io"
    },
      {
        id: 2,
        name : "Home 2",
        address: "Lisbon",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
        tunnel: "https://0a3b45b7.eu.ngrok.io"
      }]
  };

  let rooms = {
    data :[{
      home: {
        id: 1,
        name : "Home 1",
        address: "Lisbon",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
        tunnel: "https://0a3b45b6.eu.ngrok.io"
      },
      icon: "1",
      id: 1,
      name: "Kitchen",
      owner: ""
    }]
  };

  let things ={
    data: [{
      connection_info: {address: "homewatch-hub.local", port: 3001},
      favorite: "1",
      home: 1,
      id: 11,
      name: "Light",
      room: {
        home: {
          id: 1,
          name : "Home 1",
          address: "Lisbon",
          image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
          tunnel: "https://0a3b45b6.eu.ngrok.io"
        },
        icon: "1",
        id: 1,
        name: "Kitchen",
        owner: ""
      },
      subtype: "rest",
      type: "Things::Light"
    },
      {
        connection_info: {address: "homewatch-hub.local", port: 3002},
        favorite: "1",
        home: 1,
        id: 13,
        name: "Light",
        room: {
          home: {
            id: 1,
            name : "Home 1",
            address: "Lisbon",
            image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
            tunnel: "https://0a3b45b6.eu.ngrok.io"
          },
          icon: "1",
          id: 1,
          name: "Kitchen",
          owner: ""
        },
        subtype: "rest",
        type: "Things::Light"
      }
    ]
  };

  let timedTasks= {
    data: [{
      cron: "15 * * * *",
      id: 7,
      next_run: "2019-12-14T01:15:00.000Z",
      home: {
        id: 1,
        name: "Home 1",
        address: "Lisbon",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
        tunnel: "https://0a3b45b6.eu.ngrok.io"
      },
      thing:{
        connection_info: {address: "homewatch-hub.local", port: 3001},
        favorite: "1",
        home: 1,
        id: 11,
        name: "Light",
        room: {
          home: {
            id: 1,
            name: "Home 1",
            address: "Lisbon",
            image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
            tunnel: "https://0a3b45b6.eu.ngrok.io"
          },
          icon: "1",
          id: 1,
          name: "Kitchen",
          owner: ""
        },
        status: null,
        subtype: "rest",
        type: "Things::Light"
      }
    }]
  };


  let triggeredTasks ={
    data: [{
      comparator: "==",
      display: "Turn on Light when Thermostat is equals to 20ºC",
      id: 7,
      status_to_apply: {on: true},
      status_to_compare: {targetTemperature: 20},
      thing:       {
        connection_info: {address: "homewatch-hub.local", port: 3002},
        favorite: "1",
        home: 1,
        id: 13,
        name: "Light",
        room: {
          home: {
            id: 1,
            name : "Home 1",
            address: "Lisbon",
            image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
            tunnel: "https://0a3b45b6.eu.ngrok.io"
          },
          icon: "1",
          id: 1,
          name: "Kitchen",
          owner: ""
        },
        subtype: "rest",
        type: "Things::Light"
      },
      thing_to_compare: {
        connection_info: {address: "homewatch-hub.local", port: 3001},
        favorite: "1",
        home: 1,
        id: 11,
        name: "Light",
        room: {
          home: {
            id: 1,
            name : "Home 1",
            address: "Lisbon",
            image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
            tunnel: "https://0a3b45b6.eu.ngrok.io"
          },
          icon: "1",
          id: 1,
          name: "Kitchen",
          owner: ""
        },
        subtype: "rest",
        type: "Things::Light"
      }
    }]
  };

  let scenarios = {
    data: [{
      home: 1,
      icon: "2",
      id: 2,
      name: "Turn on all lights",
      scenario_things: [{
        id: 3,
        thing: {
          connection_info: {address: "homewatch-hub.local", port: 3001},
          favorite: "1",
          home: 1,
          id: 11,
          name: "Light",
          room: {
            home: {
              id: 1,
              name : "Home 1",
              address: "Lisbon",
              image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
              tunnel: "https://0a3b45b6.eu.ngrok.io"
            },
            icon: "1",
            id: 1,
            name: "Kitchen",
            owner: ""
          },
          subtype: "rest",
          type: "Things::Light"
        }
      }]
    }]
  };

  let status ={on: true};



  // let user = {
  //     id: 1,
  //     name: "Leonel",
  //     email: "test@test.com",
  //     city: "Lisboa",
  //     jwt: "token"
  // };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListHomesPage
      ],
      imports: [
        IonicModule.forRoot(ListHomesPage)
      ],
      providers: [
        { provide: NavController, useClass: NavMock},
        { provide: Storage, useClass: StorageMock},
        { provide: NavParams, useClass: NavParamsMock},
        { provide: Navbar, useClass: NavBarMock},
        { provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(ListHomesPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    // navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
  });

  it('Component should be created', () => {
    expect(component instanceof ListHomesPage).toBe(true);
  });

  it('Load page',fakeAsync(() => {
    spyOn(component, 'listHomesAPI').and.returnValue(Promise.resolve(homes));
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'getStatusAPI').and.returnValue(Promise.resolve(status));
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(component, 'listTimedTasksAPI').and.returnValue(Promise.resolve(timedTasks));
    spyOn(component, 'listTriggeredTasksAPI').and.returnValue(Promise.resolve(triggeredTasks));

    component.ionViewWillEnter();
    tick(3000);
    expect(component.minIndexHome).toBe(1);
  }));


  it('Load page failed',fakeAsync(() => {
    spyOn(component, 'listHomesAPI').and.throwError('My Error');
    component.ionViewWillEnter();
    tick(3000);
    expect(component.failed).toBe(true);
  }));


  it('Try Again', () => {
    spyOn(component, 'ionViewWillEnter')
    component.tryAgain();
    expect(component.ionViewWillEnter).toHaveBeenCalled();
  });

  it('Choose Home Next', () => {
    component.indexHome = 1;
    component.homes = homes.data;
    spyOn(component,'setHomeSrc');
    component.chooseHome('next');
    expect(component.indexHome).toBe(2);
  });

  it('Choose Home Previous', () => {
    component.indexHome = 2;
    component.homes = homes.data;
    spyOn(component,'setHomeSrc');
    component.chooseHome('previous');
    expect(component.indexHome).toBe(1);
  });


  it('Go To Rooms', () => {
    component.listRooms(homes[0]);
    expect(nav.push).toHaveBeenCalledWith(ListRoomPage, {home: homes[0]})
  });
  it('Go To Scenarios', () => {
    component.listScenarios(homes[0]);
    expect(nav.push).toHaveBeenCalledWith(ListScenariosPage, {home: homes[0]})
  });

  it('Go To Tasks', () => {
    component.listTasks(homes[0]);
    expect(nav.push).toHaveBeenCalledWith(ListTasksPage, {home: homes[0]})
  });

  it('Go To New Home', () => {
    component.newHome(homes[0]);
    expect(nav.push).toHaveBeenCalledWith(NewHomePage);
  });

  it('Go To Edit Home', () => {
    component.editHome(homes[0]);
    expect(nav.push).toHaveBeenCalledWith(NewHomePage, {home: homes[0]});
  });

  it('Go To Room', () => {
    component.goToRoom(homes[0]);
    expect(nav.push).toHaveBeenCalledWith(ListRoomPage, {home: homes[0]});
  });

  it('Go To New Room', () => {
    component.newRoom(homes[0]);
    expect(nav.push).toHaveBeenCalledWith(NewRoomPage, {home: homes[0]});
  });

  it('Go To New Scenario', () => {
    component.newScenario(homes[0]);
    expect(nav.push).toHaveBeenCalledWith(NewScenarioPage, {home: homes[0]});
  });

  it('Choose Type', () => {
    component.chooseType("rooms");
    expect(component.type).toBe("rooms");
  });
});
