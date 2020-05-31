import {Component} from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Storage} from "@ionic/storage";
import {NavController, NavParams, ToastController} from "ionic-angular";

import {HomewatchApiService} from "../../../services/homewatch_api";
import {SignUpPage} from "../sign-up/sign-up";
import {Homepage} from "../homepage/homepage";
import {OSNotificationPayload} from '@ionic-native/onesignal';


import {isCordovaAvailable} from "../../../helpers/is-cordova-available";
import {Config} from "../../../config";
import {Translate} from "../../../helpers/Translate";
import {OneSignal} from "@ionic-native/onesignal/ngx";



const EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  loginForm: FormGroup;
  submitted = false;
  theme = 'default';

  constructor(public translate : Translate, public config : Config, public oneSignal: OneSignal, public navCtrl: NavController, public navParams: NavParams, public homewatchApi: HomewatchApiService, public storage: Storage, public formBuilder: FormBuilder, public toastController: ToastController) {
    this.loginForm = formBuilder.group({
      email: ["", Validators.compose([Validators.pattern(EMAIL_REGEX), Validators.required])],
      password: ["", Validators.required]
    });

  }

  async ionViewWillEnter() {
    const theme = await this.storage.get("THEME");

    this.theme = theme ? theme : 'default';
  }

  async ionViewDidLoad() {
    const user = await this.storage.get("HOMEWATCH_USER");
    if (user) {
      this.homewatchApi.setAuth(user.jwt);
      this.getTheme(user);
      this.navCtrl.setRoot(Homepage, {user});

      await this.oneSignalNotification(user);
    }
  }
  async oneSignalNotification(user) {
    if (isCordovaAvailable()) {
      let appID = await this.config.getOneSignalAppID();
      let senderID = await this.config.getOneSignalSenderID();

      this.oneSignal.startInit(appID, senderID);
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
      this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
      this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
      this.oneSignal.sendTag("user", user.id);
      this.oneSignal.endInit();
    }
  }

  async onSubmit(form: FormGroup) {
    try {
      this.submitted = true;
      const response = await this.login(form);
      this.homewatchApi.setAuth(response.data.jwt);
      this.storage.set("HOMEWATCH_USER", response.data);
      this.getTheme(response.data);
      this.getLanguage(response.data);
      this.navCtrl.setRoot(Homepage, {user: response.data});


    } catch (error) {
      alert("Something went wrong!");
    }
  }

  async login(form){
    return await this.homewatchApi.getApi().users.login(form.value);
  }

  goToSignUp() {
    this.navCtrl.push(SignUpPage);
  }

  private onPushReceived(payload: OSNotificationPayload) {
    alert('Push recevied:' + payload.body);
  }

  private onPushOpened(payload: OSNotificationPayload) {
    alert('Push opened: ' + payload.body);
  }

  async getTheme(user) {

    const resp = await this.getSettings();
    if (resp.data) {
      this.theme = resp.data[0].theme;
      this.storage.set("THEME", this.theme);
    }
  }

  async getLanguage(user) {

    const resp = await this.getSettings();
    if (resp.data) {
      this.storage.set("LANGUAGE", resp.data[0].language);
    }
    this.translate.translateLabels(this.storage);
  }


  async getSettings(){
    return await this.homewatchApi.homewatch.settings.listSettings();
  }
}
