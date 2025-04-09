"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleLog = void 0;
class SimpleLog {
    constructor(apiKey, initOpts) {
        this.apiKey = apiKey;
        this.endpoint =
            (initOpts === null || initOpts === void 0 ? void 0 : initOpts.endpoint) ||
                process.env.SIMPLE_LOG_URL ||
                "http://localhost:3090";
        if (initOpts === null || initOpts === void 0 ? void 0 : initOpts.autoTrackRoutes) {
            this.setupAutoRouteTracking();
        }
    }
    trackEvent(event, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const isClient = typeof window !== "undefined" && typeof navigator !== "undefined";
            const body = {
                event: event,
                metadata: metadata,
                timestamp: new Date().toISOString(),
                url: isClient ? window === null || window === void 0 ? void 0 : window.location.href : undefined,
                userAgent: isClient ? navigator.userAgent : undefined,
            };
            const trackUrl = `${this.endpoint}/trackEvent`;
            try {
                yield fetch(trackUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                    body: JSON.stringify(body),
                });
            }
            catch (err) {
                console.error("[SimpleLog SDK] Failed to track event", err);
            }
        });
    }
    setupAutoRouteTracking() {
        if (typeof window === "undefined")
            return;
        let lastPath = window.location.pathname;
        const trackIfChanged = () => {
            const currentPath = window.location.pathname;
            if (currentPath !== lastPath) {
                lastPath = currentPath;
                this.trackEvent("route_changed", {
                    path: currentPath,
                });
            }
        };
        // Patch pushState + replaceState
        const patchHistoryMethod = (type) => {
            const original = history[type];
            history[type] = function (...args) {
                const result = original.apply(this, args);
                window.dispatchEvent(new Event(type));
                return result;
            };
        };
        patchHistoryMethod("pushState");
        patchHistoryMethod("replaceState");
        window.addEventListener("popstate", trackIfChanged);
        window.addEventListener("pushState", trackIfChanged);
        window.addEventListener("replaceState", trackIfChanged);
        // Initial fire
        trackIfChanged();
    }
}
exports.SimpleLog = SimpleLog;
