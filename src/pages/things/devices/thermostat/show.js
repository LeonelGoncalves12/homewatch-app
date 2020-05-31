"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var device_1 = require("../device");
var ShowThermostatPage = (function (_super) {
    __extends(ShowThermostatPage, _super);
    function ShowThermostatPage(navParams, events) {
        var _this = _super.call(this, navParams, events) || this;
        _this.navParams = navParams;
        _this.events = events;
        return _this;
    }
    ShowThermostatPage.prototype.defaultStatus = function () {
        this.status = { targetTemperature: 16 };
    };
    ShowThermostatPage.prototype.range = function (j, k) {
        return Array
            .apply(undefined, Array((k - j) + 1))
            .map(function (_discard, n) { return (n + j); });
    };
    return ShowThermostatPage;
}(device_1.DevicePage));
ShowThermostatPage = __decorate([
    core_1.Component({
        selector: "page-show-thermostat",
        templateUrl: "show.html"
    })
], ShowThermostatPage);
exports.ShowThermostatPage = ShowThermostatPage;
