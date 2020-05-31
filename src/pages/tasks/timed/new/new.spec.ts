import {IonicModule, NavController, Navbar, NavParams} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {
  HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock, TranslateMock
} from "../../../../../test-config/mocks-ionic";
import {FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {HomewatchApiService} from "../../../../services/homewatch_api";
import {NewTimedTaskPage} from "./new";
import {Translate} from "../../../../helpers/Translate";
import {ShowLightPage} from "../../../things/devices/light/show";
import {BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";


describe('List Tasks', () => {
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
      status_to_apply: {on: true},
      statusText: "Turn on Economic Light on Kitchen",
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


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewTimedTaskPage,
        ShowLightPage
      ],
      imports: [
        IonicModule.forRoot(NewTimedTaskPage)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: Storage, useClass: StorageMock},
        {provide: NavParams, useClass: NavParamsMock},
        {provide: Navbar, useClass: NavBarMock},
        { provide: Translate, useClass: TranslateMock},
        {provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    }).overrideModule(BrowserDynamicTestingModule, {set: {entryComponents: [ShowLightPage]}});
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(NewTimedTaskPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof NewTimedTaskPage).toBe(true);
  });

  it('Load page with thing', fakeAsync(() => {
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(navParams, 'get').and.returnValue(timedTasks.data[0]);

    fixture.detectChanges();
    component.ionViewWillEnter();

    tick(3000)
  }));


  it('Load page with scenario', fakeAsync(() => {
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(navParams, 'get').and.returnValue(timedTasks2.data[0]);

    fixture.detectChanges();
    component.ionViewWillEnter();

    tick(3000)
  }));


  it('Submit form', fakeAsync(() => {
    component.timedTaskForm.controls['id'].setValue("1");
    component.timedTaskForm.controls['thing_id'].setValue("11");
    component.timedTaskForm.controls['status'].setValue({on:true});
    component.timedTaskForm.controls['cron'].setValue("15 * * * *");

    spyOn(component, 'updateTask');
    spyOn(component, 'createTask');
    component.onSubmit(component.timedTaskForm);
    component.editMode = true;
    component.onSubmit(component.timedTaskForm);
  }));

  it('Choose Index', fakeAsync(() => {

    component.chooseIndex(1 , 'minute');
    expect(component.intervalMinutes).toBe(1);

    component.chooseIndex(1 , 'minuteStart');
    expect(component.startAtMinutes).toBe(1);

    component.chooseIndex(1 , 'hour');
    expect(component.intervalHours).toBe(1);

    component.chooseIndex(1 , 'hourStart');
    expect(component.startAtHours).toBe(1);

    component.chooseIndex(1 , 'month');
    expect(component.intervalMonths).toBe(1);

    component.chooseIndex(1 , 'monthStart');
    expect(component.startAtMonths).toBe(1);

    component.chooseIndex(1 , 'dayMonth');
    expect(component.intervalDaysMonth).toBe(1);

    component.chooseIndex(1 , 'dayMonthStart');
    expect(component.startAtDaysMonth).toBe(1);

    component.chooseIndex("Tuesday" , 'dayWeek');
    expect(component.intervalDaysWeek).toBe("Tuesday");

    component.chooseIndex("Tuesday" , 'dayWeekStart');
    expect(component.startAtDayWeek).toBe("Tuesday");
  }));

  it('Apply Change', fakeAsync(() => {
    component.timedTaskForm.controls['id'].setValue("1");
    component.timedTaskForm.controls['thing_id'].setValue("11");
    component.timedTaskForm.controls['status'].setValue({on:true});
    component.timedTaskForm.controls['cron'].setValue("15 * * * *");

    component.onToApplyChange("thing")
  }));

  it('Active', fakeAsync(() => {
    component.active("minutes", 20);
    component.active("hours", 20);
    component.active("daysMonth", 20);
    component.active("months", 4);
    component.active("daysWeek", 2)
  }));

  it('Interval', fakeAsync(() => {
    component.interval("minutes", 20, "intervalMinutes");
    component.interval("minutes", 20, "startAt");

    component.interval("hours", 20, "intervalMinutes");
    component.interval("hours", 20, "startAt");

    component.interval("daysMonth", 20, "intervalMinutes");
    component.interval("daysMonth", 20, "startAt");

    component.interval("months", 4, "intervalMinutes");
    component.interval("months", 4, "startAt");

    component.interval("daysWeek", 2, "intervalMinutes");
    component.interval("daysWeek", 2, "startAt");
  }));

  it('Interval', fakeAsync(() => {
    component.convertDay('Monday');
    component.convertDay('Tuesday');
    component.convertDay('Wednesday');
    component.convertDay('Thursday');
    component.convertDay('Friday');
    component.convertDay('Saturday');

  }));

  it('Active thing', fakeAsync(() => {
    spyOn(component, 'loadThingStatus');
    component.activething(timedTasks.data[0].thing);
    expect(component.indexThing).toBe(11);
  }));


  it('Active scenario', fakeAsync(() => {
    component.activescenario(timedTasks2.data[0].scenario);
    expect(component.indexScenario).toBe(2);
  }));


});
