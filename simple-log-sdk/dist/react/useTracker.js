"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTracker = void 0;
const react_1 = require("react");
const TrackerProvider_1 = require("./TrackerProvider");
const useTracker = () => {
    const context = (0, react_1.useContext)(TrackerProvider_1.TrackerContext);
    if (!context)
        throw new Error("useTracker must be used within TrackerProvider");
    return context;
};
exports.useTracker = useTracker;
