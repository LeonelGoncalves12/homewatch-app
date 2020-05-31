import {IonicModule, NavController, Navbar, NavParams} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {async, TestBed} from '@angular/core/testing';

import {
  HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock
} from "../../../../../test-config/mocks-ionic";
import {FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {HomewatchApiService} from "../../../../services/homewatch_api";
import {ListTriggeredTasksPage} from "./list";
import {NewTriggeredTaskPage} from "../new/new";



describe('List Tasks', () => {
  let fixture;
  let component;
  let nav;
  // let navParams;
  // let translate;
  //
  let changes = {
    tasks: {
      currentValue: [{
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
      declarations: [ListTriggeredTasksPage
      ],
      imports: [
        IonicModule.forRoot(ListTriggeredTasksPage)
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

    fixture = TestBed.createComponent(ListTriggeredTasksPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    // navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof ListTriggeredTasksPage).toBe(true);
  });

  it('Choose Type', () => {
    component.chooseType('thing');
    expect(component.typeIndex).toBe('things');

    component.chooseType('scenario');
    expect(component.typeIndex).toBe('scenarios');
  });

  it('On change', () => {
    component.ngOnChanges(changes);
    expect(component.triggered_tasks).toBe(changes.tasks.currentValue);
  });


  it('Go to Timed Task', () => {
    component.home = homes.data[0];
    component.editTriggeredTask(changes.tasks.currentValue[0]);
    expect(nav.push).toHaveBeenCalledWith(NewTriggeredTaskPage, {home:homes.data[0], triggered_task: changes.tasks.currentValue[0]})
  });


});
