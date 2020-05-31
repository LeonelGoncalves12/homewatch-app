import {IonicModule, NavController, Navbar,NavParams} from "ionic-angular";
import { Storage } from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import {
  HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock, TranslateMock,
} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import { FormBuilder} from "@angular/forms";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {Translate} from "../../../helpers/Translate";
import {ListRoomPage} from "./list";
import {NewRoomPage} from "../new/new";
import {NewThingPage} from "../../things/new/new";
import {EditThingPage} from "../../things/edit/edit";

describe('List Room', () => {
  let fixture;
  let component;
  let nav;
  let navParams;
  let translate;

    let user = {
        id: 1,
        name: "Leonel",
        email: "test@test.com",
        city: "Lisboa",
        jwt: "token"
    };

    let homes = {
    data: [{
      id: 1,
      name : "Home 1",
      address: "Lisbon",
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
      tunnel: "https://0a3b45b6.eu.ngrok.io"
    },
      {
        id: 2,
        name : "Home 2",
        address: "Lisbon",
        image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD",
        tunnel: "https://0a3b45b7.eu.ngrok.io"
      }]
  };

    let rooms = {
    data :[{
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
    }]
  };

  let things ={
    data: [{
      connection_info: {address: "homewatch-hub.local", port: 3001},
      favorite: "1",
      home: 1,
      id: 11,
      name: "Light",
      room: {
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
      },
      subtype: "rest",
      type: "Things::Light"
    },
      {
        connection_info: {address: "homewatch-hub.local", port: 3002},
        favorite: "1",
        home: 1,
        id: 13,
        name: "Light",
        room: {
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
        },
        subtype: "rest",
        type: "Things::Light"
      }
    ]
  };

  let status ={on: true};
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ListRoomPage
      ],
      imports: [
        IonicModule.forRoot(ListRoomPage)
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

    fixture = TestBed.createComponent(ListRoomPage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    translate = TestBed.get(Translate)
    navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof ListRoomPage).toBe(true);
  });

  it('Load page',fakeAsync(() => {
    spyOn(component, 'listRoomsAPI').and.returnValue(Promise.resolve(rooms));
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'getStatusAPI').and.returnValue(Promise.resolve(status));
    spyOn(navParams, 'get').and.returnValue(user);
    spyOn(translate, 'translateList');
    component.ionViewWillEnter();
    tick(3000);
    expect(translate.translateList).toHaveBeenCalled();
  }));


  it('Choose Room', fakeAsync(() => {
    spyOn(component, 'listThingsAPI').and.returnValue(Promise.resolve(things));
    spyOn(component, 'getStatusAPI').and.returnValue(Promise.resolve(status));

    component.chooseRoom(rooms.data[0]);
    tick(3000);

    expect(component.getStatusAPI).toHaveBeenCalled();
  }));

  it('Go To New Room', () => {
    component.newRoom(homes.data[0]);
    expect(nav.push).toHaveBeenCalledWith(NewRoomPage, {home: homes.data[0]});
  });

  it('Go To Edit Room', () => {
    component.editRoom(homes.data[0], rooms.data[0]);
    expect(nav.push).toHaveBeenCalledWith(NewRoomPage,  {home:homes.data[0], room:rooms.data[0]});
  });

  it('Go To New Device', () => {
    component.newDevice( rooms.data[0]);
    expect(nav.push).toHaveBeenCalledWith(NewThingPage, {room:rooms.data[0]});
  });

  it('Go To Edit Device', () => {
    component.editDevice(things.data[0], rooms.data[0]);
    expect(nav.push).toHaveBeenCalledWith(EditThingPage, {thing:things.data[0], room:rooms.data[0]});
  });
    it('Try Again', () => {
    spyOn(component, 'ionViewWillEnter')
    component.tryAgain();
    expect(component.ionViewWillEnter).toHaveBeenCalled();
  });
});
