import {StatusBar} from '@ionic-native/status-bar/ngx';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {HomewatchApi} from "homewatch-js";
// import {Config} from "../src/config";
// import {HttpClient} from "@angular/common/http";
// import {HomewatchApi} from "homewatch-js";

export class PlatformMock {
  public ready(): Promise<string> {
    return new Promise((resolve) => {
      resolve('READY');
    });
  }

  public getQueryParam() {
    return true;
  }

  public registerBackButtonAction(fn: Function, priority?: number): Function {
    return (() => true);
  }

  public hasFocus(ele: HTMLElement): boolean {
    return true;
  }

  public doc(): HTMLDocument {
    return document;
  }

  public is(): boolean {
    return true;
  }

  public getElementComputedStyle(container: any): any {
    return {
      paddingLeft: '10',
      paddingTop: '10',
      paddingRight: '10',
      paddingBottom: '10',
    };
  }

  public onResize(callback: any) {
    return callback;
  }

  public registerListener(ele: any, eventName: string, callback: any): Function {
    return (() => true);
  }

  public win(): Window {
    return window;
  }

  public raf(callback: any): number {
    return 1;
  }

  public timeout(callback: any, timer: number): any {
    return setTimeout(callback, timer);
  }

  public cancelTimeout(id: any) {
    // do nothing
  }

  public getActiveElement(): any {
    return document['activeElement'];
  }
}

export class StatusBarMock extends StatusBar {
  styleDefault() {
    return;
  }
}

export class SplashScreenMock extends SplashScreen {
  hide() {
    return;
  }
}

export class NavBarMock extends SplashScreen {
  backButtonClick() {
    return;
  }

  _setTitle() {
    return;
  }
}


export class NavMock {

  public pop(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public push(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public getActive(): any {
    return {
      'instance': {
        'model': 'something',
      },
    };
  }

  public setRoot(): any {
    return true;
  }

  public registerChildNav(nav: any): void {
    return;
  }

}

export class DeepLinkerMock {

}

export class ThingsTranslatorMock {
  public getThingAction(status, name, language): any {
    return new Promise(function (resolve: Function) {
      resolve({text: "Turn off", operator: "==", sensor: ""});
    });
  }

  public getThingCompareAction(status, name, language): any {
    return new Promise(function (resolve: Function) {
      resolve({text: "is turned off", operator: "==", sensor: ""});
    });
  }
}


export class StorageMock {
  public remove(key: any): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public get(key: any): Promise<any> {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public set(key: any, value: any): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

}

export class TranslateMock {
  public translateLabels(storage: Storage): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }


  public translateList(list, attribute, storage: Storage): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public TranslateText(list, attribute, storage: Storage): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }

  public translateArray(list, attribute, storage: Storage): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }


}

export class ConfigMock {
  public getGeoCodeApiKey(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }
}

export class HomewatchApiServiceMock {

  public registerRequestInterceptors(interceptor: Function, errorInterceptor?: Function): void {
    return;
  }


  public registerResponseInterceptors(interceptor: Function, errorInterceptor?: Function): void {
    return;
  }

  public getApi(): HomewatchApi {
    return new HomewatchApi("https://api-leo.herokuapp.com/", false);
  }

  public setAuth(): any {
    return;
  }
}

export class AlertMock {
  public addButton() {
    return;
  }

  public present() {
    return;
  }
}

export class DateCalculatorMock {
  public TranslateNextRun(date: any) {
    return;
  }

}

export class NavParamsMock {
  data = {};

  static returnParam = null;

  public get(key): any {
    if (NavParamsMock.returnParam) {
      return NavParamsMock.returnParam
    }
    return 'default';
  }

  static setParams(value) {
    NavParamsMock.returnParam = value;
  }
}


export class OneSignalMock {
  // this.oneSignal.startInit(await this.config.getOneSignalAppID(), await this.config.getOneSignalSenderID());
  // this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
  // this.oneSignal.handleNotificationReceived().subscribe(data => this.onPushReceived(data.payload));
  // this.oneSignal.handleNotificationOpened().subscribe(data => this.onPushOpened(data.notification.payload));
  // this.oneSignal.sendTag("user", user.id);
  // this.oneSignal.endInit();
  OSInFocusDisplayOption: {
    None: number;
    InAppAlert: number;
    Notification: number;
  };

  public startInit(appID: string, senderID: string): any {
    return true;
  }

  public inFocusDisplaying(notification: any): any {
    return true;
  }

  public handleNotificationReceived(appID: string, senderID: string): any {
    return true;
  }

  public handleNotificationOpened(appID: string, senderID: string): any {
    return true;
  }

  public sendTag(key: string, id: string): any {
    return true;
  }

  public endInit(): any {
    return true;
  }
}


// export class ApiWeatherMock {
//   // constructor(public config: Config, public http: HttpClient) {
//   //   console.log('Hello RestServiceProvider Provider');
//   // }
//
//   public getWeather() :any  {
//     return new Promise(function(resolve: Function): void {
//       resolve();
//     });
//   }
// }

export class HttpClientMock {

  public getWeather(): any {
    return new Promise(function (resolve: Function): void {
      resolve();
    });
  }
}


