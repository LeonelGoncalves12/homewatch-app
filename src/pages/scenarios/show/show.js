"use strict";
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
var core_1 = require("@angular/core");
var array_sorter_1 = require("../../../helpers/array_sorter");
var new_1 = require("../../scenario_things/new/new");
var list_1 = require("../list/list");
var popover_1 = require("./popover");
var ShowScenarioPage = (function () {
    function ShowScenarioPage(navCtrl, navParams, toastCtrl, homewatchApi, popoverCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.toastCtrl = toastCtrl;
        this.homewatchApi = homewatchApi;
        this.popoverCtrl = popoverCtrl;
        this.homewatch = homewatchApi.getApi();
        this.scenario = this.navParams.get("scenario");
        this.home = this.navParams.get("home");
    }
    ShowScenarioPage.prototype.ionViewWillEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, resprooms, i, j, respthings, z;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.homewatch.scenarioThings(this.scenario).listScenarioThings()];
                    case 1:
                        response = _a.sent();
                        console.error(response.data);
                        return [4 /*yield*/, this.homewatch.rooms(this.home).listRooms()];
                    case 2:
                        resprooms = _a.sent();
                        i = 0;
                        _a.label = 3;
                    case 3:
                        if (!(i < response.data.length)) return [3 /*break*/, 8];
                        j = 0;
                        _a.label = 4;
                    case 4:
                        if (!(j < resprooms.data.length)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.homewatch.things(resprooms.data[j]).listThings()];
                    case 5:
                        respthings = _a.sent();
                        for (z = 0; z < respthings.data.length; z++) {
                            if (response.data[i].thing.id === respthings.data[z].id) {
                                response.data[i].room = resprooms.data[j];
                            }
                        }
                        _a.label = 6;
                    case 6:
                        j++;
                        return [3 /*break*/, 4];
                    case 7:
                        i++;
                        return [3 /*break*/, 3];
                    case 8:
                        this.scenarioThings = array_sorter_1.ArraySorterHelper.sortArrayByID(response.data);
                        console.error(this.scenarioThings);
                        return [2 /*return*/];
                }
            });
        });
    };
    ShowScenarioPage.prototype.applyScenario = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.homewatch.scenarioApplier(this.scenario).applyScenario()];
                    case 1:
                        _a.sent();
                        this.toastCtrl.create({
                            message: "Scenario applied!",
                            showCloseButton: true,
                            duration: 2000
                        }).present();
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ShowScenarioPage.prototype.newScenarioThing = function () {
        this.navCtrl.push(new_1.NewScenarioThingPage, {
            home: this.home,
            scenario: this.scenario,
            selectedThings: this.scenarioThings
        });
    };
    ShowScenarioPage.prototype.editScenarioThing = function (scenarioThing) {
        this.navCtrl.push(new_1.NewScenarioThingPage, {
            home: this.home,
            scenario: this.scenario,
            selectedThings: this.scenarioThings,
            scenarioThing: scenarioThing
        });
    };
    ShowScenarioPage.prototype.showPopover = function (myEvent) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var popover;
            return __generator(this, function (_a) {
                popover = this.popoverCtrl.create(popover_1.ShowScenarioPopoverPage, { scenario: this.scenario, home: this.home });
                popover.onDidDismiss(function (info) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (info && info.deleted)
                            this.navCtrl.setRoot(list_1.ListScenariosPage, { home: this.home });
                        return [2 /*return*/];
                    });
                }); });
                popover.present({
                    ev: myEvent
                });
                return [2 /*return*/];
            });
        });
    };
    ShowScenarioPage.prototype.deleteScenarioThing = function (scenarioThing, index) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.homewatch.scenarioThings(this.scenario).deleteScenarioThing(scenarioThing.id)];
                    case 1:
                        _a.sent();
                        this.scenarioThings.splice(index, 1);
                        return [2 /*return*/];
                }
            });
        });
    };
    return ShowScenarioPage;
}());
ShowScenarioPage = __decorate([
    core_1.Component({
        selector: "show-scenario-page",
        templateUrl: "show.html"
    })
], ShowScenarioPage);
exports.ShowScenarioPage = ShowScenarioPage;
