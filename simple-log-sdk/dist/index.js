"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSimpleLogTracker = exports.SimpleLogTrackerProvider = exports.SimpleLogTracker = void 0;
var tracker_1 = require("./core/tracker");
Object.defineProperty(exports, "SimpleLogTracker", { enumerable: true, get: function () { return tracker_1.SimpleLogTracker; } });
var TrackerProvider_1 = require("./react/TrackerProvider");
Object.defineProperty(exports, "SimpleLogTrackerProvider", { enumerable: true, get: function () { return TrackerProvider_1.TrackerProvider; } });
var useTracker_1 = require("./react/useTracker");
Object.defineProperty(exports, "useSimpleLogTracker", { enumerable: true, get: function () { return useTracker_1.useTracker; } });
