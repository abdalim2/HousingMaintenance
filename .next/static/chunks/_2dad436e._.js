(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push([typeof document === "object" ? document.currentScript : undefined, {

"[project]/src/app/api/server-actions/data:89863e [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"404fa6998a25bd6df7763bdd9542da276326616b77":"getInventoryAction"},"src/app/api/server-actions/inventory-actions.ts",""] */ __turbopack_context__.s({
    "getInventoryAction": (()=>getInventoryAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getInventoryAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("404fa6998a25bd6df7763bdd9542da276326616b77", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getInventoryAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vaW52ZW50b3J5LWFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xyXG5cclxuaW1wb3J0IHsgXHJcbiAgZ2V0SW52ZW50b3J5LFxyXG4gIGdldExvd1N0b2NrSXRlbXMsXHJcbiAgZ2V0Q2F0ZWdvcmllcyxcclxuICBnZXRJdGVtcyxcclxuICBnZXRJdGVtQnlJZCxcclxuICBjcmVhdGVJdGVtLFxyXG4gIHVwZGF0ZUl0ZW0sXHJcbiAgdXBkYXRlSW52ZW50b3J5UXVhbnRpdHlcclxufSBmcm9tICdAL2xpYi9zZXJ2aWNlcy9pbnZlbnRvcnlTZXJ2aWNlJztcclxuaW1wb3J0IHsgSXRlbSwgSW52ZW50b3J5V2l0aEl0ZW0gfSBmcm9tICdAL21vZGVscy90eXBlcyc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0SW52ZW50b3J5QWN0aW9uKGl0ZW1JZD86IHN0cmluZykge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpbnZlbnRvcnkgPSBhd2FpdCBnZXRJbnZlbnRvcnkoaXRlbUlkKTtcclxuICAgIHJldHVybiB7IGRhdGE6IGludmVudG9yeSwgZXJyb3I6IG51bGwgfTtcclxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCfYrti32KMg2YHZiiDYrNmE2Kgg2KjZitin2YbYp9iqINin2YTZhdiu2LLZiNmGOicsIGVycm9yKTtcclxuICAgIHJldHVybiB7IGRhdGE6IFtdLCBlcnJvcjogYNmB2LTZhCDZgdmKINis2YTYqCDYqNmK2KfZhtin2Kog2KfZhNmF2K7YstmI2YY6ICR7ZXJyb3IubWVzc2FnZSB8fCAn2K7Yt9ijINi62YrYsSDZhdi52LHZiNmBJ31gIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TG93U3RvY2tJdGVtc0FjdGlvbih0aHJlc2hvbGQ6IG51bWJlciA9IDEwKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgZ2V0TG93U3RvY2tJdGVtcyh0aHJlc2hvbGQpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogaXRlbXMsIGVycm9yOiBudWxsIH07XHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5lcnJvcign2K7Yt9ijINmB2Yog2KzZhNioINin2YTYudmG2KfYtdixINmF2YbYrtmB2LbYqSDYp9mE2YXYrtiy2YjZhjonLCBlcnJvcik7XHJcbiAgICByZXR1cm4geyBkYXRhOiBbXSwgZXJyb3I6IGDZgdi02YQg2YHZiiDYrNmE2Kgg2KfZhNi52YbYp9i12LEg2YXZhtiu2YHYttipINin2YTZhdiu2LLZiNmGOiAke2Vycm9yLm1lc3NhZ2UgfHwgJ9iu2LfYoyDYutmK2LEg2YXYudix2YjZgSd9YCB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENhdGVnb3JpZXNBY3Rpb24oKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBhd2FpdCBnZXRDYXRlZ29yaWVzKCk7XHJcbiAgICByZXR1cm4geyBkYXRhOiBjYXRlZ29yaWVzLCBlcnJvcjogbnVsbCB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ9iu2LfYoyDZgdmKINis2YTYqCDYp9mE2YHYptin2Ko6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogW10sIGVycm9yOiBg2YHYtNmEINmB2Yog2KzZhNioINin2YTZgdim2KfYqjogJHtlcnJvci5tZXNzYWdlIHx8ICfYrti32KMg2LrZitixINmF2LnYsdmI2YEnfWAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRJdGVtc0FjdGlvbihjYXRlZ29yeUlkPzogc3RyaW5nKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgZ2V0SXRlbXMoY2F0ZWdvcnlJZCk7XHJcbiAgICByZXR1cm4geyBkYXRhOiBpdGVtcywgZXJyb3I6IG51bGwgfTtcclxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCfYrti32KMg2YHZiiDYrNmE2Kgg2KfZhNi52YbYp9i12LE6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogW10sIGVycm9yOiBg2YHYtNmEINmB2Yog2KzZhNioINin2YTYudmG2KfYtdixOiAke2Vycm9yLm1lc3NhZ2UgfHwgJ9iu2LfYoyDYutmK2LEg2YXYudix2YjZgSd9YCB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEl0ZW1CeUlkQWN0aW9uKGlkOiBzdHJpbmcpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXRlbSA9IGF3YWl0IGdldEl0ZW1CeUlkKGlkKTtcclxuICAgIHJldHVybiB7IGRhdGE6IGl0ZW0sIGVycm9yOiBudWxsIH07XHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5lcnJvcihg2K7Yt9ijINmB2Yog2KzZhNioINin2YTYudmG2LXYsSDYsdmC2YUgJHtpZH06YCwgZXJyb3IpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3I6IGDZgdi02YQg2YHZiiDYrNmE2Kgg2KfZhNi52YbYtdixOiAke2Vycm9yLm1lc3NhZ2UgfHwgJ9iu2LfYoyDYutmK2LEg2YXYudix2YjZgSd9YCB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUl0ZW1BY3Rpb24oaXRlbTogT21pdDxJdGVtLCAnaWQnPikge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBuZXdJdGVtID0gYXdhaXQgY3JlYXRlSXRlbShpdGVtKTtcclxuICAgIHJldHVybiB7IGRhdGE6IG5ld0l0ZW0sIGVycm9yOiBudWxsIH07XHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5lcnJvcign2K7Yt9ijINmB2Yog2KXZhti02KfYoSDYudmG2LXYsSDYrNiv2YrYrzonLCBlcnJvcik7XHJcbiAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvcjogYNmB2LTZhCDZgdmKINil2YbYtNin2KEg2KfZhNi52YbYtdixOiAke2Vycm9yLm1lc3NhZ2UgfHwgJ9iu2LfYoyDYutmK2LEg2YXYudix2YjZgSd9YCB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUl0ZW1BY3Rpb24oaWQ6IHN0cmluZywgdXBkYXRlczogUGFydGlhbDxJdGVtPikge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB1cGRhdGVkSXRlbSA9IGF3YWl0IHVwZGF0ZUl0ZW0oaWQsIHVwZGF0ZXMpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogdXBkYXRlZEl0ZW0sIGVycm9yOiBudWxsIH07XHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5lcnJvcihg2K7Yt9ijINmB2Yog2KrYrdiv2YrYqyDYp9mE2LnZhti12LEg2LHZgtmFICR7aWR9OmAsIGVycm9yKTtcclxuICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yOiBg2YHYtNmEINmB2Yog2KrYrdiv2YrYqyDYp9mE2LnZhti12LE6ICR7ZXJyb3IubWVzc2FnZSB8fCAn2K7Yt9ijINi62YrYsSDZhdi52LHZiNmBJ31gIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlSW52ZW50b3J5UXVhbnRpdHlBY3Rpb24oaXRlbUlkOiBzdHJpbmcsIHF1YW50aXR5Q2hhbmdlOiBudW1iZXIpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgdXBkYXRlZEludmVudG9yeSA9IGF3YWl0IHVwZGF0ZUludmVudG9yeVF1YW50aXR5KGl0ZW1JZCwgcXVhbnRpdHlDaGFuZ2UpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogdXBkYXRlZEludmVudG9yeSwgZXJyb3I6IG51bGwgfTtcclxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKGDYrti32KMg2YHZiiDYqtit2K/ZitirINmD2YXZitipINin2YTZhdiu2LLZiNmGINmE2YTYudmG2LXYsSDYsdmC2YUgJHtpdGVtSWR9OmAsIGVycm9yKTtcclxuICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yOiBg2YHYtNmEINmB2Yog2KrYrdiv2YrYqyDZg9mF2YrYqSDYp9mE2YXYrtiy2YjZhjogJHtlcnJvci5tZXNzYWdlIHx8ICfYrti32KMg2LrZitixINmF2LnYsdmI2YEnfWAgfTtcclxuICB9XHJcbn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjJUQWNzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/api/server-actions/data:36c54c [app-client] (ecmascript) <text/javascript>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00c6e5b21a5046bd2746e640af967b35e4c7524cc3":"getCategoriesAction"},"src/app/api/server-actions/inventory-actions.ts",""] */ __turbopack_context__.s({
    "getCategoriesAction": (()=>getCategoriesAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getCategoriesAction = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("00c6e5b21a5046bd2746e640af967b35e4c7524cc3", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getCategoriesAction"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vaW52ZW50b3J5LWFjdGlvbnMudHMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzZXJ2ZXInO1xyXG5cclxuaW1wb3J0IHsgXHJcbiAgZ2V0SW52ZW50b3J5LFxyXG4gIGdldExvd1N0b2NrSXRlbXMsXHJcbiAgZ2V0Q2F0ZWdvcmllcyxcclxuICBnZXRJdGVtcyxcclxuICBnZXRJdGVtQnlJZCxcclxuICBjcmVhdGVJdGVtLFxyXG4gIHVwZGF0ZUl0ZW0sXHJcbiAgdXBkYXRlSW52ZW50b3J5UXVhbnRpdHlcclxufSBmcm9tICdAL2xpYi9zZXJ2aWNlcy9pbnZlbnRvcnlTZXJ2aWNlJztcclxuaW1wb3J0IHsgSXRlbSwgSW52ZW50b3J5V2l0aEl0ZW0gfSBmcm9tICdAL21vZGVscy90eXBlcyc7XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0SW52ZW50b3J5QWN0aW9uKGl0ZW1JZD86IHN0cmluZykge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBpbnZlbnRvcnkgPSBhd2FpdCBnZXRJbnZlbnRvcnkoaXRlbUlkKTtcclxuICAgIHJldHVybiB7IGRhdGE6IGludmVudG9yeSwgZXJyb3I6IG51bGwgfTtcclxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCfYrti32KMg2YHZiiDYrNmE2Kgg2KjZitin2YbYp9iqINin2YTZhdiu2LLZiNmGOicsIGVycm9yKTtcclxuICAgIHJldHVybiB7IGRhdGE6IFtdLCBlcnJvcjogYNmB2LTZhCDZgdmKINis2YTYqCDYqNmK2KfZhtin2Kog2KfZhNmF2K7YstmI2YY6ICR7ZXJyb3IubWVzc2FnZSB8fCAn2K7Yt9ijINi62YrYsSDZhdi52LHZiNmBJ31gIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TG93U3RvY2tJdGVtc0FjdGlvbih0aHJlc2hvbGQ6IG51bWJlciA9IDEwKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgZ2V0TG93U3RvY2tJdGVtcyh0aHJlc2hvbGQpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogaXRlbXMsIGVycm9yOiBudWxsIH07XHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5lcnJvcign2K7Yt9ijINmB2Yog2KzZhNioINin2YTYudmG2KfYtdixINmF2YbYrtmB2LbYqSDYp9mE2YXYrtiy2YjZhjonLCBlcnJvcik7XHJcbiAgICByZXR1cm4geyBkYXRhOiBbXSwgZXJyb3I6IGDZgdi02YQg2YHZiiDYrNmE2Kgg2KfZhNi52YbYp9i12LEg2YXZhtiu2YHYttipINin2YTZhdiu2LLZiNmGOiAke2Vycm9yLm1lc3NhZ2UgfHwgJ9iu2LfYoyDYutmK2LEg2YXYudix2YjZgSd9YCB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldENhdGVnb3JpZXNBY3Rpb24oKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGNhdGVnb3JpZXMgPSBhd2FpdCBnZXRDYXRlZ29yaWVzKCk7XHJcbiAgICByZXR1cm4geyBkYXRhOiBjYXRlZ29yaWVzLCBlcnJvcjogbnVsbCB9O1xyXG4gIH0gY2F0Y2ggKGVycm9yOiBhbnkpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ9iu2LfYoyDZgdmKINis2YTYqCDYp9mE2YHYptin2Ko6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogW10sIGVycm9yOiBg2YHYtNmEINmB2Yog2KzZhNioINin2YTZgdim2KfYqjogJHtlcnJvci5tZXNzYWdlIHx8ICfYrti32KMg2LrZitixINmF2LnYsdmI2YEnfWAgfTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRJdGVtc0FjdGlvbihjYXRlZ29yeUlkPzogc3RyaW5nKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IGl0ZW1zID0gYXdhaXQgZ2V0SXRlbXMoY2F0ZWdvcnlJZCk7XHJcbiAgICByZXR1cm4geyBkYXRhOiBpdGVtcywgZXJyb3I6IG51bGwgfTtcclxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKCfYrti32KMg2YHZiiDYrNmE2Kgg2KfZhNi52YbYp9i12LE6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogW10sIGVycm9yOiBg2YHYtNmEINmB2Yog2KzZhNioINin2YTYudmG2KfYtdixOiAke2Vycm9yLm1lc3NhZ2UgfHwgJ9iu2LfYoyDYutmK2LEg2YXYudix2YjZgSd9YCB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEl0ZW1CeUlkQWN0aW9uKGlkOiBzdHJpbmcpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgaXRlbSA9IGF3YWl0IGdldEl0ZW1CeUlkKGlkKTtcclxuICAgIHJldHVybiB7IGRhdGE6IGl0ZW0sIGVycm9yOiBudWxsIH07XHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5lcnJvcihg2K7Yt9ijINmB2Yog2KzZhNioINin2YTYudmG2LXYsSDYsdmC2YUgJHtpZH06YCwgZXJyb3IpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogbnVsbCwgZXJyb3I6IGDZgdi02YQg2YHZiiDYrNmE2Kgg2KfZhNi52YbYtdixOiAke2Vycm9yLm1lc3NhZ2UgfHwgJ9iu2LfYoyDYutmK2LEg2YXYudix2YjZgSd9YCB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUl0ZW1BY3Rpb24oaXRlbTogT21pdDxJdGVtLCAnaWQnPikge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCBuZXdJdGVtID0gYXdhaXQgY3JlYXRlSXRlbShpdGVtKTtcclxuICAgIHJldHVybiB7IGRhdGE6IG5ld0l0ZW0sIGVycm9yOiBudWxsIH07XHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5lcnJvcign2K7Yt9ijINmB2Yog2KXZhti02KfYoSDYudmG2LXYsSDYrNiv2YrYrzonLCBlcnJvcik7XHJcbiAgICByZXR1cm4geyBkYXRhOiBudWxsLCBlcnJvcjogYNmB2LTZhCDZgdmKINil2YbYtNin2KEg2KfZhNi52YbYtdixOiAke2Vycm9yLm1lc3NhZ2UgfHwgJ9iu2LfYoyDYutmK2LEg2YXYudix2YjZgSd9YCB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHVwZGF0ZUl0ZW1BY3Rpb24oaWQ6IHN0cmluZywgdXBkYXRlczogUGFydGlhbDxJdGVtPikge1xyXG4gIHRyeSB7XHJcbiAgICBjb25zdCB1cGRhdGVkSXRlbSA9IGF3YWl0IHVwZGF0ZUl0ZW0oaWQsIHVwZGF0ZXMpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogdXBkYXRlZEl0ZW0sIGVycm9yOiBudWxsIH07XHJcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xyXG4gICAgY29uc29sZS5lcnJvcihg2K7Yt9ijINmB2Yog2KrYrdiv2YrYqyDYp9mE2LnZhti12LEg2LHZgtmFICR7aWR9OmAsIGVycm9yKTtcclxuICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yOiBg2YHYtNmEINmB2Yog2KrYrdiv2YrYqyDYp9mE2LnZhti12LE6ICR7ZXJyb3IubWVzc2FnZSB8fCAn2K7Yt9ijINi62YrYsSDZhdi52LHZiNmBJ31gIH07XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlSW52ZW50b3J5UXVhbnRpdHlBY3Rpb24oaXRlbUlkOiBzdHJpbmcsIHF1YW50aXR5Q2hhbmdlOiBudW1iZXIpIHtcclxuICB0cnkge1xyXG4gICAgY29uc3QgdXBkYXRlZEludmVudG9yeSA9IGF3YWl0IHVwZGF0ZUludmVudG9yeVF1YW50aXR5KGl0ZW1JZCwgcXVhbnRpdHlDaGFuZ2UpO1xyXG4gICAgcmV0dXJuIHsgZGF0YTogdXBkYXRlZEludmVudG9yeSwgZXJyb3I6IG51bGwgfTtcclxuICB9IGNhdGNoIChlcnJvcjogYW55KSB7XHJcbiAgICBjb25zb2xlLmVycm9yKGDYrti32KMg2YHZiiDYqtit2K/ZitirINmD2YXZitipINin2YTZhdiu2LLZiNmGINmE2YTYudmG2LXYsSDYsdmC2YUgJHtpdGVtSWR9OmAsIGVycm9yKTtcclxuICAgIHJldHVybiB7IGRhdGE6IG51bGwsIGVycm9yOiBg2YHYtNmEINmB2Yog2KrYrdiv2YrYqyDZg9mF2YrYqSDYp9mE2YXYrtiy2YjZhjogJHtlcnJvci5tZXNzYWdlIHx8ICfYrti32KMg2LrZitixINmF2LnYsdmI2YEnfWAgfTtcclxuICB9XHJcbn0iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjRUQWtDc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/src/app/inventory/page.tsx [app-client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, k: __turbopack_refresh__, m: module } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>InventoryPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$data$3a$89863e__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/data:89863e [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$data$3a$36c54c__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/data:36c54c [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function InventoryPage() {
    _s();
    const [inventory, setInventory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Filter state
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [searchTerm, setSearchTerm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [showLowStock, setShowLowStock] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Load inventory and categories
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "InventoryPage.useEffect": ()=>{
            const fetchData = {
                "InventoryPage.useEffect.fetchData": async ()=>{
                    setLoading(true);
                    setError(null);
                    try {
                        const [inventoryResult, categoriesResult] = await Promise.all([
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$data$3a$89863e__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getInventoryAction"])(),
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$data$3a$36c54c__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getCategoriesAction"])()
                        ]);
                        if (inventoryResult.error) {
                            throw new Error(inventoryResult.error);
                        }
                        if (categoriesResult.error) {
                            throw new Error(categoriesResult.error);
                        }
                        setInventory(inventoryResult.data);
                        setCategories(categoriesResult.data);
                    } catch (err) {
                        console.error('Error fetching inventory data:', err);
                        setError(err.message || 'حدث خطأ أثناء تحميل بيانات المخزون. الرجاء المحاولة مرة أخرى.');
                    } finally{
                        setLoading(false);
                    }
                }
            }["InventoryPage.useEffect.fetchData"];
            fetchData();
        }
    }["InventoryPage.useEffect"], []);
    // Filter inventory based on selected filters
    const filteredInventory = inventory.filter((item)=>{
        const matchesCategory = selectedCategory ? item.items.category_id === selectedCategory : true;
        const matchesSearch = searchTerm ? item.items.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
        const matchesLowStock = showLowStock ? item.quantity <= 5 : true;
        return matchesCategory && matchesSearch && matchesLowStock;
    });
    // Group by category for display
    const inventoryByCategory = filteredInventory.reduce((acc, item)=>{
        const categoryId = item.items.category_id;
        if (!acc[categoryId]) {
            acc[categoryId] = [];
        }
        acc[categoryId].push(item);
        return acc;
    }, {});
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold",
                        children: "المخزون"
                    }, void 0, false, {
                        fileName: "[project]/src/app/inventory/page.tsx",
                        lineNumber: 81,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/inventory/categories",
                                className: "btn btn-secondary",
                                children: "إدارة الأصناف"
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 83,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/inventory/add",
                                className: "btn btn-primary",
                                children: "إضافة مخزون"
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/inventory/page.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/inventory/page.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/inventory/page.tsx",
                    lineNumber: 94,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/inventory/page.tsx",
                lineNumber: 93,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow rounded-lg p-6 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold mb-4",
                        children: "تصفية المخزون"
                    }, void 0, false, {
                        fileName: "[project]/src/app/inventory/page.tsx",
                        lineNumber: 100,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 text-sm font-medium",
                                        children: "البحث بالاسم"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/inventory/page.tsx",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: searchTerm,
                                        onChange: (e)=>setSearchTerm(e.target.value),
                                        placeholder: "ادخل اسم الصنف...",
                                        className: "input w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/inventory/page.tsx",
                                        lineNumber: 104,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 text-sm font-medium",
                                        children: "التصنيف"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/inventory/page.tsx",
                                        lineNumber: 114,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: selectedCategory,
                                        onChange: (e)=>setSelectedCategory(e.target.value),
                                        className: "select w-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "جميع التصنيفات"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/inventory/page.tsx",
                                                lineNumber: 120,
                                                columnNumber: 15
                                            }, this),
                                            categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: category.id,
                                                    children: category.name
                                                }, category.id, false, {
                                                    fileName: "[project]/src/app/inventory/page.tsx",
                                                    lineNumber: 122,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/inventory/page.tsx",
                                        lineNumber: 115,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 113,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: showLowStock,
                                            onChange: (e)=>setShowLowStock(e.target.checked),
                                            className: "w-5 h-5 ml-2"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/inventory/page.tsx",
                                            lineNumber: 131,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: "عرض المخزون المنخفض فقط (أقل من 5)"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/inventory/page.tsx",
                                            lineNumber: 137,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/inventory/page.tsx",
                                    lineNumber: 130,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/inventory/page.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/inventory/page.tsx",
                lineNumber: 99,
                columnNumber: 7
            }, this),
            loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center py-10",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-lg",
                    children: "جاري تحميل البيانات..."
                }, void 0, false, {
                    fileName: "[project]/src/app/inventory/page.tsx",
                    lineNumber: 146,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/inventory/page.tsx",
                lineNumber: 145,
                columnNumber: 9
            }, this) : filteredInventory.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow-md rounded-lg p-6 text-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-lg text-gray-500",
                    children: "لا توجد أصناف مطابقة للمعايير المحددة."
                }, void 0, false, {
                    fileName: "[project]/src/app/inventory/page.tsx",
                    lineNumber: 150,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/inventory/page.tsx",
                lineNumber: 149,
                columnNumber: 9
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: Object.keys(inventoryByCategory).map((categoryId)=>{
                    const categoryName = categories.find((c)=>c.id === categoryId)?.name || 'تصنيف غير معروف';
                    const items = inventoryByCategory[categoryId];
                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white shadow-md rounded-lg overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 p-4 border-b",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-lg font-semibold",
                                    children: categoryName
                                }, void 0, false, {
                                    fileName: "[project]/src/app/inventory/page.tsx",
                                    lineNumber: 161,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 160,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "overflow-x-auto",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                                    className: "min-w-full divide-y divide-gray-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                            className: "bg-gray-50",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "الصنف"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/inventory/page.tsx",
                                                        lineNumber: 167,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "الكمية المتوفرة"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/inventory/page.tsx",
                                                        lineNumber: 170,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "الوحدة"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/inventory/page.tsx",
                                                        lineNumber: 173,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "سعر الوحدة"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/inventory/page.tsx",
                                                        lineNumber: 176,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "آخر تحديث"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/inventory/page.tsx",
                                                        lineNumber: 179,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                        className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                        children: "إجراءات"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/inventory/page.tsx",
                                                        lineNumber: 182,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/inventory/page.tsx",
                                                lineNumber: 166,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/inventory/page.tsx",
                                            lineNumber: 165,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                            className: "bg-white divide-y divide-gray-200",
                                            children: items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                                    className: `hover:bg-gray-50 ${item.quantity <= 5 ? 'bg-red-50' : ''}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-4",
                                                            children: item.items.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/inventory/page.tsx",
                                                            lineNumber: 190,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-4",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: item.quantity <= 5 ? 'font-bold text-red-600' : '',
                                                                children: item.quantity
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/inventory/page.tsx",
                                                                lineNumber: 194,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/inventory/page.tsx",
                                                            lineNumber: 193,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-4",
                                                            children: item.items.unit
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/inventory/page.tsx",
                                                            lineNumber: 198,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-4",
                                                            children: item.unit_price ? `${item.unit_price} ريال` : 'غير محدد'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/inventory/page.tsx",
                                                            lineNumber: 201,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-4",
                                                            dir: "ltr",
                                                            children: new Date(item.last_updated).toLocaleDateString('ar-SA')
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/inventory/page.tsx",
                                                            lineNumber: 204,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                            className: "px-4 py-4 text-sm",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: `/inventory/adjust/${item.id}`,
                                                                    className: "text-primary hover:underline ml-2",
                                                                    children: "تعديل الكمية"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventory/page.tsx",
                                                                    lineNumber: 208,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                    href: `/inventory/history/${item.items.id}`,
                                                                    className: "text-secondary hover:underline",
                                                                    children: "سجل الحركة"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/app/inventory/page.tsx",
                                                                    lineNumber: 214,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/inventory/page.tsx",
                                                            lineNumber: 207,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, item.id, true, {
                                                    fileName: "[project]/src/app/inventory/page.tsx",
                                                    lineNumber: 189,
                                                    columnNumber: 25
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/inventory/page.tsx",
                                            lineNumber: 187,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/inventory/page.tsx",
                                    lineNumber: 164,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 163,
                                columnNumber: 17
                            }, this)
                        ]
                    }, categoryId, true, {
                        fileName: "[project]/src/app/inventory/page.tsx",
                        lineNumber: 159,
                        columnNumber: 15
                    }, this);
                })
            }, void 0, false, {
                fileName: "[project]/src/app/inventory/page.tsx",
                lineNumber: 153,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-3 gap-6 mt-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card bg-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-gray-700",
                                children: "إجمالي الأصناف"
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-3xl font-bold",
                                children: inventory.length
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 236,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/inventory/page.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card bg-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-gray-700",
                                children: "الأصناف منخفضة المخزون"
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 240,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-3xl font-bold",
                                children: inventory.filter((item)=>item.quantity <= 5).length
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/inventory/page.tsx",
                        lineNumber: 239,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card bg-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-gray-700",
                                children: "التصنيفات"
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 247,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-3xl font-bold",
                                children: categories.length
                            }, void 0, false, {
                                fileName: "[project]/src/app/inventory/page.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/inventory/page.tsx",
                        lineNumber: 246,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/inventory/page.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/inventory/page.tsx",
        lineNumber: 79,
        columnNumber: 5
    }, this);
}
_s(InventoryPage, "L1T23GRmxRIhg7aKfzdiSAgG/pc=");
_c = InventoryPage;
var _c;
__turbopack_context__.k.register(_c, "InventoryPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
// This file must be bundled in the app's client layer, it shouldn't be directly
// imported by the server.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    callServer: null,
    createServerReference: null,
    findSourceMapURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    callServer: function() {
        return _appcallserver.callServer;
    },
    createServerReference: function() {
        return createServerReference;
    },
    findSourceMapURL: function() {
        return _appfindsourcemapurl.findSourceMapURL;
    }
});
const _appcallserver = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-call-server.js [app-client] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-find-source-map-url.js [app-client] (ecmascript)");
const createServerReference = (("TURBOPACK compile-time falsy", 0) ? ("TURBOPACK unreachable", undefined) : __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-server-dom-turbopack/client.js [app-client] (ecmascript)")).createServerReference; //# sourceMappingURL=action-client-wrapper.js.map
}}),
}]);

//# sourceMappingURL=_2dad436e._.js.map