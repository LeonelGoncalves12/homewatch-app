"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var homewatch_js_1 = require("homewatch-js");
var HomewatchApiService = HomewatchApiService_1 = (function () {
    function HomewatchApiService() {
        this.homewatch = new homewatch_js_1.HomewatchApi(HomewatchApiService_1.url, false);
    }
    HomewatchApiService.prototype.getApi = function () {
        return this.homewatch;
    };
    HomewatchApiService.prototype.getCleanApi = function () {
        var api = new homewatch_js_1.HomewatchApi(HomewatchApiService_1.url, false);
        api.auth = this.auth;
        api.axios.interceptors.request.eject(this.requestInterceptor);
        api.axios.interceptors.response.eject(this.responseInterceptor);
        return api;
    };
    HomewatchApiService.prototype.setAuth = function (auth) {
        this.homewatch.auth = auth;
        this.auth = auth;
    };
    HomewatchApiService.prototype.registerRequestInterceptors = function (interceptor, errorInterceptor) {
        this.requestInterceptor = this.homewatch.axios.interceptors.request.use(interceptor, errorInterceptor);
    };
    HomewatchApiService.prototype.registerResponseInterceptors = function (interceptor, errorInterceptor) {
        this.responseInterceptor = this.homewatch.axios.interceptors.response.use(interceptor, errorInterceptor);
    };
    return HomewatchApiService;
}());
HomewatchApiService.url = "https://api-leo.herokuapp.com/";
HomewatchApiService = HomewatchApiService_1 = __decorate([
    core_1.Injectable()
], HomewatchApiService);
exports.HomewatchApiService = HomewatchApiService;
var HomewatchApiService_1;
