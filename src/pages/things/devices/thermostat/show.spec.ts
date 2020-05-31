import {IonicModule, NavController, Navbar, NavParams} from "ionic-angular";
import {Storage} from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {
  HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock,
} from "../../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../../services/homewatch_api";
import {FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import { ShowThermostatPage} from "./show";

describe('Motion Sensor - ', () => {
  let fixture;
  let component;
  // let nav;
  // let navParams;
  // let translate;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowThermostatPage
      ],
      imports: [
        IonicModule.forRoot(ShowThermostatPage)
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

    fixture = TestBed.createComponent(ShowThermostatPage);
    component = fixture.componentInstance;
    // nav = TestBed.get(NavController);
    // navParams = TestBed.get(NavParams);
    component.status = {targetTemperature: 12};
    component.statusCompare = {targetTemperature: 12};
  });

  it('Component should be created', () => {
    expect(component instanceof ShowThermostatPage).toBe(true);
  });

  it('Switch to on and off', fakeAsync(() => {
    component.type = 'thing';
    spyOn(component, 'onStatusChange');
    component.chooseIndex(12);
    tick(3000);
    expect(component.onStatusChange).toHaveBeenCalled()


    component.type = 'thingCompare';
    spyOn(component, 'onStatusChangeCompare');
    component.chooseIndex(12);
    tick(3000);
    expect(component.onStatusChangeCompare).toHaveBeenCalled()

  }));


  it('Default Status', () => {
    component.defaultStatus();
    expect(Object.assign({},component.status)).toEqual (Object.assign({}, {targetTemperature: 12}));
  });

  it('Default Status Compare', () => {
    component.defaultStatusCompare();
    expect(Object.assign({},component.statusCompare)).toEqual (Object.assign({}, {targetTemperature: 12}));
  });

});
