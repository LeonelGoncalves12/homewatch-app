import {IonicModule, NavController, Navbar,NavParams/*, ToastController*/} from "ionic-angular";
import { Storage } from "@ionic/storage";
import {async, fakeAsync, TestBed, tick,} from '@angular/core/testing';

import {
  ConfigMock, HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock, TranslateMock
} from "../../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../../services/homewatch_api";
import { FormBuilder} from "@angular/forms";
import {EditPreferencesPage} from "./edit";
import {Config} from "../../../../config";
import {Translate} from "../../../../helpers/Translate";


describe('Edit', () => {
  let fixture;
  let component;
  // let nav;
  let storage;
  // let navbar;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditPreferencesPage
      ],
      imports: [
        IonicModule.forRoot(EditPreferencesPage)
      ],
      providers: [
        { provide: NavController, useClass: NavMock},
        { provide: Storage, useClass: StorageMock},
        { provide: NavParams, useClass: NavParamsMock},
        { provide: Config, useClass: ConfigMock},
        { provide: Translate, useClass: TranslateMock},
        { provide: Navbar, useClass: NavBarMock},
        { provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(EditPreferencesPage);
    component = fixture.componentInstance;

    //tirar do beforeeach
    // nav = TestBed.get(NavController);
    // navbar = TestBed.get(Navbar);

    storage = TestBed.get(Storage);
  });

  it('Component should be created', () => {
    expect(component instanceof EditPreferencesPage).toBe(true);
  });

  it('Load page', fakeAsync(() => {

    storage.set("THEME", 'green');
    storage.set("LANGUAGE", 'pt');

    let settings = {
      data: [{
        id: 2,
        user_id: 1,
        timed_tasks_not: 1,
        triggered_tasks_not: 1,
        theme: "default",
        language: "en"
      }]
    };

    spyOn(component, 'listSettings').and.returnValue((Promise.resolve(settings)));
    tick(1000);
    expect(component.loading).toBe(true);
    component.ionViewWillEnter();
    tick(1000);
    expect(component.listSettings).toHaveBeenCalled();
    expect(component.loading).toBe(false);
    expect(component.settingID).toBe(2);
  }));


  // it('View Entered', () => {
  //   component.user = {
  //     id: 1,
  //     name: "Leonel",
  //     email: "test@test.com",
  //     city: "Lisboa",
  //     jwt: "token"
  //   };
  //
  //   spyOn(navbar, 'backButtonClick').and.callThrough();
  //   spyOn(nav, 'push');
  //   component.ionViewDidEnter();
  //   expect(nav.push).toHaveBeenCalledWith(Homepage, component.user)
  // });

  it('Load page with error', fakeAsync(() => {
    spyOn(window, 'alert');
    spyOn(component, 'listSettings').and.throwError('My Error');
    tick(1000);

    component.ionViewWillEnter();
    tick(1000);
    expect(component.listSettings).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Something went wrong!');
  }));
});
