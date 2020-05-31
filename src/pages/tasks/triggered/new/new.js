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
var NewTriggeredTaskPage = (function () {
    function NewTriggeredTaskPage(navCtrl, navParams, homewatchApi, formBuilder, popoverCtrl, compFactoryResolver, events) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.popoverCtrl = popoverCtrl;
        this.compFactoryResolver = compFactoryResolver;
        this.events = events;
        this.comparators = ["==", "<", ">", ">=", "<="];
        this.toApply = "thing";
        this.editMode = false;
        this.JSONValidator = function (control) {
            try {
                var json = control.value;
                if (json !== undefined) {
                    JSON.parse(json);
                }
            }
            catch (e) {
                return { json: "invalid" };
            }
            return undefined;
        };
        this.homewatch = homewatchApi.getApi();
        this.home = this.navParams.get("home");
        this.triggeredTaskForm = formBuilder.group({
            id: [""],
            thing_id: [""],
            status_to_apply: [""],
            scenario_id: [""],
            thing_to_compare_id: ["", forms_1.Validators.required],
            comparator: ["", forms_1.Validators.required],
            status_to_compare: ["", forms_1.Validators.compose([forms_1.Validators.required, this.JSONValidator])]
        });
    }
    NewTriggeredTaskPage.prototype.loadThingStatus = function (thing, status) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var compFactory;
            return __generator(this, function (_a) {
                this.thing = thing;
                this.events.subscribe("thing:status:update:out" + thing.id, function (newStatus) {
                    _this.onStatusToApplyChange(newStatus);
                });
                this.navParams.data.thing = thing;
                this.navParams.data.status = status;
                this.thingStatus.clear();
                compFactory = this.compFactoryResolver.resolveComponentFactory(things_info_1.ThingsInfoHelper.getThingInfo(thing.type).showPage);
                this.thingStatus.createComponent(compFactory);
                return [2 /*return*/];
            });
        });
    };
    NewTriggeredTaskPage.prototype.loadThings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.homewatch.things(this.home).listThings()];
                    case 1:
                        response = _a.sent();
                        this.things = array_sorter_1.ArraySorterHelper.sortArrayByID(response.data);
                        this.assignableThings = array_sorter_1.ArraySorterHelper.filterAssignableThings(this.things);
                        return [2 /*return*/];
                }
            });
        });
    };
    NewTriggeredTaskPage.prototype.loadScenarios = function () {
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
    NewTriggeredTaskPage.prototype.ionViewWillEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.triggeredTask = this.navParams.get("triggered_task");
                        if (this.triggeredTask) {
                            this.editMode = true;
                            if (this.triggeredTask.thing) {
                                this.toApply = "thing";
                                this.triggeredTask.thing_id = this.triggeredTask.thing.id;
                                this.loadThingStatus(this.triggeredTask.thing, this.triggeredTask.status_to_apply);
                            }
                            else {
                                this.toApply = "scenario";
                                this.triggeredTask.scenario_id = this.triggeredTask.scenario.id;
                            }
                            this.triggeredTask.status_to_compare = JSON.stringify(this.triggeredTask.status_to_compare);
                            this.triggeredTask.thing_to_compare_id = this.triggeredTask.thing_to_compare.id;
                            this.triggeredTaskForm.patchValue(this.triggeredTask);
                        }
                        return [4 /*yield*/, Promise.all([this.loadThings(), this.loadScenarios()])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    NewTriggeredTaskPage.prototype.onStatusToApplyChange = function (status_to_apply) {
        this.triggeredTaskForm.patchValue({ status_to_apply: status_to_apply });
    };
    NewTriggeredTaskPage.prototype.onThingToApplyChange = function (thing) {
        this.loadThingStatus(thing);
    };
    NewTriggeredTaskPage.prototype.onToApplyChange = function (toApply) {
        if (this.triggeredTaskForm.controls.scenario_id)
            this.triggeredTaskForm.controls.scenario_id.reset();
        if (this.triggeredTaskForm.controls.thing_id)
            this.triggeredTaskForm.controls.thing_id.reset();
        if (this.triggeredTaskForm.controls.status)
            this.triggeredTaskForm.controls.status.reset();
        this.toApply = toApply;
    };
    NewTriggeredTaskPage.prototype.validForm = function () {
        return this.triggeredTaskForm.valid &&
            ((this.triggeredTaskForm.value.thing_id && this.triggeredTaskForm.value.status_to_apply) || this.triggeredTaskForm.value.scenario_id);
    };
    NewTriggeredTaskPage.prototype.onSubmit = function (form) {
        return __awaiter(this, void 0, void 0, function () {
            var triggered_task;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        triggered_task = this.buildTriggeredTask(form);
                        if (!this.editMode) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.homewatch.triggeredTasks(this.home).updateTriggeredTask(form.value.id, triggered_task)];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this.homewatch.triggeredTasks(this.home).createTriggeredTask(triggered_task)];
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
    NewTriggeredTaskPage.prototype.buildTriggeredTask = function (form) {
        try {
            var status_to_compare = JSON.parse(form.value.status_to_compare);
            var triggered_task = { status_to_apply: undefined, thing_id: null, scenario_id: null, thing_to_compare_id: form.value.thing_to_compare_id, status_to_compare: status_to_compare, comparator: form.value.comparator.trim() };
            if (this.toApply === "thing") {
                triggered_task.thing_id = form.value.thing_id;
                triggered_task.status_to_apply = form.value.status_to_apply;
            }
            else if (this.toApply === "scenario") {
                triggered_task.scenario_id = form.value.scenario_id;
            }
            return triggered_task;
        }
        catch (error) {
            console.error(error);
        }
    };
    return NewTriggeredTaskPage;
}());
__decorate([
    core_1.ViewChild("thingStatus", { read: core_1.ViewContainerRef })
], NewTriggeredTaskPage.prototype, "thingStatus", void 0);
NewTriggeredTaskPage = __decorate([
    core_1.Component({
        selector: "new-triggered-task-page",
        templateUrl: "new.html"
    })
], NewTriggeredTaskPage);
exports.NewTriggeredTaskPage = NewTriggeredTaskPage;
