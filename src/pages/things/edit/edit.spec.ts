import {IonicModule, NavController, Navbar, NavParams} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {
  HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock, TranslateMock,
} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {FormArray, FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {Translate} from "../../../helpers/Translate";
import {EditThingPage} from "./edit";
import {BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";
import {ShowLightPage} from "../devices/light/show";

describe('New Scenario Thing - ', () => {
  let fixture;
  let component;
  let nav;
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
      status_to_compare: {targetTemperature: 20},
      scenario: {
        home: 1,
        icon: "2",
        id: 2,
        name: "Turn on all lights",
        scenario_things: [{
          id: 9,
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
        id: 19,
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
      declarations: [EditThingPage,
        ShowLightPage
      ],
      imports: [
        IonicModule.forRoot(EditThingPage)
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
    }).overrideModule(BrowserDynamicTestingModule, {set: {entryComponents: [ShowLightPage]}});
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(EditThingPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof EditThingPage).toBe(true);
  });

  it('Load page', fakeAsync(() => {
    spyOn(component, 'listTimedTasksAPI').and.returnValue(Promise.resolve(timedTasks));
    spyOn(component, 'listTriggeredTasksAPI').and.returnValue(Promise.resolve(triggeredTasks));
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));

    spyOn(navParams, 'get').and.callFake(function (arg) {
      if (arg === 'room') {
        return rooms.data[0];
      } else if (arg === 'thing') {
        return things.data[0];
      }
    });


    component.ionViewWillEnter();
    tick(8000);

    expect(component.loading).toBe(false);
  }));

  it('Load page failed', fakeAsync(() => {
    spyOn(navParams, 'get').and.callFake(function (arg) {
      if (arg === 'room') {
        return rooms.data[0];
      } else if (arg === 'thing') {
        return things.data[0];
      }
    });
    spyOn(component, 'checkUsage').and.throwError('My Error');
    component.ionViewWillEnter();
    tick(3000)
    expect(component.failed).toBe(true);

  }));

  it('Leave page', fakeAsync(() => {
    component.editMode = true;
    component.thing = things.data[0];
    component.ionViewWillLeave();
  }));

  it('Submit page', fakeAsync(() => {
    component.thingForm.controls['name'].setValue("Light");
    component.thingForm.controls['type'].setValue("Things::Light");
    component.thingForm.controls['subtype'].setValue("rest");
    component.thingForm.controls['favorite'].setValue("1");
    component.thingForm.controls['extra_info'].setValue("{}");
    let control = <FormArray>component.thingForm.controls['connection_info'];
    control.controls['address'].setValue("homewatch-hub.local");
    control.controls['port'].setValue("3001");
    expect(component.thingForm.valid).toBeTruthy();
    spyOn(component, 'updateThing').and.returnValue(Promise.resolve(things.data[0]));


    component.onSubmit(component.thingForm);
    tick(3000);

  }));

  it('Try Again', () => {
    spyOn(component, 'ionViewWillEnter')
    component.tryAgain();
    expect(component.ionViewWillEnter).toHaveBeenCalled();
  });

  it('Status change', () => {
    let status = {on:true};

    spyOn(component, 'putStatus').and.returnValue(Promise.resolve(status));
    component.onStatusChange(status);
    expect(component.putStatus).toHaveBeenCalled();
  });

});
