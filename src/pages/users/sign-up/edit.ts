import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Storage } from "@ionic/storage";
import { HomewatchApi } from "homewatch-js";
import { NavController, NavParams } from "ionic-angular";

import { HomewatchApiService } from "../../../services/homewatch_api";
import { Homepage } from "../../users/homepage/homepage";
import {GeolocationHelper} from "../../../helpers/geolocation";
import {Config} from "../../../config";

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: "page-profile",
  templateUrl: "edit.html"
})
export class EditProfilePage {
  pageTitle = "Profile";
  editMode = true;
  signUpForm: FormGroup;
  homewatch: HomewatchApi;
  submitted = false;
  editLabel;
  nameLabel;
  emailLabel;
  cityLabel;
  passwordLabel;
  repeatPasswordLabel;
  saveLabel;
  theme = 'default';
  geolocation: any;

  constructor(public config: Config, public navCtrl: NavController, public navParams: NavParams, homewatchApi: HomewatchApiService, public storage: Storage, public formBuilder: FormBuilder) {
    this.homewatch = homewatchApi.getApi();

    this.signUpForm = formBuilder.group({
      name: ["", Validators.compose([Validators.required])],
      city: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.pattern(EMAIL_REGEX), Validators.required])],
      passwords: formBuilder.group({
        password: [""],
        password_confirmation: [""]
      }, { validator: this.matchPassword })
    });
    this.translateLabels();
  }

  async translateLabels() {
    this.editLabel = await this.storage.get("editLabel");
    this.nameLabel = await this.storage.get("nameLabel");
    this.emailLabel = await this.storage.get("emailLabel");
    this.cityLabel = await this.storage.get("cityLabel");
    this.passwordLabel = await this.storage.get("passwordLabel");
    this.repeatPasswordLabel = await this.storage.get("repeatPasswordLabel");
    this.saveLabel = await this.storage.get("saveLabel");
  }


  async ionViewWillEnter() {
    const user = await this.storage.get("HOMEWATCH_USER");
    try {
      this.signUpForm.setValue({
        name: user.name,
        email: user.email,
        passwords: {
          password: "",
          password_confirmation: ""
        },
        city: user.city
      });
      const theme = await this.storage.get("THEME");

      this.theme = theme ? theme : 'default';
    }catch(err){
      console.trace("Something went wrong!")
    }

  }

  async onSubmit(form: FormGroup) {
    this.submitted = true;
    try {
      const user = this.convertFormToUser(form);
      const response = await this.updateCurrentUser(user);
      this.homewatch.auth = response.data.jwt;
      this.storage.set("HOMEWATCH_USER", response.data);

      this.navCtrl.setRoot(Homepage, { user: response.data });
    } catch (error) {
      alert("Something went wrong!");
    }
  }

  getLocation()
  {
    let watch = this.getPosition();
    this.subscribeOnPosition(watch);

  }

  subscribeOnPosition(watch){
    watch.subscribe((data) => {
      if(data.coords != null){
        this.getCity(data.coords.latitude.toFixed(3) + ',' + data.coords.longitude.toFixed(3));
      }
    });
  }


  async updateCurrentUser(user){
    return await this.homewatch.users.updateCurrentUser(user);
  }



  getPosition(){
    let geolocation = GeolocationHelper.getLocation();
    return geolocation.watchPosition();
  }

  getCity(coordinates){
    const axios = require('axios');

    let apiKey = this.config.getGeoCodeApiKey();
    const params = {
      auth: apiKey,
      locate: coordinates,
      json: '1'
    };
    axios.get('https://geocode.xyz', {params})
      .then(response => {
        let region = response.data.region.split(',');
        this.signUpForm.patchValue({city: region[0]});
      }).catch(error => {
      console.log(error);
    });
  }

  private convertFormToUser = (form: FormGroup) => {
    return {
      name: form.value.name,
      city: form.value.city,
      email: form.value.email,
      password: form.value.passwords.password,
      password_confirmation: form.value.passwords.password_confirmation
    };
  }

  private matchPassword = (group: FormGroup) => {
    const password = group.controls.password;
    const confirm = group.controls.password_confirmation;

    if (password.pristine || confirm.pristine) {
      return undefined;
    }

    group.markAsTouched();

    if (password.value === confirm.value) {
      return undefined;
    }

    return {
      isValid: false
    };
  }



}
