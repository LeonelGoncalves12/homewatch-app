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
import {ShowLockPage} from "./show";

describe('Lock - ', () => {
  let fixture;
  let component;
  // let nav;
  // let navParams;
  // let translate;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowLockPage
      ],
      imports: [
        IonicModule.forRoot(ShowLockPage)
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

    fixture = TestBed.createComponent(ShowLockPage);
    component = fixture.componentInstance;
    // nav = TestBed.get(NavController);
    // navParams = TestBed.get(NavParams);
  });

  it('Component should be created', () => {
    expect(component instanceof ShowLockPage).toBe(true);
  });

  it('Switch to on and off', fakeAsync(() => {
    component.type = 'thing';
    component.status = {locked: true};
    spyOn(component, 'onStatusChange');
    component.switch_lock_unlock();
    tick(3000);
    expect(component.onStatusChange).toHaveBeenCalled()

    component.type = 'thing';
    component.status = {locked: false};
    component.switch_lock_unlock();
    tick(3000);
    expect(component.onStatusChange).toHaveBeenCalled()

    component.type = 'thingCompare';
    component.statusCompare = {locked: true};
    spyOn(component, 'onStatusChangeCompare');
    component.switch_lock_unlock();
    tick(3000);
    expect(component.onStatusChangeCompare).toHaveBeenCalled()

    component.type = 'thingCompare';
    component.statusCompare = {locked: false};
    component.switch_lock_unlock();
    tick(3000);
    expect(component.onStatusChangeCompare).toHaveBeenCalled()

  }));


  it('Default Status', () => {
    component.defaultStatus();
    expect(Object.assign({},component.status)).toEqual (Object.assign({}, {locked: true}));
  });

  it('Default Status Compare', () => {
    component.defaultStatusCompare();
    expect(Object.assign({},component.statusCompare)).toEqual (Object.assign({}, {locked: true}));
  });

});
