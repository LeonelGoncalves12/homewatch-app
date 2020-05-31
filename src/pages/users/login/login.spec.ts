import {IonicModule, NavController, Navbar,NavParams} from "ionic-angular";
import { Storage } from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {
  ConfigMock, HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock, OneSignalMock,
  StorageMock, TranslateMock
} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import { FormBuilder} from "@angular/forms";
import {Config} from "../../../config";
import {Translate} from "../../../helpers/Translate";
import {LoginPage} from "./login";
import {OneSignal} from "@ionic-native/onesignal/ngx";
import {Homepage} from "../homepage/homepage";
import {SignUpPage} from "../sign-up/sign-up";

describe('Login', () => {
  let fixture;
  let component;
  let nav;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginPage
      ],
      imports: [
        IonicModule.forRoot(LoginPage)
      ],
      providers: [
        { provide: NavController, useClass: NavMock},
        { provide: Storage, useClass: StorageMock},
        { provide: NavParams, useClass: NavParamsMock},
        { provide: Config, useClass: ConfigMock},
        { provide: Translate, useClass: TranslateMock},
        { provide: Navbar, useClass: NavBarMock},
        { provide: OneSignal, useClass: OneSignalMock},
        { provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(LoginPage);
    component = fixture.componentInstance;

    //tirar do beforeeach

    // navbar = TestBed.get(Navbar);

    // storage = TestBed.get(Storage);
  });

  it('Component should be created', () => {
    expect(component instanceof LoginPage).toBe(true);
  });

  it('View Loaded',fakeAsync(() => {

     nav = TestBed.get(NavController);

    let user = {
        id: 1,
        name: "Leonel",
        email: "test@test.com",
        city: "Lisboa",
        jwt: "token"
    };
    spyOn(nav, 'setRoot');
    tick(1000);
    spyOn(component.homewatchApi,'setAuth').and.returnValue(Promise.resolve(true));
    tick(1000);
    spyOn(component,'getTheme');

    spyOn(component.storage,'get').and.returnValue(user);
    tick(1000);

    component.ionViewDidLoad();
    tick(1000);

    expect(nav.setRoot).toHaveBeenCalledWith(Homepage, {user})
    expect(component.homewatchApi.setAuth).toHaveBeenCalled();

  }));


  it('Login a User',fakeAsync(() => {
    //variáveis a utilizar

    let user = {
      data: {
        id: 1,
        name: "Leonel",
        email: "test@test.com",
        city: "Lisboa",
        jwt: "token"
      }
    };

    let setting = {
      user_id: user.data.id,
      timed_tasks_not: "1",
      triggered_tasks_not: "1",
      theme: "default",
      language: "en"
    };
    nav = TestBed.get(NavController);


    //criar o formulário
    component.loginForm.controls['password'].setValue("Leonel");
    component.loginForm.controls['email'].setValue("test@test.com");
    expect(component.loginForm.valid).toBeTruthy();


    spyOn(component, 'getSettings').and.returnValue(Promise.resolve(setting));

    spyOn(component, 'login').and.returnValue(Promise.resolve(user));
    tick(1000);
    spyOn(nav, 'setRoot');

    //executar a função
    component.onSubmit(component.loginForm);
    tick(1000);
    fixture.detectChanges();

    //testes
    tick(1000);
    expect(component.login).toHaveBeenCalled();
    tick(1000);
    expect(nav.setRoot).toHaveBeenCalledWith(Homepage, {user: user.data});
    tick(1000);
    expect(component.getSettings).toHaveBeenCalled();

    expect(component.theme).toBe('default');
  }));

  it('Go to Signup', () => {
    nav = TestBed.get(NavController);
    spyOn(nav, 'push');
    component.goToSignUp();
    expect(nav.push).toHaveBeenCalledWith(SignUpPage)
  });

  it('Submit failed',() => {
    //criar o formulário
    component.loginForm.controls['password'].setValue("Leonel");
    component.loginForm.controls['email'].setValue("test@test.com");

    spyOn(window, 'alert');
    spyOn(component, 'login').and.throwError('My Error');
    fixture.detectChanges();

    //executar a função
    component.onSubmit(component.loginForm);
    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalledWith('Something went wrong!');
  });
});
