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
import { ShowMotionSensorPage} from "./show";

describe('Motion Sensor - ', () => {
  let fixture;
  let component;
  // let nav;
  // let navParams;
  // let translate;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowMotionSensorPage
      ],
      imports: [
        IonicModule.forRoot(ShowMotionSensorPage)
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

    fixture = TestBed.createComponent(ShowMotionSensorPage);
    component = fixture.componentInstance;
    // nav = TestBed.get(NavController);
    // navParams = TestBed.get(NavParams);
  });

  it('Component should be created', () => {
    expect(component instanceof ShowMotionSensorPage).toBe(true);
  });

  it('Switch to on and off', fakeAsync(() => {
    component.type = 'thing';
    component.status = {movement: true};
    spyOn(component, 'onStatusChange');
    component.switchStatus();
    tick(3000);

    component.type = 'thing';
    component.status = {movement: false};
    component.switchStatus();
    tick(3000);


    component.type = 'thingCompare';
    component.statusCompare = {movement: true};
    spyOn(component, 'onStatusChangeCompare');
    component.switchStatus();
    tick(3000);
    expect(component.onStatusChangeCompare).toHaveBeenCalled()

    component.type = 'thingCompare';
    component.statusCompare = {movement: false};
    component.switchStatus();
    tick(3000);
    expect(component.onStatusChangeCompare).toHaveBeenCalled()

  }));


  it('Default Status', () => {
    component.defaultStatus();
    expect(Object.assign({},component.status)).toEqual (Object.assign({}, {movement: false}));
  });

  it('Default Status Compare', () => {
    component.defaultStatusCompare();
    expect(Object.assign({},component.statusCompare)).toEqual (Object.assign({}, {movement: false}));
  });

});
