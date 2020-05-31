import {IonicModule, NavController, Navbar, NavParams} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';


import {FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {ListStatisticsThings} from "./list";
import {
  HomewatchApiServiceMock,
  NavBarMock, NavMock, NavParamsMock, StorageMock, ThingsTranslatorMock,
  TranslateMock
} from "../../../../test-config/mocks-ionic";
import {ThingsTranslator} from "../../../helpers/ThingsTranslator";
import {Translate} from "../../../helpers/Translate";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {ChartsModule} from "ng2-charts";


describe('Things Stats', () => {
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
        id: 12,
        name: "Lock",
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
        type: "Things::Lock"
      },
      {
        connection_info: {address: "homewatch-hub.local", port: 3003},
        favorite: "1",
        home: 1,
        id: 13,
        name: "Thermostat",
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
        type: "Things::Thermostat"
      },
      {
        connection_info: {address: "homewatch-hub.local", port: 3004},
        favorite: "1",
        home: 1,
        id: 14,
        name: "MotionSensor",
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
        type: "Things::MotionSensor"
      },
      {
        connection_info: {address: "homewatch-hub.local", port: 3005},
        favorite: "1",
        home: 1,
        id: 15,
        name: "Weather",
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
        type: "Things::Weather"
      }
    ]
  };


  let statistics = {
    data: [{
      created_at: "2019-11-19T22:08:03.901Z",
      id: 1,
      scenario: null,
      status: {on:true},
      thingID: 11,
      timed_task: null,
      triggered_task: null,
    },
      {
        created_at: "2019-11-19T22:08:03.901Z",
        id: 2,
        scenario: null,
        status: {lock:true},
        thingID: 12,
        timed_task: null,
        triggered_task: null,
      },
      {
        created_at: "2019-11-19T22:08:03.901Z",
        id: 3,
        scenario: null,
        status: {targetTemperature:12},
        thingID: 13,
        timed_task: null,
        triggered_task: null,
      },
      {
        created_at: "2019-11-19T22:08:03.901Z",
        id: 4,
        scenario: null,
        status: null,
        thingID: 14,
        timed_task: null,
        triggered_task: null,
      },
      {
        created_at: "2019-11-19T22:08:03.901Z",
        id: 5,
        scenario: null,
        status: null,
        thingID: 15,
        timed_task: null,
        triggered_task: null,
      },
      {
        created_at: "2019-11-19T22:08:03.901Z",
        id: 6,
        scenario: null,
        status: {on:false},
        thingID: 11,
        timed_task: null,
        triggered_task: null,
      },
      {
        created_at: "2019-11-19T22:08:03.901Z",
        id: 7,
        scenario: null,
        status: {lock:true},
        thingID: 12,
        timed_task: null,
        triggered_task: null,
      },
      {
        created_at: "2019-11-19T22:08:03.901Z",
        id: 8,
        scenario: null,
        status: {targetTemperature:19},
        thingID: 13,
        timed_task: null,
        triggered_task: null,
      }]
  };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListStatisticsThings
      ],
      imports: [
        ChartsModule,
        IonicModule.forRoot(ListStatisticsThings)
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

    fixture = TestBed.createComponent(ListStatisticsThings);
    component = fixture.componentInstance;
    // nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    // navParams = TestBed.get(NavParams);
    // spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof ListStatisticsThings).toBe(true);
  });

  it('Load Page', fakeAsync(() => {
    spyOn(component, 'listHomesAPI').and.returnValue(Promise.resolve(homes));
    spyOn(component, 'listStatisticsAPI').and.returnValue(Promise.resolve(statistics));
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    component.ionViewWillEnter();
    tick(3000);
  }));


  it('Choose Type', () => {
    component.chooseType("Things::Light")
  });

  it('Build Graph', () => {
    component.buildGraph(things.data[0])
  });

});
