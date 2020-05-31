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
import {ListScenariosPage} from "./list";
import {NewScenarioPage} from "../new/new";
import {ShowScenarioPage} from "../show/show";


describe('List Scenario Things - ', () => {
  let fixture;
  let component;
  let nav;
  // let navParams;
  // let translate;
  //
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

  let scenarioThings = {
    data: [{
      id: 3,
      status: {on: true},
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
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListScenariosPage
      ],
      imports: [
        IonicModule.forRoot(ListScenariosPage)
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

    fixture = TestBed.createComponent(ListScenariosPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    // navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof ListScenariosPage).toBe(true);
  });


  it('Load page',fakeAsync(() => {
    spyOn(component, 'listScenariosAPI').and.returnValue(Promise.resolve(scenarios));
    spyOn(component, 'listScenarioThingsAPI').and.returnValue(Promise.resolve(scenarioThings));

    component.ionViewWillEnter();
    tick(3000);
    expect(component.loading).toBe(false);
  }));

  it('Choose scenario',fakeAsync(() => {
    spyOn(component, 'listScenarioThingsAPI').and.returnValue(Promise.resolve(scenarioThings));

    component.chooseScenario(scenarios.data[0]);
    tick(3000);
    expect(component.scenarioThings).toBe(scenarioThings.data);
  }));

  it('Go To Show Scenario', () => {
    component.home = homes.data[0];
    component.showScenario(scenarios.data[0]);
    expect(nav.push).toHaveBeenCalledWith(ShowScenarioPage,  {home:homes.data[0], scenario:scenarios.data[0]});
  });

  it('Go To New Scenario', () => {
    component.home = homes.data[0];
    component.newScenario();
    expect(nav.push).toHaveBeenCalledWith(NewScenarioPage,  {home:homes.data[0]});
  });
  it('Go To Edit Scenario', () => {
    component.home = homes.data[0];
    component.editScenario(scenarios.data[0]);
    expect(nav.push).toHaveBeenCalledWith(NewScenarioPage,  {home:homes.data[0], scenario:scenarios.data[0]});
  });

});
