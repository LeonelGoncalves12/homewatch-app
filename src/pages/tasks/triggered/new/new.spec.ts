import {IonicModule, NavController, Navbar, NavParams} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {
  HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock, ThingsTranslatorMock, TranslateMock
} from "../../../../../test-config/mocks-ionic";
import {FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {HomewatchApiService} from "../../../../services/homewatch_api";
import {NewTriggeredTaskPage} from "./new";
import {Translate} from "../../../../helpers/Translate";
import {ShowLightPage} from "../../../things/devices/light/show";
import {BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";
import {ThingsTranslator} from "../../../../helpers/ThingsTranslator";


describe('List Tasks', () => {
  let fixture;
  let component;
  // let nav;
  let navParams;
  // let translate;

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

  let triggeredTasks = {
    data: [{
      comparator: "==",
      display: "Turn on Light when Thermostat is equals to 20ºC",
      id: 7,
      status_to_apply: {on: true},
      status_to_compare: {targetTemperature: 20},
      thing: {
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
  let triggeredTasks2 = {
    data: [{
      comparator: "==",
      display: "Turn on Light when Thermostat is equals to 20ºC",
      id: 7,
      status_to_apply: {on: true},
      status_to_compare: {targetTemperature: 20},
      scenario:
        {
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


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewTriggeredTaskPage,
        ShowLightPage
      ],
      imports: [
        IonicModule.forRoot(NewTriggeredTaskPage)
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
    }).overrideModule(BrowserDynamicTestingModule, {set: {entryComponents: [ShowLightPage]}});
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(NewTriggeredTaskPage);
    component = fixture.componentInstance;
    // nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    navParams = TestBed.get(NavParams);
    // spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof NewTriggeredTaskPage).toBe(true);
  });

  it('Load page with thing', fakeAsync(() => {
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(navParams, 'get').and.returnValue(triggeredTasks.data[0]);

    fixture.detectChanges();
    component.ionViewWillEnter();

    tick(3000)
  }));
  it('Load page with scenario', fakeAsync(() => {
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(navParams, 'get').and.returnValue(triggeredTasks2.data[0]);

    fixture.detectChanges();
    component.ionViewWillEnter();

    tick(3000)
  }));


  it('Apply Change', fakeAsync(() => {

    component.onToApplyChange("thing")
  }));


  it('Submit form', fakeAsync(() => {
    component.triggeredTaskForm.controls['id'].setValue("1");
    component.triggeredTaskForm.controls['thing_id'].setValue("11");
    component.triggeredTaskForm.controls['status_to_apply'].setValue(JSON.stringify({on: true}));
    component.triggeredTaskForm.controls['thing_to_compare_id'].setValue(13);
    component.triggeredTaskForm.controls['comparator'].setValue("==");
    component.triggeredTaskForm.controls['display'].setValue("Turn on Thing when Light is on.");
    component.triggeredTaskForm.controls['status_to_compare'].setValue(JSON.stringify({on: true}));

    component.thing = things.data[0];
    spyOn(component, 'updateTask');
    spyOn(component, 'createTask');
    component.onSubmit(component.triggeredTaskForm);

    component.editMode = true;
    component.onSubmit(component.triggeredTaskForm);
  }));


  it('Submit form', fakeAsync(() => {

    component.scenario = scenarios.data[0];

    component.onStatusToApplyChange({on: true}, "thing");
    tick(3000);
    component.onStatusToApplyChange({on: true}, "thingCompare");
  }));

  it('Active zone', fakeAsync(() => {
    spyOn(component, 'loadThingStatus');
    component.activething(things.data[0], 1);
    tick(3000);

    component.activething(things.data[0], 2);
    tick(3000);
  }));


  it('Active Scenario', fakeAsync(() => {
    component.activescenario(scenarios.data[0], 1);
    tick(3000);
  }));

  it('Choose Option', fakeAsync(() => {
    component.choose_option();
    tick(3000);
  }));

  it('Set Operator ', fakeAsync(() => {
    spyOn(component, 'loadThingStatus');
    component.setOperator("==");
  }));


});
