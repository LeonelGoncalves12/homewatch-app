import { Injectable } from "@angular/core";
import { HomewatchApi } from "homewatch-js";

@Injectable()
export class HomewatchApiService {
  static url = "https://api-homewatch.herokuapp.com/";

  homewatch: HomewatchApi;
  auth: string;
  requestInterceptor: any;
  responseInterceptor: any;

  constructor() {
    this.homewatch = new HomewatchApi(HomewatchApiService.url, false);
  }

  getApi(): HomewatchApi {
    return this.homewatch;
  }

  getCleanApi(): HomewatchApi {
    const api = new HomewatchApi(HomewatchApiService.url, false);
    api.auth = this.auth;
    api.axios.interceptors.request.eject(this.requestInterceptor);
    api.axios.interceptors.response.eject(this.responseInterceptor);

    return api;
  }

  setAuth(auth: string) {
    this.homewatch.auth = auth;
    this.auth = auth;
  }

  registerRequestInterceptors(interceptor: Function, errorInterceptor?: Function): void {
    this.requestInterceptor = this.homewatch.axios.interceptors.request.use(interceptor, errorInterceptor);
  }

  registerResponseInterceptors(interceptor: Function, errorInterceptor?: Function): void {
    this.responseInterceptor = this.homewatch.axios.interceptors.response.use(interceptor, errorInterceptor);
  }
}
