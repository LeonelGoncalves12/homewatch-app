import {IonicModule, NavController, Navbar, NavParams} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {
  HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock, TranslateMock,
} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {Translate} from "../../../helpers/Translate";
import {NewScenarioPage} from "./new";



describe('New Scenario Thing - ', () => {
  let fixture;
  let component;
  let nav;
  let navParams;
  // let translate;
  // //
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
      scenario:{
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
      }
    }]
  };


  let triggeredTasks ={
    data: [{
      comparator: "==",
      id: 7,
      status_to_compare: {targetTemperature: 20},
      scenario:{
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewScenarioPage
      ],
      imports: [
        IonicModule.forRoot(NewScenarioPage)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: Storage, useClass: StorageMock},
        {provide: NavParams, useClass: NavParamsMock},
        {provide: Navbar, useClass: NavBarMock},
        {provide: Translate, useClass: TranslateMock},
        {provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(NewScenarioPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof NewScenarioPage).toBe(true);
  });


  it('Load page',fakeAsync(() => {
    let navParamsSpy = spyOn(navParams, 'get');
    navParamsSpy.and.returnValue(homes.data[0]);
    navParamsSpy.and.returnValue("green");
    navParamsSpy.and.returnValue(scenarios.data[0]);
    // spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(component, 'listTimedTasksAPI').and.returnValue(Promise.resolve(timedTasks));
    spyOn(component, 'listTriggeredTasksAPI').and.returnValue(Promise.resolve(triggeredTasks));
    component.ionViewWillEnter();
    tick(3000);
    expect(component.scenarioForm.controls['id'].value).toBe(2);
    expect(component.scenarioForm.controls['name'].value).toBe("Turn on all lights");
    expect(component.scenarioForm.controls['icon'].value).toBe('2');

    expect(component.using).toBe(true)
  }));

  it('Choose Icon', () => {
    component.chooseIcon("3")
    expect(component.scenarioForm.controls['icon'].value).toBe('3');
  });




});
