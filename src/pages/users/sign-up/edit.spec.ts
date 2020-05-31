import {IonicModule, NavController, NavParams/*, ToastController*/} from "ionic-angular";
import { Storage } from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {
  ConfigMock, HomewatchApiServiceMock, NavMock, NavParamsMock,
  StorageMock
} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import {FormArray, FormBuilder} from "@angular/forms";
import {Homepage} from "../homepage/homepage";
import {EditProfilePage} from "./edit";
import {Config} from "../../../config";


describe('Edit', () => {
  let fixture;
  let component;
  let nav;
  let storage;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditProfilePage
      ],
      imports: [
        IonicModule.forRoot(EditProfilePage)
      ],
      providers: [
        { provide: NavController, useClass: NavMock},
        { provide: Storage, useClass: StorageMock},
        { provide: NavParams, useClass: NavParamsMock},
        { provide: Config, useClass: ConfigMock},
        { provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(EditProfilePage);
    component = fixture.componentInstance;

    //tirar do beforeeach
    nav = TestBed.get(NavController);
    spyOn(nav, 'setRoot');
    spyOn(nav, 'push');

    storage = TestBed.get(Storage);
  });

  it('Component should be created', () => {
    expect(component instanceof EditProfilePage).toBe(true);
  });

  it('Load theme default',() => {
    spyOn(storage, 'get').and.returnValue(Promise.resolve(null));
    component.ionViewWillEnter();
    expect(component.theme).toBe('default');
  });

  it('Edit a User',fakeAsync(() => {
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

    //criar o formulário
    component.signUpForm.controls['name'].setValue("Leonel");
    component.signUpForm.controls['email'].setValue("test@test.com");
    component.signUpForm.controls['city'].setValue("Lisboa");
    let control = <FormArray>component.signUpForm.controls['passwords'];
    control.controls['password'].setValue("1234");
    control.controls['password_confirmation'].setValue("1234");
    expect(component.signUpForm.valid).toBeTruthy();


    //spy na api de forma a não invocar a mesma, e retornar-lhe um valor de resposta
    spyOn(component, 'updateCurrentUser').and.returnValue(Promise.resolve(user));
    tick(1000);

    //executar a função
    component.onSubmit(component.signUpForm);

    fixture.detectChanges();

    //testes
    expect(component.updateCurrentUser).toHaveBeenCalled();
    tick(1000);
    expect(nav.setRoot).toHaveBeenCalledWith(Homepage, {user: user.data});

  }));

  it('Get Location',fakeAsync(() => {
    let geolocation = {
      coords : {
        latitude: 41.260470399999996,
        longitude:-7.600589200000001
      }
    };
    // spyOn(GeolocationHelper,'getLocation').and.callThrough();
    tick(3000);

    spyOn(component, 'getPosition').and.returnValue(geolocation);
    tick(1000);
    spyOn(component, 'getCity')
    spyOn(component,'subscribeOnPosition').and.returnValue( { subscribe: (data) => {
      if(data.coords != null){
        this.getCity(data.coords.latitude.toFixed(3) + ',' + data.coords.longitude.toFixed(3));
      }
    } } );
    tick(1000);
    component.getLocation();
    tick(3000);

    //TODO corrigir isto vvv
    //expect(component.getCity).toHaveBeenCalled();


    tick(3000);
    expect(component.subscribeOnPosition).toHaveBeenCalled();

    tick(1000);
    expect(component.getPosition).toHaveBeenCalled();
  }));

});
