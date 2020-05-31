"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var show_1 = require("../pages/things/devices/light/show");
var show_2 = require("../pages/things/devices/lock/show");
var show_3 = require("../pages/things/devices/thermostat/show");
var show_4 = require("../pages/things/devices/weather/show");
var show_5 = require("../pages/things/devices/motion_sensor/show");
var ThingTypeInfo = (function () {
    function ThingTypeInfo() {
    }
    return ThingTypeInfo;
}());
exports.ThingTypeInfo = ThingTypeInfo;
var ThingInfo = (function () {
    function ThingInfo() {
    }
    return ThingInfo;
}());
exports.ThingInfo = ThingInfo;
var ThingsInfoHelper = (function () {
    function ThingsInfoHelper() {
    }
    ThingsInfoHelper.getTypeOptions = function () {
        var _this = this;
        return Object.keys(this.things).map(function (key) {
            return __assign({}, _this.things[key], { type: key });
        });
    };
    ThingsInfoHelper.getAssignableTypeOptions = function () {
        var _this = this;
        return Object.keys(this.things).map(function (key) {
            return __assign({}, _this.things[key], { type: key });
        }).filter(function (t) { return t.readOnly === false; });
    };
    ThingsInfoHelper.getThingInfo = function (type) {
        return this.things[type];
    };
    return ThingsInfoHelper;
}());
ThingsInfoHelper.things = {
    "Things::Light": {
        subTypes: ["rest", "coap", "hue"],
        showPage: show_1.ShowLightPage,
        text: "Light",
        icon: "bulb",
        readOnly: false
    },
    "Things::Lock": {
        subTypes: ["rest"],
        showPage: show_2.ShowLockPage,
        text: "Lock",
        icon: "lock",
        readOnly: false
    },
    "Things::Thermostat": {
        subTypes: ["rest"],
        showPage: show_3.ShowThermostatPage,
        text: "Thermostat",
        icon: "thermometer",
        readOnly: false
    },
    "Things::Weather": {
        subTypes: ["rest", "owm"],
        showPage: show_4.ShowWeatherPage,
        text: "Weather",
        icon: "sunny",
        readOnly: true
    },
    "Things::MotionSensor": {
        subTypes: ["rest"],
        showPage: show_5.ShowMotionSensorPage,
        text: "Motion Sensor",
        icon: "eye",
        readOnly: true
    }
};
exports.ThingsInfoHelper = ThingsInfoHelper;
