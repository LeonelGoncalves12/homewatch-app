import { Storage } from "@ionic/storage";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NavController, NavParams } from "ionic-angular";
import { HomewatchApiService } from "../../../services/homewatch_api";
import { HomewatchApi } from "homewatch-js";
import { LoginPage } from "../login/login";
import {Homepage} from "../homepage/homepage";
// import {Homepage} from "../homepage/homepage";

const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: "page-signup",
  templateUrl: "sign-up.html"
})
export class SignUpPage {
  signUpForm: FormGroup;
  homewatch: HomewatchApi;
  submitted = false;
  theme = 'default';

  constructor(public navCtrl: NavController, public navParams: NavParams, homewatchApi: HomewatchApiService, public storage: Storage, public formBuilder: FormBuilder) {
    this.homewatch = homewatchApi.getApi();

    this.signUpForm = formBuilder.group({
      name: ["", Validators.compose([Validators.required])],
      city: ["", Validators.compose([Validators.required])],
      email: ["", Validators.compose([Validators.pattern(EMAIL_REGEX), Validators.required])],
      passwords: formBuilder.group({
        password: ["", Validators.required],
        password_confirmation: ["", Validators.required]
      }, { validator: this.matchPassword })
    });
  }
  async ionViewWillEnter()
  {
    const theme = await this.storage.get("THEME");

    this.theme = theme ? theme : 'default';
  }


  async onSubmit(form: FormGroup) {
    this.submitted = true;

    try {
      const user = this.convertFormToUser(form);
      const response = await this.registerUser(user);
      this.homewatch.auth = response.data.jwt;

      let setting = {
        user_id: response.data.id,
        timed_tasks_not: "1",
        triggered_tasks_not: "1",
        theme: "default",
        language: "en"
      };

      await this.createSettingOnUser(setting);

      this.storage.set("HOMEWATCH_USER", response.data);

      this.navCtrl.setRoot(Homepage, { user: response.data });
    } catch (error) {
      alert("Something went wrong!");
    }
  }
  goToLogin() {
    this.navCtrl.push(LoginPage);
  }

  private convertFormToUser = (form: FormGroup) => {
    return {
      name: form.value.name,
      city: form.value.city,
      email: form.value.email,
      password: form.value.passwords.password,
      password_confirmation: form.value.passwords.password_confirmation
    };
  };


  async registerUser(user){
    return await this.homewatch.users.register(user);
  }

  async createSettingOnUser(setting){
    await this.homewatch.settings.createSetting(setting);
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
