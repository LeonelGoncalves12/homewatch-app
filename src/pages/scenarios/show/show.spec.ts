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
import {ShowScenarioPage} from "./show";
import {ThingsTranslator} from "../../../helpers/ThingsTranslator";
import {NewScenarioThingPage} from "../../scenario_things/new/new";





describe('Show Scenario Thing - ', () => {
  let fixture;
  let component;
  let nav;
  // let navParams;
  // let translate;
  let thingsTranslator;
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
      declarations: [ShowScenarioPage
      ],
      imports: [
        IonicModule.forRoot(ShowScenarioPage)
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

    fixture = TestBed.createComponent(ShowScenarioPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    thingsTranslator = TestBed.get(ThingsTranslator);
    // translate = TestBed.get(Translate)
    // navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof ShowScenarioPage).toBe(true);
  });


  it('Load page',fakeAsync(() => {
    spyOn(component, 'listScenarioThingsAPI').and.returnValue(Promise.resolve(scenarioThings));
    spyOn(thingsTranslator, 'getThingAction').and.returnValue(Promise.resolve("Turn on the light"));
    component.ionViewWillEnter();
    tick(3000);

    expect(component.loading).toBe(false)
  }));


  it('New Scenario Thing',() => {
    component.home=homes.data[0];
    component.scenario = scenarios.data[0];
    component.scenarioThings = scenarioThings.data;
    component.newScenarioThing();

    expect(nav.push).toHaveBeenCalledWith(NewScenarioThingPage,  {home:homes.data[0], scenario:scenarios.data[0], selectedThings:component.scenarioThings});
  });

  it('Edit Scenario Thing',() => {
    component.home=homes.data[0];
    component.scenario = scenarios.data[0];
    component.scenarioThings = scenarioThings.data;
    component.editScenarioThing(scenarioThings.data[0]);

    expect(nav.push).toHaveBeenCalledWith(NewScenarioThingPage,  {home:homes.data[0], scenario:scenarios.data[0], selectedThings:component.scenarioThings, scenarioThing:scenarioThings.data[0]});
  });
});
