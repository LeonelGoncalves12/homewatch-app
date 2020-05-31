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
var new_1 = require("../new/new");
var array_sorter_1 = require("../../../helpers/array_sorter");
var new_2 = require("../../things/new/new");
var edit_1 = require("../edit/edit");
var show_1 = require("../../things/show/show");
var popover2_1 = require("../../things/show/popover2");
/**
 * Generated class for the ListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
var ListRoomPage = (function () {
    function ListRoomPage(navCtrl, navParams, homewatchApiService, popoverCtrl, events, compFactoryResolver, homewatchSockets, toastCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.popoverCtrl = popoverCtrl;
        this.events = events;
        this.compFactoryResolver = compFactoryResolver;
        this.homewatchSockets = homewatchSockets;
        this.toastCtrl = toastCtrl;
        this.rooms = [];
        this.things = [];
        this.homewatch = homewatchApiService.getApi();
        this.home = this.navParams.get("home");
    }
    ListRoomPage.prototype.ionViewWillEnter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, i, resp, j, respstatus, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        this.user = this.navParams.get("user");
                        return [4 /*yield*/, this.homewatch.rooms(this.home).listRooms()];
                    case 1:
                        response = _a.sent();
                        this.rooms = array_sorter_1.ArraySorterHelper.sortArrayByID(response.data);
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < this.rooms.length)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.homewatch.things(this.rooms[i]).listThings()];
                    case 3:
                        resp = _a.sent();
                        j = 0;
                        _a.label = 4;
                    case 4:
                        if (!(j < resp.data.length)) return [3 /*break*/, 7];
                        return [4 /*yield*/, this.homewatch.status(resp.data[j]).getStatus()];
                    case 5:
                        respstatus = _a.sent();
                        resp.data[j].status = respstatus.data;
                        resp.data[j].room = this.rooms[i].id;
                        this.things.push(resp.data[j]);
                        _a.label = 6;
                    case 6:
                        j++;
                        return [3 /*break*/, 4];
                    case 7:
                        i++;
                        return [3 /*break*/, 2];
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    ListRoomPage.prototype.newRoom = function (home) {
        this.navCtrl.push(new_1.NewRoomPage, { home: home });
    };
    ListRoomPage.prototype.editRoom = function (room) {
        this.navCtrl.push(edit_1.EditRoomPage, { room: room });
    };
    ListRoomPage.prototype.newDevice = function (room) {
        this.navCtrl.push(new_2.NewThingPage, { room: room });
    };
    ListRoomPage.prototype.showDevice = function (thing) {
        this.navCtrl.push(show_1.ShowThingPage, { thing: thing });
    };
    ListRoomPage.prototype.editDevice = function (thing, room) {
        this.navCtrl.push(new_2.NewThingPage, { thing: thing, room: room });
    };
    ListRoomPage.prototype.showPopover = function (thing, room) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var popover;
            return __generator(this, function (_a) {
                console.error(thing);
                console.error(room);
                popover = this.popoverCtrl.create(popover2_1.ThingPopoverPage, {
                    thing: thing,
                    room: room,
                    home: this.home
                }, { cssClass: 'backdropOpacityPopover' });
                popover.onDidDismiss(function (stat) {
                    if (!stat) {
                        _this.ionViewWillEnter();
                    }
                    else {
                        console.error(thing);
                        console.error(room);
                        _this.navCtrl.push(new_2.NewThingPage, { thing: thing, room: room });
                    }
                    console.error('Dismissed loading');
                });
                popover.present();
                return [2 /*return*/];
            });
        });
    };
    return ListRoomPage;
}());
__decorate([
    core_1.ViewChild("thingStatus", { read: core_1.ViewContainerRef })
], ListRoomPage.prototype, "thingStatus", void 0);
ListRoomPage = __decorate([
    core_1.Component({
        selector: 'room-page',
        templateUrl: 'list.html'
    })
], ListRoomPage);
exports.ListRoomPage = ListRoomPage;
