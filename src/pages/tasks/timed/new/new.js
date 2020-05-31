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
var forms_1 = require("@angular/forms");
var array_sorter_1 = require("../../../../helpers/array_sorter");
var things_info_1 = require("../../../../helpers/things_info");
var NewTimedTaskPage = (function () {
    function NewTimedTaskPage(navCtrl, navParams, homewatchApi, formBuilder, popoverCtrl, compFactoryResolver, events) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.popoverCtrl = popoverCtrl;
        this.compFactoryResolver = compFactoryResolver;
        this.events = events;
        this.toApply = "thing";
        this.editMode = false;
        this.things = [];
        this.homewatch = homewatchApi.getApi();
        this.home = this.navParams.get("home");
        this.timedTaskForm = formBuilder.group({
            id: [""],
            thing_id: [""],
            scenario_id: [""],
            status: [""],
            cron: ["", forms_1.Validators.required]
        });
    }
    NewTimedTaskPage.prototype.loadThingStatus = function (thing) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var compFactory;
            return __generator(this, function (_a) {
                console.error("testeee");
                this.thing = thing;
                this.events.subscribe("thing:status:update:out" + thing.id, function (status) { _this.onStatusChange(status); });
                this.navParams.data.thing = thing;
                if (this.editMode)
                    this.navParams.data.status = this.timedTask.status;
                this.thingStatus.clear();
                compFactory = this.compFactoryResolver.resolveComponentFactory(things_info_1.ThingsInfoHelper.getThingInfo(thing.type).showPage);
                this.thingStatus.createComponent(compFactory);
                return [2 /*return*/];
            });
        });
    };
    NewTimedTaskPage.prototype.loadThings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response_rooms, j, respthings, z;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.homewatch.rooms(this.home).listRooms()];
                    case 1:
                        response_rooms = _a.sent();
                        console.error(response_rooms.data);
                        j = 0;
                        _a.label = 2;
                    case 2:
                        if (!(j < response_rooms.data.length)) return [3 /*break*/, 5];
                        return [4 /*yield*/, this.homewatch.things(response_rooms.data[j]).listThings()];
                    case 3:
                        respthings = _a.sent();
                        for (z = 0; z < respthings.data.length; z++) {
                            this.things.push(respthings.data[z]);
                        }
                        _a.label = 4;
                    case 4:
                        j++;
                        return [3 /*break*/, 2];
                    case 5:
                        this.things = array_sorter_1.ArraySorterHelper.sortArrayByID(this.things);
                        this.assignableThings = array_sorter_1.ArraySorterHelper.filterAssignableThings(this.things);
                        return [2 /*return*/];
                }
            });
        });
    };
    NewTimedTaskPage.prototype.loadScenarios = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.homewatch.scenarios(this.home).listScenarios()];
                    case 1:
                        response = _a.sent();
                        this.scenarios = array_sorter_1.ArraySorterHelper.sortArrayByID(response.data);
                        return [2 /*return*/];
                }
            });
        });
    };
    NewTimedTaskPage.prototype.ionViewWillEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.timedTask = this.navParams.get("timed_task");
                        if (this.timedTask) {
                            this.editMode = true;
                            if (this.timedTask.thing) {
                                this.toApply = "thing";
                                this.timedTask.thing_id = this.timedTask.thing.id;
                                this.loadThingStatus(this.timedTask.thing);
                            }
                            else {
                                this.toApply = "scenario";
                                this.timedTask.scenario_id = this.timedTask.scenario.id;
                            }
                            this.timedTaskForm.patchValue(this.timedTask);
                        }
                        this.timedTaskForm.get("thing_id").valueChanges.subscribe(function (thing_id) {
                            var thing = _this.things.find(function (t) { return t.id === thing_id; });
                            if (thing)
                                _this.loadThingStatus(thing);
                        });
                        return [4 /*yield*/, Promise.all([this.loadThings(), this.loadScenarios()])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NewTimedTaskPage.prototype.onStatusChange = function (status) {
        this.timedTaskForm.patchValue({ status: status });
    };
    NewTimedTaskPage.prototype.onToApplyChange = function (toApply) {
        if (this.timedTaskForm.controls.scenario_id)
            this.timedTaskForm.controls.scenario_id.reset();
        if (this.timedTaskForm.controls.thing_id)
            this.timedTaskForm.controls.thing_id.reset();
        if (this.timedTaskForm.controls.status)
            this.timedTaskForm.controls.status.reset();
        this.toApply = toApply;
    };
    NewTimedTaskPage.prototype.validForm = function () {
        return this.timedTaskForm.valid &&
            ((this.timedTaskForm.value.thing_id && this.timedTaskForm.value.status) || this.timedTaskForm.value.scenario_id);
    };
    NewTimedTaskPage.prototype.onSubmit = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var timed_task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timed_task = this.buildTimedTask(form);
                        if (!this.editMode) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.homewatch.timedTasks(this.home).updateTimedTask(form.value.id, timed_task)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.homewatch.timedTasks(this.home).createTimedTask(timed_task)];
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
    NewTimedTaskPage.prototype.buildTimedTask = function (form) {
        var timed_task = { cron: form.value.cron, status_to_apply: undefined, thing_id: null, scenario_id: null };
        if (this.toApply === "thing") {
            timed_task.thing_id = form.value.thing_id;
            timed_task.status_to_apply = form.value.status;
        }
        else if (this.toApply === "scenario") {
            timed_task.scenario_id = form.value.scenario_id;
        }
        return timed_task;
    };
    return NewTimedTaskPage;
}());
__decorate([
    core_1.ViewChild("thingStatus", { read: core_1.ViewContainerRef })
], NewTimedTaskPage.prototype, "thingStatus", void 0);
NewTimedTaskPage = __decorate([
    core_1.Component({
        selector: "new-timed-task-page",
        templateUrl: "new.html"
    })
], NewTimedTaskPage);
exports.NewTimedTaskPage = NewTimedTaskPage;
