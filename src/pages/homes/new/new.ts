import {Component, ElementRef, ViewChild} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HomewatchApi } from "homewatch-js";
import { NavController, NavParams } from "ionic-angular";
import {Storage} from "@ionic/storage";
import { HomewatchApiService } from "../../../services/homewatch_api";

import {CameraHelper} from "../../../helpers/camera";

const URL_REGEX = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

@Component({
  selector: "new-home-page",
  templateUrl: "new.html"
})
export class NewHomePage {
  editMode = false;
  homeForm: FormGroup;
  homewatch: HomewatchApi;
  submitted = false;
  home: any;
  loading = true;
  theme = 'default';
  nameLabel;
  locationLabel;
  addressLabel;
  tunnelLabel;
  editLabel;
  addHomeLabel;
  deleteHomeLabel;
  findHubLabel;

  @ViewChild('uploadedIMG', {read: ElementRef}) private uploadedIMG: ElementRef;

  constructor(public navCtrl: NavController, public storage: Storage, public navParams: NavParams, homewatchApi: HomewatchApiService, public formBuilder: FormBuilder) {
    this.homewatch = homewatchApi.getApi();

    this.homeForm = formBuilder.group({
      id: [""],
      address: [""],
      image: [""],
      name: ["", Validators.required],
      location: ["", Validators.required],
      tunnel: ["", Validators.compose([Validators.required, Validators.pattern(URL_REGEX)])]
    });
    this.translateLabels();
  }


  async translateLabels(){
    this.nameLabel = await this.storage.get("nameLabel");
    this.locationLabel = await this.storage.get("locationLabel");
    this.addressLabel = await this.storage.get("addressLabel");
    this.tunnelLabel = await this.storage.get("tunnelLabel");
    this.editLabel = await this.storage.get("editLabel");
    this.addHomeLabel = await this.storage.get("addHomeLabel");
    this.deleteHomeLabel= await this.storage.get("deleteHomeLabel");
    this.findHubLabel= await this.storage.get("findHubLabel");
  }


  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    this.loading = true;
    this.home = this.navParams.get("home");
    if (this.home) {
      this.editMode = true;

      this.homeForm.setValue({
        id: this.home.id,
        name: this.home.name,
        address: this.home.address,
        image: this.home.image,
        location: this.home.location,
        tunnel: this.home.tunnel
      });
      if(!this.home.image){
        this.uploadedIMG.nativeElement.src= "./assets/Home-icon (2).png";
      }else{
        this.uploadedIMG.nativeElement.src= this.home.image;
      }
    }
    this.loading = false;
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  changeListener($event) : void {
    let file = $event.target.files[0];


    this.getBase64(file).then(
      data => {
        console.error(data)
        this.homeForm.patchValue({image:data})
        this.uploadedIMG.nativeElement.src= data;

      } );
  }

  async onSubmit(form: FormGroup) {
    if (this.editMode)
      this.updateHome(form);
    else
      this.createHome(form);
    this.navCtrl.pop();
  }

  async updateHome(form){
    await this.homewatch.homes.updateHome(form.value.id, form.value);
  }

  async createHome(form){
    await this.homewatch.homes.createHome(form.value);
  }

 async removeHome(){
    await this.homewatch.homes.deleteHome(this.homeForm.value.id)
    this.navCtrl.pop();
  }

  async getPicFromCamera()
  {
    let src=  await this.getCameraPicFromHelper();

    if (src != null){
      this.homeForm.patchValue({image:src})
      this.uploadedIMG.nativeElement.src= src;

    }
  }
  async getCameraPicFromHelper()
  {
    return await CameraHelper.getCameraPic();
  }

  async getPicFromGallery()
  {
    let src= await this.getGalleryPicFromHelper();

    if (src != null){
      this.homeForm.patchValue({image:src})
      this.uploadedIMG.nativeElement.src= src;
    }
  }

  async getGalleryPicFromHelper()
  {
    return await CameraHelper.getPicFromGallery();
  }


//   async findHub() {
// console.log("find hubsss")
//     try {
//       const response =  await this.homewatch.hub.getTunnel();
//       this.homeForm.patchValue({tunnel: response.data.url});
//     } catch (error) {
//       console.error(error);
//     }
//   }


}
