import {IonicModule, NavController, Navbar, NavParams, Alert} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {async, TestBed, tick} from '@angular/core/testing';

import {
  AlertMock,
  HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock, TranslateMock
} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {FormArray, FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {Translate} from "../../../helpers/Translate";
import {NewThingPage} from "./new";
import {fakeAsync} from "@angular/core/testing";

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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewThingPage,
      ],
      imports: [
        IonicModule.forRoot(NewThingPage)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {provide: NavController, useClass: NavMock},
        {provide: Storage, useClass: StorageMock},
        {provide: NavParams, useClass: NavParamsMock},
        {provide: Navbar, useClass: NavBarMock},
        {provide: Translate, useClass: TranslateMock},
        {provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        {provide: Alert, useClass: AlertMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(NewThingPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    // translate = TestBed.get(Translate)
    navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    // spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof NewThingPage).toBe(true);
  });

  it('Load page', fakeAsync(() => {

    spyOn(navParams, 'get').and.callFake(function (arg) {
      if (arg === 'room') {
        return rooms.data[0];
      }
    });

    component.ionViewWillEnter();
    tick(8000);

    expect(component.loading).toBe(false);
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
    spyOn(component, 'createThing');

    component.onSubmit(component.thingForm);
    tick(3000);

    expect(component.createThing).toHaveBeenCalled();

  }));

  it('Status change', () => {
    let status = {on: true};

    spyOn(component, 'putStatus').and.returnValue(Promise.resolve(status));
    component.onStatusChange(status);
    expect(component.putStatus).toHaveBeenCalled();
  });

  it('Choose Type', () => {
    let option = {
      icon: "2",
      readOnly: false,
      subTypes: ["rest"],
      type: "Things::Light"
    };
    component.chooseType(option);
    expect(component.thingForm.controls['type'].value).toBe("Things::Light");
  });


  it('Choose SubType', () => {
    let option = "rest";
    component.chooseSubType(option);
    expect(component.thingForm.controls['subtype'].value).toBe("rest");
  });

  it('Discover Devices', fakeAsync(() => {
    let discovered = {
      data: [{
        address: "homewatch-hub.local",
        port: "3001",
        type: "Things::Light",
        subtype: "rest"
      }]
    };
    spyOn(component, 'presentAlert');
    spyOn(component, 'discoverThingsAPI').and.returnValue(Promise.resolve(discovered));
    tick(20000);
    component.discoverDevices();

    tick(20000);
    expect(component.presentAlert).toHaveBeenCalled();
  }));


  it('Popover Data', fakeAsync(() => {
    let discovered = {
      data: [{
        address: "homewatch-hub.local",
        port: "3001",
        type: "Things::Light",
        subtype: "rest"
      }]
    };

    component.popoverCallback(discovered.data);

    tick(20000);
    expect(component.renderName).toBe(true);
  }));


});
