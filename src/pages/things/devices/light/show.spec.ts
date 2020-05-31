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
import {ShowLightPage} from "./show";

describe('Light - ', () => {
  let fixture;
  let component;
  // let nav;
  // let navParams;
  // let translate;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowLightPage
      ],
      imports: [
        IonicModule.forRoot(ShowLightPage)
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

    fixture = TestBed.createComponent(ShowLightPage);
    component = fixture.componentInstance;
    // nav = TestBed.get(NavController);
    // navParams = TestBed.get(NavParams);
  });

  it('Component should be created', () => {
    expect(component instanceof ShowLightPage).toBe(true);
  });

  it('Switch to on and off', fakeAsync(() => {
    component.type = 'thing';
    component.status = {on: true};
    component.switch_on_off();
    tick(3000);

    component.type = 'thing';
    component.status = {on: false};
    spyOn(component, 'onStatusChange');
    component.switch_on_off();
    tick(3000);
    expect(component.onStatusChange).toHaveBeenCalled()

    component.type = 'thingCompare';
    component.statusCompare = {on: true};

    component.switch_on_off();
    tick(3000);


    component.type = 'thingCompare';
    component.statusCompare = {on: false};
    spyOn(component, 'onStatusChangeCompare');
    component.switch_on_off();
    tick(3000);
    expect(component.onStatusChangeCompare).toHaveBeenCalled()

  }));


  // it('Default Status', () => {
  //   component.defaultStatus();
  //   expect(Object.assign({},component.status)).toEqual (Object.assign({}, {on: true}));
  // });
  //
  // it('Default Status Compare', () => {
  //   component.defaultStatusCompare();
  //   expect(Object.assign({},component.statusCompare)).toEqual (Object.assign({}, {on: true}));
  // });

});
