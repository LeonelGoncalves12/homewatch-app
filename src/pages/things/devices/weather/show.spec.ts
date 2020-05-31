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
import { ShowWeatherPage} from "./show";

describe('Weather - ', () => {
  let fixture;
  let component;
  // let nav;
  // let navParams;
  // let translate;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowWeatherPage
      ],
      imports: [
        IonicModule.forRoot(ShowWeatherPage)
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

    fixture = TestBed.createComponent(ShowWeatherPage);
    component = fixture.componentInstance;
    // nav = TestBed.get(NavController);
    // navParams = TestBed.get(NavParams);
  });

  it('Component should be created', () => {
    expect(component instanceof ShowWeatherPage).toBe(true);
  });

  it('Choose Index', fakeAsync(() => {

    component.statusCompare={
      cloudy: false,
      raining: false,
      temperature: 11,
      windSpeed: 51
    };
    component.chooseIndex(12, 'temperature');
    tick(3000);
    expect(component.statusCompare.temperature).toBe(12);

    component.chooseIndex(40, 'windSpeed');
    tick(3000);
    expect(component.statusCompare.windSpeed).toBe(40);

  }));

  it('Choose Type', fakeAsync(() => {

    component.statusCompare={
      cloudy: false,
      raining: false,
      temperature: 11,
      windSpeed: 51
    };
    spyOn(component,'setStatus');

    component.chooseSensor('temperature');
    expect(component.setStatus).toHaveBeenCalled();
    component.chooseSensor('windSpeed');
    expect(component.setStatus).toHaveBeenCalled();
    component.chooseSensor('cloudy');
    expect(component.setStatus).toHaveBeenCalled();
    component.chooseSensor('raining');
    tick(3000);
    expect(component.setStatus).toHaveBeenCalled();


  }));

  it('Default Status', () => {
    component.defaultStatus();
    expect(Object.assign({},component.status)).toEqual (Object.assign({}, {
      cloudy: false,
      raining: false,
      temperature: 0,
      windSpeed: 0
    }));
  });

  it('Default Status Compare', () => {
    component.defaultStatusCompare();
    expect(Object.assign({},component.statusCompare)).toEqual (Object.assign({}, {
      cloudy: false,
      raining: false,
      temperature: 11,
      windSpeed: 51
    }));
  });

});
