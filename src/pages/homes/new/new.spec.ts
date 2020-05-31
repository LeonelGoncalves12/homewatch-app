import {IonicModule, NavController, Navbar,NavParams} from "ionic-angular";
import { Storage } from "@ionic/storage";
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { HomewatchApiServiceMock, NavBarMock, NavMock, NavParamsMock,
  StorageMock,
} from "../../../../test-config/mocks-ionic";
import {HomewatchApiService} from "../../../services/homewatch_api";
import { FormBuilder} from "@angular/forms";
import {NewHomePage} from "./new";


describe('New/Edit Home', () => {
  let fixture;
  let component;
  let nav;
  let navParams;

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


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewHomePage
      ],
      imports: [
        IonicModule.forRoot(NewHomePage)
      ],
      providers: [
        { provide: NavController, useClass: NavMock},
        { provide: Storage, useClass: StorageMock},
        { provide: NavParams, useClass: NavParamsMock},
        { provide: Navbar, useClass: NavBarMock},
        { provide: HomewatchApiService, useClass: HomewatchApiServiceMock},
        FormBuilder
      ]
    });
  }));

  beforeEach(() => {

    fixture = TestBed.createComponent(NewHomePage);
    component = fixture.componentInstance;
    nav = TestBed.get(NavController);
    navParams = TestBed.get(NavParams);
    spyOn(nav, 'push');
    spyOn(nav, 'setRoot');
  });

  it('Component should be created', () => {
    expect(component instanceof NewHomePage).toBe(true);
  });

  it('Edit a Home', fakeAsync(() => {
    spyOn(navParams, 'get').and.returnValue(home)

    component.ionViewWillEnter()
    tick(3000)
    expect(component.uploadedIMG.nativeElement.src).toBe('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD');
  }));


  it('Submit form - Edit', fakeAsync(() => {

    component.editMode = true;
    component.homeForm.controls['id'].setValue("1");
    component.homeForm.controls['name'].setValue("New home");
    component.homeForm.controls['address'].setValue({
      addr: 1505070272,
      family: 2,
      mask_addr: 4294967295
    });
    component.homeForm.controls['image'].setValue("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD");
    component.homeForm.controls['location'].setValue("Lisboa");
    component.homeForm.controls['tunnel'].setValue("https://0a3b45b6.eu.ngrok.io");

    spyOn(component, 'updateHome')
    component.onSubmit(component.homeForm);

    tick(3000);
    expect(component.updateHome).toHaveBeenCalled();
  }));

  it('Submit form - Create', fakeAsync(() => {

    component.editMode = false;
    component.homeForm.controls['id'].setValue("1");
    component.homeForm.controls['name'].setValue("New home");
    component.homeForm.controls['address'].setValue({
      addr: 1505070272,
      family: 2,
      mask_addr: 4294967295
    });
    component.homeForm.controls['image'].setValue("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD");
    component.homeForm.controls['location'].setValue("Lisboa");
    component.homeForm.controls['tunnel'].setValue("https://0a3b45b6.eu.ngrok.io");

    spyOn(component, 'createHome')
    component.onSubmit(component.homeForm);

    tick(3000)
    expect(component.createHome).toHaveBeenCalled();
  }));

  it('Get Pic from Camera', fakeAsync(() => {
      spyOn(component, 'getCameraPicFromHelper').and.returnValue(Promise.resolve("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD"));
      component.getPicFromCamera();
      tick(3000);
      expect(component.uploadedIMG.nativeElement.src).toBe('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD');

  }));

  it('Get Pic from Gallery', fakeAsync(() => {
    spyOn(component, 'getGalleryPicFromHelper').and.returnValue(Promise.resolve("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD"));
    component.getPicFromGallery();
    tick(3000);
    expect(component.uploadedIMG.nativeElement.src).toBe('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAQABAAD');
  }));


  it('Find hub', fakeAsync(() => {
    spyOn(component, 'findHubAPI').and.returnValue(Promise.resolve({data:{
     url: "https://0a3b45b6.eu.ngrok.io"
    }
    }));
    component.findHub();
    tick(3000);
    expect(component.homeForm.controls['tunnel'].value).toBe('https://0a3b45b6.eu.ngrok.io');
  }));




});
