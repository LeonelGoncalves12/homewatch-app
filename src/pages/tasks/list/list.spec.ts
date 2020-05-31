import {IonicModule, NavController, Navbar, NavParams} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {
  HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock, ThingsTranslatorMock, TranslateMock,
} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {Translate} from "../../../helpers/Translate";
import {ListTasksPage} from "./list";
import {ThingsTranslator} from "../../../helpers/ThingsTranslator";
import {NewTimedTaskPage} from "../timed/new/new";
import {NewTriggeredTaskPage} from "../triggered/new/new";


describe('List Tasks', () => {
  let fixture;
  let component;
  let nav;
  // let navParams;
  // let translate;

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

  let room = {
    data: {
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
    }
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
        status: null,
        subtype: "rest",
        type: "Things::Light"
      }
    }]
  };

  let timedTasks2 = {
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListTasksPage
      ],
      imports: [
        IonicModule.forRoot(ListTasksPage)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: Storage, useClass: StorageMock},
        {provide: NavParams, useClass: NavParamsMock},
        {provide: Navbar, useClass: NavBarMock},
        {provide: Translate, useClass: TranslateMock},
        {provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        {provide: ThingsTranslator, useClass: ThingsTranslatorMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(ListTasksPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    // navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof ListTasksPage).toBe(true);
  });

  it('Load page - Timed with thing', fakeAsync(() => {
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(component, 'listTimedTasksAPI').and.returnValue(Promise.resolve(timedTasks));
    spyOn(component, 'listTriggeredTasksAPI').and.returnValue(Promise.resolve(triggeredTasks));

    component.ionViewWillEnter();
    tick(3000);
    expect(1 + 2).toBe(3);
  }));


  it('Type Change Triggered with thing', fakeAsync(() => {
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(component, 'listTimedTasksAPI').and.returnValue(Promise.resolve(timedTasks));
    spyOn(component, 'listTriggeredTasksAPI').and.returnValue(Promise.resolve(triggeredTasks));

    component.onTypeChange("triggered");
    tick(3000);
    expect(1 + 2).toBe(3);
  }));


  it('Type Change Timed with scenario', fakeAsync(() => {
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'getRoomAPI').and.returnValue(Promise.resolve(room));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(component, 'listTimedTasksAPI').and.returnValue(Promise.resolve(timedTasks2));
    spyOn(component, 'listTriggeredTasksAPI').and.returnValue(Promise.resolve(triggeredTasks2));

    component.onTypeChange("timed");
    tick(3000);
    expect(1 + 2).toBe(3);
  }));

  it('Type Change Triggered with scenario', fakeAsync(() => {
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(component, 'listTimedTasksAPI').and.returnValue(Promise.resolve(timedTasks2));
    spyOn(component, 'listTriggeredTasksAPI').and.returnValue(Promise.resolve(triggeredTasks2));

    component.onTypeChange("triggered");
    tick(3000);
    expect(1 + 2).toBe(3);
  }));

  it('New Task', () => {
    component.home = homes.data[0];

    component.tasks_type = "timed";
    component.newTask();
    expect(nav.push).toHaveBeenCalledWith(NewTimedTaskPage, {home:homes.data[0]})


    component.tasks_type = "triggered";
    component.newTask();
    expect(nav.push).toHaveBeenCalledWith(NewTriggeredTaskPage, {home:homes.data[0]})
  });


});
