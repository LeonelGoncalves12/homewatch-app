// import { Component, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import {IonicStorageModule, Storage} from "@ionic/storage";
import {IonicModule, Nav, NavParams, Platform/*, ToastController*/} from "ionic-angular";
import {MyApp} from "./app.component";
import {
  HomewatchApiServiceMock, NavMock, PlatformMock, SplashScreenMock, StatusBarMock, StorageMock,
  TranslateMock
} from "../../test-config/mocks-ionic";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {Translate} from "../helpers/Translate";
import {HomewatchApiService} from "../services/homewatch_api";
import {EditProfilePage} from "../pages/users/sign-up/edit";
import {LoginPage} from "../pages/users/login/login";
import {BrowserDynamicTestingModule} from "@angular/platform-browser-dynamic/testing";


describe('MyApp', () => {
  let fixture;
  let component;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp,LoginPage,EditProfilePage
      ],
      imports: [
        IonicModule.forRoot(MyApp),
        IonicStorageModule.forRoot({
          name: "__homewatchdb",
          driverOrder: ["sqlite", "indexeddb", "websql"]
        })
      ],
      providers: [
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock },
        { provide: Translate, useClass: TranslateMock},
        { provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        { provide: Storage, useClass: StorageMock},
        { provide: Nav, useClass: NavMock},
        { provide: NavParams, useClass: class { NavParams = jasmine.createSpy('NavParams'); } }
      ]
    }).overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [LoginPage,EditProfilePage ] } });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;

  });

  it('Component should be created', () => {
    expect(component instanceof MyApp).toBe(true);
  });


  it('Redirect to Login Page', fakeAsync(() => {
    let storage = TestBed.get(Storage)
    let page = { title: "Logout", component: LoginPage, icon: "exit", method: "setRoot" };
    spyOn(component.nav, 'setRoot');
    spyOn(storage, 'remove');


    component.openPage(page);
    tick(4000);
    expect(component.nav.setRoot).toHaveBeenCalledWith(LoginPage);
  }));

  it('Redirect to Edit Page', () => {
    let page = { title: "Profile", component: EditProfilePage, icon: "person", method: "push" };
    spyOn(component.nav, 'push');

    component.openPage(page);
    expect(component.nav.push).toHaveBeenCalledWith(EditProfilePage);
  });

});
