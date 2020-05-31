import {IonicModule, NavController, Navbar, NavParams} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';


import {FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {ListStatisticsScenarios} from "./list";
import {
  HomewatchApiServiceMock,
  NavBarMock, NavMock, NavParamsMock, StorageMock, ThingsTranslatorMock,
  TranslateMock
} from "../../../../test-config/mocks-ionic";
import {ThingsTranslator} from "../../../helpers/ThingsTranslator";
import {Translate} from "../../../helpers/Translate";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {ChartsModule} from "ng2-charts";


describe('Scenario Stats', () => {
  let fixture;
  let component;
  // let nav;
  // let navParams;
  // let translate;

  let homes = {
    data: [{
      id: 1,
      name: "Home 1",
      address: "Lisbon",
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
      tunnel: "https://0a3b45b6.eu.ngrok.io"
    },
      {
        id: 2,
        name: "Home 2",
        address: "Lisbon",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
        tunnel: "https://0a3b45b7.eu.ngrok.io"
      }]
  };

  let rooms = {
    data: [{
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
    }]
  };

  let things = {
    data: [{
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
        subtype: "rest",
        type: "Things::Light"
      }
    ]
  };
  let timedTasks = {
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
      scenario: {
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
            subtype: "rest",
            type: "Things::Light"
          }
        }]
      }
    }]
  };


  let triggeredTasks = {
    data: [{
      comparator: "==",
      id: 7,
      status_to_apply: {on: true},
      status_to_compare: {targetTemperature: 20},
      scenario: {
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
            subtype: "rest",
            type: "Things::Light"
          }
        }]
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
          subtype: "rest",
          type: "Things::Light"
        }
      }]
    }]
  };


  let statistics = {
    data: [{
      created_at: "2019-11-19T22:08:03.901Z",
      id: 1,
      scenario: "2",
      status: null,
      thingID: null,
      timed_task: null,
      triggered_task: null,
    },
    {
      created_at: "2019-11-19T22:08:03.901Z",
      id: 1,
      scenario: null,
      status: null,
      thingID: null,
      timed_task: "7",
      triggered_task: null,
    },
    {
      created_at: "2019-11-19T22:08:03.901Z",
      id: 1,
      scenario: null,
      status: null,
      thingID: null,
      timed_task: null,
      triggered_task: "7",
    }]
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListStatisticsScenarios
      ],
      imports: [
        ChartsModule,
        IonicModule.forRoot(ListStatisticsScenarios)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: Storage, useClass: StorageMock},
        {provide: NavParams, useClass: NavParamsMock},
        {provide: Navbar, useClass: NavBarMock},
        {provide: Translate, useClass: TranslateMock},
        {provide: ThingsTranslator, useClass: ThingsTranslatorMock},
        {provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(ListStatisticsScenarios);
    component = fixture.componentInstance;
    // nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    // navParams = TestBed.get(NavParams);
    // spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof ListStatisticsScenarios).toBe(true);
  });

  it('Load Page', fakeAsync(() => {
    spyOn(component, 'listHomesAPI').and.returnValue(Promise.resolve(homes));
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'listStatisticsAPI').and.returnValue(Promise.resolve(statistics));
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(component, 'listTimedTasksAPI').and.returnValue(Promise.resolve(timedTasks));
    spyOn(component, 'listTriggeredTasksAPI').and.returnValue(Promise.resolve(triggeredTasks));
    component.ionViewWillEnter();
    tick(3000)
  }));


  it('Choose Scenario', () => {
    component.chooseScenario(scenarios.data[0])
  });



});
