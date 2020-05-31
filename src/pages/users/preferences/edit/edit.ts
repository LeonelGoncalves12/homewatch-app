import {Component, ComponentFactoryResolver, ViewChild} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {HomewatchApi} from "homewatch-js";
import {Events, Navbar, NavController, NavParams, PopoverController} from "ionic-angular";
import {Storage} from "@ionic/storage";

import {HomewatchApiService} from "../../../../services/homewatch_api";
import {Translate} from "../../../../helpers/Translate";
import {Homepage} from "../../homepage/homepage";

@Component({
  selector: "notifications-page",
  templateUrl: "edit.html"
})
export class EditPreferencesPage {
  editMode = false;
  homewatch: HomewatchApi;
  loading = true;
  failed = false;
  notifications: any;
  languageactive = 'en';
  themeactive = 'default'
  settingID;
  user;
  teste = 1;
  theme = 'default';
  preferencesLabel;
  themeLabel;
  languageLabel;
  somethingFailedLabel;
  @ViewChild('navbar') navBar: Navbar;

  constructor(public translate: Translate, public navCtrl: NavController, public storage: Storage, public navParams: NavParams, homewatchApi: HomewatchApiService, public formBuilder: FormBuilder, public popoverCtrl: PopoverController, public compFactoryResolver: ComponentFactoryResolver, public events: Events) {
    this.homewatch = homewatchApi.getApi();
    this.user = this.navParams.get("user");

    this.translateLabels();
  }

  async translateLabels() {
    this.preferencesLabel = await this.storage.get("preferencesLabel");
    this.themeLabel = await this.storage.get("themeLabel");
    this.languageLabel = await this.storage.get("languageLabel");
    this.somethingFailedLabel = await this.storage.get("somethingFailedLabel");
  }

  async ionViewWillEnter() {
    this.theme = await this.storage.get("THEME");
    this.themeactive = this.theme;
    this.languageactive = await this.storage.get("LANGUAGE");
    this.loading = true;
    this.failed = false;
    try {
      const response = await this.listSettings();
      console.trace(response);
      if (response.data) {
        this.settingID = response.data[0].id;
      }
      this.loading = false;
    }
    catch (error) {
      this.loading = false;
      this.failed = true;
      alert("Something went wrong!");
    }
  }

  ionViewDidEnter() {
    this.navBar.backButtonClick = () => {
      let user =this.user;
      this.navCtrl.push(Homepage, {user});
    };
  }

  async listSettings(){
    return await this.homewatch.settings.listSettings();
  }

  async chooseTheme(theme) {
    await this.homewatch.settings.updateSetting(this.settingID, {theme: theme});
    this.storage.set("THEME", theme);
    this.theme = theme;
    this.themeactive = theme
  }

  async chooseLanguage(language) {

    await this.homewatch.settings.updateSetting(this.settingID, {language: language});
    await this.storage.set("LANGUAGE", language);
    await this.translate.translateLabels(this.storage);
    this.languageactive = language;
  }




}
