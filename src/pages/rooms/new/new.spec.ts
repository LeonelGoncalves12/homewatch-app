import {IonicModule, NavController, Navbar,NavParams} from "ionic-angular";
import { Storage } from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {
  HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock, TranslateMock,
} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import { FormBuilder} from "@angular/forms";
import {NewRoomPage} from "./new";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {Translate} from "../../../helpers/Translate";


describe('New/Edit Room', () => {
  let fixture;
  let component;
  let nav;
  let navParams;
  let translate;
  let home = {
    address: "Duque de Ávila nº47",
    id: 1,
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
    ip_address: {
      addr: 1505070272,
      family: 2,
      mask_addr: 4294967295
    },
    location: "Lisboa",
    name: "New home",
    numberRooms: 5,
    numberScenarios: 3,
    numberThings: 11,
    rooms: [],
    tunnel: "https://0a3b45b6.eu.ngrok.io"
    };

  let room = {
      home: {
        id: 1,
        name : "Home 1",
        address: "Lisbon",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
        tunnel: "https://0a3b45b6.eu.ngrok.io"
      },
      icon: "1",
      id: 1,
      name: "Kitchen",
      owner: ""
    };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewRoomPage
      ],
      imports: [
        IonicModule.forRoot(NewRoomPage)
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: NavController, useClass: NavMock},
        { provide: Storage, useClass: StorageMock},
        { provide: NavParams, useClass: NavParamsMock},
        { provide: Navbar, useClass: NavBarMock},
        { provide: Translate, useClass: TranslateMock},
        { provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(NewRoomPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    translate = TestBed.get(Translate)
    navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof NewRoomPage).toBe(true);
  });


  it('Load page',fakeAsync(() => {
    let navParamsSpy = spyOn(navParams, 'get');
    navParamsSpy.and.returnValue(home);
    navParamsSpy.and.returnValue(room);
    spyOn(translate, 'translateList');

    component.ionViewWillEnter();
    tick(3000);

    expect(translate.translateList).toHaveBeenCalled();
  }));


  it('Submit form - Edit', fakeAsync(() => {
    component.editMode = true;
    component.roomForm.controls['id'].setValue("1");
    component.roomForm.controls['name'].setValue("Room");
    component.roomForm.controls['owner'].setValue("Leonel");
    component.roomForm.controls['icon'].setValue("2");

    spyOn(component, 'updateRoom')
    component.onSubmit(component.roomForm);

    tick(3000)
    expect(component.updateRoom).toHaveBeenCalled();
  }));


  it('Submit form - Create', fakeAsync(() => {
    component.editMode = false;
    component.roomForm.controls['name'].setValue("Room");
    component.roomForm.controls['owner'].setValue("Leonel");
    component.roomForm.controls['icon'].setValue("2");

    spyOn(component, 'createRoom')
    component.onSubmit(component.roomForm);

    tick(3000);
    expect(component.createRoom).toHaveBeenCalled();
  }));

  it('Check if is a room', fakeAsync(() => {
    component.roomForm.controls['icon'].setValue("2");
    component.checkIfRoom();

    tick(3000)
    expect(component.isRoom).toBe(true);

    component.roomForm.controls['icon'].setValue("1");
    component.checkIfRoom();

    tick(3000)
    expect(component.isRoom).toBe(false);
  }));

  it('Choose Room', fakeAsync(() => {

    spyOn(component,'checkIfRoom')
    component.chooseRoom(room);
    tick(3000);

    expect(component.checkIfRoom).toHaveBeenCalled();
  }));

});
