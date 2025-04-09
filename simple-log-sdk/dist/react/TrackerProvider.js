"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackerProvider = exports.TrackerContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const tracker_1 = require("../core/tracker");
exports.TrackerContext = (0, react_1.createContext)(null);
const TrackerProvider = ({ apiKey, initOpts, children, }) => {
    const [tracker] = (0, react_1.useState)(() => tracker_1.SimpleLogTracker.getInstance());
    const hasInitialized = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!hasInitialized.current) {
            tracker.init(apiKey, initOpts);
            hasInitialized.current = true;
        }
    }, [apiKey, tracker]);
    return ((0, jsx_runtime_1.jsx)(exports.TrackerContext.Provider, { value: tracker, children: children }));
};
exports.TrackerProvider = TrackerProvider;
