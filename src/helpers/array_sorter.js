"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var things_info_1 = require("./things_info");
var ArraySorterHelper = (function () {
    function ArraySorterHelper() {
    }
    ArraySorterHelper.sortArrayByID = function (array) {
        return array.sort(function (a, b) { return a.id - b.id; });
    };
    ArraySorterHelper.filterAssignableThings = function (things) {
        return things.filter(function (t) { return things_info_1.ThingsInfoHelper.getThingInfo(t.type).readOnly === false; });
    };
    return ArraySorterHelper;
}());
exports.ArraySorterHelper = ArraySorterHelper;
