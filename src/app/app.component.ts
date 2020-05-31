import { Component, ViewChild } from "@angular/core";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { Storage } from "@ionic/storage";
import { LoadingController, Nav, Platform, ToastController } from "ionic-angular";
import { LoginPage } from "../pages/users/login/login";
import { EditProfilePage } from "../pages/users/sign-up/edit";
import { HomewatchApiService } from "../services/homewatch_api";
import {Translate} from "../helpers/Translate";



@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = LoginPage;
  theme = 'default';

  pages: Array<{ title: string, component: any, icon: string, method: string }>;

  constructor(public translate: Translate, public platform: Platform,  public statusBar: StatusBar, public splashScreen: SplashScreen, public storage: Storage, public homewatchApiService: HomewatchApiService, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {

    this.setInterceptors();
    this.initializeApp();
    this.translate.translateLabels(this.storage);
    this.pages = [
      { title: "Profile", component: EditProfilePage, icon: "person", method: "push" },
      { title: "Logout", component: LoginPage, icon: "exit", method: "setRoot" }
    ];
  }

  setInterceptors() {
    this.homewatchApiService.registerRequestInterceptors(async config => {
      return config;
    });

    this.homewatchApiService.registerResponseInterceptors(response => {
      return response;
    }, async error => {
      if (!error.response) {
        this.toastCtrl.create({ message: "Couldn't reach the servers!", showCloseButton: true, duration: 5000 }).present();
      } else if (error.response.status === 401) {
        await this.storage.remove("HOMEWATCH_USER");
        this.nav.setRoot(LoginPage);
        this.toastCtrl.create({ message: "Unauthorized access!", showCloseButton: true, duration: 5000 }).present();
      }

      return Promise.reject(error);
    });
  }

  async initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }



  async openPage(page) {
    // if logging out, clear user data
    if (page.component === LoginPage) {
      await this.storage.remove("HOMEWATCH_USER");
    }

    switch (page.method) {
      case "push":
        this.nav.push(page.component);
        break;
      case "setRoot":
        this.nav.setRoot(page.component);
        break;
    }
  }

}
