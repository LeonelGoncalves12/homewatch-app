"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var popover_1 = require("../new/popover");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var things_info_1 = require("../../../helpers/things_info");
var NewThingPage = (function () {
    function NewThingPage(navCtrl, navParams, homewatchApi, formBuilder, events, popoverCtrl) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.events = events;
        this.popoverCtrl = popoverCtrl;
        this.editMode = false;
        this.subTypeOptions = [];
        this.submitted = false;
        this.popoverCallback = function (data) { return __awaiter(_this, void 0, void 0, function () {
            var connection_info;
            return __generator(this, function (_a) {
                if (!data)
                    return [2 /*return*/];
                connection_info = (function (_a) {
                    var address = _a.address, port = _a.port;
                    return ({ address: address, port: port });
                })(data);
                if (!data) {
                    return [2 /*return*/];
                }
                delete data.address;
                delete data.port;
                delete data.type;
                delete data.subtype;
                this.thingForm.patchValue({
                    connection_info: connection_info,
                    extra_info: JSON.stringify(data)
                });
                return [2 /*return*/];
            });
        }); };
        this.homewatch = homewatchApi.getApi();
        this.typeOptions = things_info_1.ThingsInfoHelper.getTypeOptions();
        this.thingForm = formBuilder.group({
            id: [""],
            name: ["", forms_1.Validators.required],
            type: ["", forms_1.Validators.required],
            subtype: ["", forms_1.Validators.required],
            connection_info: formBuilder.group({
                address: ["", forms_1.Validators.required],
                port: [""]
            }),
            extra_info: [""],
            favorite: ["", forms_1.Validators.required]
        });
        this.thingForm.valueChanges.subscribe(function (data) {
            if (data.type)
                _this.subTypeOptions = things_info_1.ThingsInfoHelper.getThingInfo(data.type).subTypes;
        });
    }
    NewThingPage.prototype.ionViewWillEnter = function () {
        this.room = this.navParams.get("room");
        this.thing = this.navParams.get("thing");
        if (this.thing) {
            this.editMode = true;
            var extraInfo = __assign({}, this.thing.connection_info);
            delete extraInfo["address"];
            delete extraInfo["port"];
            this.thingForm.setValue({
                id: this.thing.id,
                name: this.thing.name,
                type: this.thing.type,
                subtype: this.thing.subtype,
                connection_info: {
                    address: this.thing.connection_info.address,
                    port: this.thing.connection_info.port || ""
                },
                extra_info: JSON.stringify(extraInfo),
                favorite: this.thing.favorite
            });
        }
    };
    NewThingPage.prototype.onSubmit = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        Object.assign(form.value.connection_info, JSON.parse(form.value.extra_info));
                        console.error(this.room);
                        if (!this.editMode) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.homewatch.things(this.room).updateThing(form.value.id, form.value)];
                    case 1:
                        response = _a.sent();
                        this.events.publish("things:updated", response.data);
                        return [3 /*break*/, 4];
                    case 2:
                        console.error(this.room);
                        return [4 /*yield*/, this.homewatch.things(this.room).createThing(form.value)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        this.navCtrl.pop();
                        return [2 /*return*/];
                }
            });
        });
    };
    NewThingPage.prototype.showPopover = function (myEvent) {
        return __awaiter(this, void 0, void 0, function () {
            var popover;
            return __generator(this, function (_a) {
                popover = this.popoverCtrl.create(popover_1.NewThingPopoverPage, {
                    callback: this.popoverCallback,
                    room: this.room,
                    discoveryParams: this.buildDiscoveryParams()
                });
                popover.present({
                    ev: myEvent
                });
                return [2 /*return*/];
            });
        });
    };
    NewThingPage.prototype.buildDiscoveryParams = function () {
        return {
            type: this.thingForm.value.type,
            subtype: this.thingForm.value.subtype,
            port: this.thingForm.value.connection_info.port
        };
    };
    return NewThingPage;
}());
NewThingPage = __decorate([
    core_1.Component({
        selector: "page-new-thing",
        templateUrl: "edit.html"
    })
], NewThingPage);
exports.NewThingPage = NewThingPage;
