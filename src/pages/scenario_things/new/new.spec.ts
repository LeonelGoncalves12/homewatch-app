import {IonicModule, NavController, Navbar, NavParams, Events} from "ionic-angular";
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
import {NewScenarioThingPage} from "./new";
import {ShowLightPage} from "../../things/devices/light/show";
import {BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";


describe('ScenarioThing - ', () => {
  let fixture;
  let component;
  // let nav;
  let navParams;
  // let translate;

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
    let rooms = {
    data :[{
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
    }]
  };
  let scenarioThing = {
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
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewScenarioThingPage,
        ShowLightPage
      ],
      imports: [
        IonicModule.forRoot(NewScenarioThingPage)
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
    }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [ShowLightPage] } });
    ;
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(NewScenarioThingPage);
    component = fixture.componentInstance;
    // nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    navParams = TestBed.get(NavParams);
    // spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof NewScenarioThingPage).toBe(true);
  });

  it('Load page', fakeAsync(() => {
    let events = TestBed.get(Events);
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));

    spyOn(navParams, 'get').and.returnValue(scenarioThing);
    spyOn(events, 'subscribe').and.returnValue({
      subscribe: () => {
        return {on: true}
      }
    });

    component.ionViewWillEnter();
    tick(3000);
    expect(component.scenarioThingForm.controls['id'].value).toBe(3);
    expect(component.scenarioThingForm.controls['thing_id'].value).toBe(11);
    expect(Object.assign({},component.scenarioThingForm.controls['status'].value)).toEqual (Object.assign({}, {on: true}));
  }));


  it('Thing Change', fakeAsync(() => {
    let events = TestBed.get(Events);
    spyOn(events, 'subscribe').and.returnValue({
      subscribe: () => {
        return {on: true}
      }
    });

    component.onThingChange(things.data[0]);
    tick(15000);

    expect(component.scenarioThingForm.controls['thing_id'].value).toBe(11);
  }));

  it('Load page failed', fakeAsync(() => {
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'loadThingStatus').and.throwError('My Error');

    component.ionViewWillEnter();
    tick(3000);
    expect(component.failed).toBe(true);
  }));



});
