import {IonicModule, NavController, NavParams/*, ToastController*/} from "ionic-angular";
import { Storage } from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {SignUpPage} from "./sign-up";
import {HomewatchApiServiceMock, NavMock, NavParamsMock, StorageMock} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {FormArray, FormBuilder} from "@angular/forms";
import {LoginPage} from "../login/login";
import {Homepage} from "../homepage/homepage";

describe('SignUp', () => {
  let fixture;
  let component;
let nav;
  let storage;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SignUpPage
      ],
      imports: [
        IonicModule.forRoot(SignUpPage)
      ],
      providers: [
        { provide: NavController, useClass: NavMock},
        { provide: Storage, useClass: StorageMock},
        { provide: NavParams, useClass: NavParamsMock},
        { provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(SignUpPage);
    component = fixture.componentInstance;

    //tirar do beforeeach
    nav = TestBed.get(NavController);
    spyOn(nav, 'setRoot');
    spyOn(nav, 'push');

    storage = TestBed.get(Storage);
  });

  it('Component should be created', () => {
    expect(component instanceof SignUpPage).toBe(true);
  });

  it('Load page',() => {
    spyOn(storage, 'get').and.returnValue(Promise.resolve(null));
    component.ionViewWillEnter();
    expect(component.theme).toBe('default');
  });


  it('Sign a User',fakeAsync(() => {
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

    //criar o formulário
    component.signUpForm.controls['name'].setValue("Leonel");
    component.signUpForm.controls['email'].setValue("test@test.com");
    component.signUpForm.controls['city'].setValue("Lisboa");
    let control = <FormArray>component.signUpForm.controls['passwords'];
    control.controls['password'].setValue("1234");
    control.controls['password_confirmation'].setValue("1234");
    expect(component.signUpForm.valid).toBeTruthy();


    //spy na api de forma a não invocar a mesma, e retornar-lhe um valor de resposta
    spyOn(component, 'registerUser').and.returnValue(Promise.resolve(user));
    tick(1000)
    spyOn(component, 'createSettingOnUser').and.returnValue(Promise.resolve(user));


    //executar a função
    component.onSubmit(component.signUpForm);

    fixture.detectChanges();

    //testes
    expect(component.registerUser).toHaveBeenCalled();
    tick(1000)
    expect(component.createSettingOnUser).toHaveBeenCalledWith(setting);
    tick(1000)
    expect(nav.setRoot).toHaveBeenCalledWith(Homepage, {user: user.data});

  }));

  it('Go to Login Page',() => {
    component.goToLogin();
    expect(nav.push).toHaveBeenCalledWith(LoginPage)
  });

  it('Submit failed',() => {
    //criar o formulário
    component.signUpForm.controls['name'].setValue("Leonel");
    component.signUpForm.controls['email'].setValue("test@test.com");
    component.signUpForm.controls['city'].setValue("Lisboa");
    let control = <FormArray>component.signUpForm.controls['passwords'];
    control.controls['password'].setValue("1234");
    control.controls['password_confirmation'].setValue("1234");

    spyOn(window, 'alert');
    spyOn(component, 'registerUser').and.throwError('My Error');
    fixture.detectChanges();

    //executar a função
    component.onSubmit(component.signUpForm);
    fixture.detectChanges();

    expect(window.alert).toHaveBeenCalledWith('Something went wrong!');
  });



});
