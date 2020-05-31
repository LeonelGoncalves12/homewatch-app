import {IonicModule, NavController, Navbar, NavParams} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {async, TestBed} from '@angular/core/testing';

import {
  HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock
} from "../../../../../test-config/mocks-ionic";
import {FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {ListTimedTasksPage} from "./list";
import {HomewatchApiService} from "../../../../services/homewatch_api";
import {NewTimedTaskPage} from "../new/new";


describe('List Tasks', () => {
  let fixture;
  let component;
  let nav;
  // let navParams;
  // let translate;

  let changes = {
    tasks: {
      currentValue: [{
        count: 3,
        cron: "15 * * * *",
        display: "há 4 meses",
        id: 7,
        next_run: "2019-12-14T01:15:00.000Z",
        ThingsStatus: {
          0: {statusText: "Ligue Economic Light na Cozinha"},
          1: {statusText: "Ligue Light na Sala de Jantar"},
          2: {statusText: "Desligue Lâmpada na Sala de estar"}
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
    },
    firstChange: true
  };

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListTimedTasksPage
      ],
      imports: [
        IonicModule.forRoot(ListTimedTasksPage)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: Storage, useClass: StorageMock},
        {provide: NavParams, useClass: NavParamsMock},
        {provide: Navbar, useClass: NavBarMock},
        {provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(ListTimedTasksPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    // navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof ListTimedTasksPage).toBe(true);
  });

  it('Choose Type', () => {
    component.chooseType('thing');
    expect(component.typeIndex).toBe('things');

    component.chooseType('scenario');
    expect(component.typeIndex).toBe('scenarios');
  });

  it('On change', () => {

    component.ngOnChanges(changes);
    expect(component.timed_tasks).toBe(changes.tasks.currentValue);
  });


  it('Go to Timed Task', () => {
    component.home = homes.data[0];
    component.editTimedTask(changes.tasks.currentValue[0]);
    expect(nav.push).toHaveBeenCalledWith(NewTimedTaskPage, {home:homes.data[0], timed_task: changes.tasks.currentValue[0]})
  });

});
