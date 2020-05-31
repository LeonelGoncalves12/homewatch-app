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
var new_1 = require("../timed/new/new");
var new_2 = require("../triggered/new/new");
var ListTasksPage = (function () {
    function ListTasksPage(navParams, navCtrl, homewatchApi) {
        this.navParams = navParams;
        this.navCtrl = navCtrl;
        this.tasks_type = "timed";
        this.homewatch = homewatchApi.getApi();
        this.home = this.navParams.get("home");
    }
    ListTasksPage.prototype.ionViewWillEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadTask(this.tasks_type)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ListTasksPage.prototype.onTypeChange = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.tasks_type = type;
                        return [4 /*yield*/, this.loadTask(type)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ListTasksPage.prototype.loadTask = function (tasks_type) {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = tasks_type;
                        switch (_a) {
                            case "triggered": return [3 /*break*/, 1];
                            case "timed": return [3 /*break*/, 3];
                        }
                        return [3 /*break*/, 5];
                    case 1: return [4 /*yield*/, this.loadTriggeredTasks()];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 3: return [4 /*yield*/, this.loadTimedTasks()];
                    case 4:
                        _b.sent();
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    ListTasksPage.prototype.loadTimedTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, i, resprooms, j, respthings, z;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.homewatch.timedTasks(this.home).listTimedTasks()];
                    case 1:
                        response = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < response.data.length)) return [3 /*break*/, 8];
                        if (!response.data[i].thing) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.homewatch.rooms(this.home).listRooms()];
                    case 3:
                        resprooms = _a.sent();
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
                        return [3 /*break*/, 2];
                    case 8:
                        this.timed_tasks = array_sorter_1.ArraySorterHelper.sortArrayByID(response.data);
                        console.error(this.timed_tasks);
                        return [2 /*return*/];
                }
            });
        });
    };
    ListTasksPage.prototype.loadTriggeredTasks = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.homewatch.triggeredTasks(this.home).listTriggeredTasks()];
                    case 1:
                        response = _a.sent();
                        this.triggered_tasks = array_sorter_1.ArraySorterHelper.sortArrayByID(response.data);
                        return [2 /*return*/];
                }
            });
        });
    };
    ListTasksPage.prototype.newTask = function () {
        console.error(this.home);
        switch (this.tasks_type) {
            case "timed":
                this.navCtrl.push(new_1.NewTimedTaskPage, { home: this.home });
                break;
            case "triggered":
                this.navCtrl.push(new_2.NewTriggeredTaskPage, { home: this.home });
                break;
        }
    };
    return ListTasksPage;
}());
ListTasksPage = __decorate([
    core_1.Component({
        selector: "list-tasks-page",
        templateUrl: "list.html"
    })
], ListTasksPage);
exports.ListTasksPage = ListTasksPage;
