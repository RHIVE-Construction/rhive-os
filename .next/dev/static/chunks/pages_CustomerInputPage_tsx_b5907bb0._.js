(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/pages/CustomerInputPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PageContainer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/PageContainer.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/icons.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$MockDatabaseContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/MockDatabaseContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/NavigationContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$PricingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/PricingContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGoogleMapsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useGoogleMapsApi.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WeatherReport$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/WeatherReport.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature(), _s3 = __turbopack_context__.k.signature(), _s4 = __turbopack_context__.k.signature(), _s5 = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
;
;
;
;
;
const MAPS_API_KEY = 'AIzaSyAyDim_1uOJy6rS_GZ-EwNKmJyCrvSvqRA';
// --- Reusable UI Components ---
const SectionHeader = ({ title, icon: Icon, className })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center space-x-4 pb-2 mb-6 border-b border-gray-800/30", className),
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center text-white font-semibold text-lg uppercase tracking-tight",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: "w-5 h-5 mr-2 text-gray-400"
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 56,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                title
            ]
        }, void 0, true, {
            fileName: "[project]/pages/CustomerInputPage.tsx",
            lineNumber: 55,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 54,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c = SectionHeader;
const QuestionLabel = ({ children, required, isPink })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("block text-[11px] font-bold uppercase tracking-widest mb-2", isPink ? "text-white" : "text-gray-400"),
        children: [
            children,
            required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[#ec028b] ml-1",
                children: "*"
            }, void 0, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 68,
                columnNumber: 22
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 63,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c1 = QuestionLabel;
const InputField = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].forwardRef((props, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
        ref: ref,
        ...props,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full bg-black/30 border border-gray-800 px-4 py-3 text-white focus:border-white/50 focus:ring-1 focus:ring-white/20 focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed", props.className),
        style: {
            clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
            ...props.style
        }
    }, void 0, false, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 73,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0)));
_c2 = InputField;
InputField.displayName = "InputField";
const ToggleGroup = ({ options, value, onChange })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
        children: options.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: ()=>onChange(option),
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("cursor-pointer px-4 py-2.5 border text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center text-center backdrop-blur-sm", value === option ? "bg-white/10 border-white/50 text-white shadow-xl" : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white"),
                style: {
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)"
                },
                children: option
            }, option, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 91,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)))
    }, void 0, false, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c3 = ToggleGroup;
const MultiSelectGroup = ({ options, selected, onChange })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "grid grid-cols-1 sm:grid-cols-3 gap-2",
        children: options.map((option)=>{
            const isSelected = selected.includes(option);
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: ()=>onChange(option),
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("cursor-pointer px-4 py-2 border text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center text-center backdrop-blur-sm", isSelected ? "bg-white/10 border-white/50 text-white shadow-xl" : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-white"),
                style: {
                    clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    children: option
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 124,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            }, option, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 113,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0));
        })
    }, void 0, false, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 109,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c4 = MultiSelectGroup;
const CalendarWidget = ({ onSelectSlot })=>{
    _s();
    const [selectedDate, setSelectedDate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedTime, setSelectedTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const dates = Array.from({
        length: 7
    }, (_, i)=>{
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return d;
    });
    const timeSlots = [
        "08:00 AM - 10:30 AM",
        "10:30 AM - 01:00 PM",
        "01:00 PM - 03:30 PM",
        "03:30 PM - 06:00 PM"
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-black/20 border border-gray-800 rounded-lg p-4 space-y-4 backdrop-blur-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex overflow-x-auto space-x-2 pb-2 scrollbar-hide",
                children: dates.map((date, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: (e)=>{
                            e.stopPropagation();
                            setSelectedDate(i);
                            setSelectedTime(null);
                        },
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex flex-col items-center justify-center min-w-[60px] h-16 border transition-all", selectedDate === i ? "bg-white/10 border-white/50 text-white" : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600"),
                        style: {
                            clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-[10px] uppercase font-black",
                                children: date.toLocaleDateString('en-US', {
                                    weekday: 'short'
                                })
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 148,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-black text-lg",
                                children: date.getDate()
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 149,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, i, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 142,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 140,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            selectedDate !== null && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 gap-2 animate-fade-in",
                children: timeSlots.map((slot)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>{
                            setSelectedTime(slot);
                            const dStr = dates[selectedDate].toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                            });
                            onSelectSlot(`${dStr} @ ${slot}`);
                        },
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-3 text-sm font-bold border transition-all text-left backdrop-blur-sm", selectedTime === slot ? "bg-white/10 border-white/50 text-white" : "bg-transparent border-gray-800 text-gray-400 hover:border-gray-500 hover:text-white"),
                        style: {
                            clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)"
                        },
                        children: slot
                    }, slot, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 156,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0)))
            }, void 0, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 154,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 139,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(CalendarWidget, "aYUbCepbjVmn5I9WWsVRRtVqo3A=");
_c5 = CalendarWidget;
const SolarIntelligenceOverlay = ({ data })=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 pointer-events-none overflow-hidden isolate",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(236,2,139,0.05)_100%)]"
            }, void 0, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 191,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#ec028b]/20 rounded-full animate-pulse flex items-center justify-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-[1px] bg-[#ec028b]/10 absolute rotate-45"
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 195,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-full h-[1px] bg-[#ec028b]/10 absolute -rotate-45"
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 196,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-32 h-32 border border-[#ec028b]/40 rounded-full"
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 197,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 194,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-10 left-10 p-4 bg-black/60 backdrop-blur-md border border-[#ec028b]/30 text-white space-y-2 animate-fade-in",
                style: {
                    clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[9px] text-[#ec028b] font-black uppercase tracking-widest",
                        children: "Building Intelligence"
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 203,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 text-[10px] font-bold uppercase",
                                children: "Estimated Area"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 205,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-xs",
                                children: "3,450 SQ FT"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 206,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 204,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 text-[10px] font-bold uppercase",
                                children: "Roof Pitch"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 209,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-xs text-[#ec028b]",
                                children: "8/12 - 10/12"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 210,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 208,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 text-[10px] font-bold uppercase",
                                children: "Complexity"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 213,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-xs text-gold",
                                children: "ELITE (14 Facets)"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 214,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 212,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 201,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-10 right-10 p-4 bg-black/60 backdrop-blur-md border border-[#08137C]/50 text-white space-y-2 animate-fade-in delay-150",
                style: {
                    clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[9px] text-blue-400 font-black uppercase tracking-widest",
                        children: "Solar API Index"
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 220,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 text-[10px] font-bold uppercase",
                                children: "Sunshine Exposure"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 222,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-xs",
                                children: "88% (Optimal)"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 223,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 221,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-gray-400 text-[10px] font-bold uppercase",
                                children: "Max Panel Count"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 226,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-mono text-xs",
                                children: "42 PANELS"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 227,
                                columnNumber: 21
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 225,
                        columnNumber: 17
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 218,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 left-0 w-full h-1 bg-[#ec028b]/20 blur-sm animate-[scan_4s_linear_infinite]"
            }, void 0, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 232,
                columnNumber: 13
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 189,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_c6 = SolarIntelligenceOverlay;
const AddressConfirmationModal = ({ data, onConfirm, onCancel })=>{
    _s1();
    const [view, setView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('satellite'); // Default to satellite for "scanning" feel
    const streetUrl = `https://maps.googleapis.com/maps/api/streetview?size=1024x512&location=${data.latitude},${data.longitude}&fov=90&pitch=10&key=${MAPS_API_KEY}`;
    const satUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${data.latitude},${data.longitude}&zoom=21&size=1024x512&maptype=satellite&key=${MAPS_API_KEY}`;
    const chamfer = 24;
    const clipPathValue = `polygon(${chamfer}px 0, 100% 0, 100% calc(100% - ${chamfer}px), calc(100% - ${chamfer}px) 100%, 0 100%, 0 ${chamfer}px)`;
    const ActionButton = ({ onClick, children, variant = 'secondary', icon: Icon })=>{
        const bChamfer = 8;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: onClick,
            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("relative px-5 py-2.5 flex items-center gap-2 group transition-all duration-300 isolate", variant === 'primary' ? "text-white" : "text-gray-400 hover:text-white"),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute inset-0 z-[-1] transition-all duration-300", variant === 'primary' ? "bg-white/10 border border-white/30 backdrop-blur-md shadow-xl" : "bg-black/50 border border-gray-800 group-hover:border-gray-500"),
                    style: {
                        clipPath: `polygon(${bChamfer}px 0, 100% 0, 100% calc(100% - ${bChamfer}px), calc(100% - ${bChamfer}px) 100%, 0 100%, 0 ${bChamfer}px)`
                    }
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 261,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                Icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                    className: "w-4 h-4"
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 268,
                    columnNumber: 26
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "font-black text-[10px] uppercase tracking-widest",
                    children: children
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 269,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/CustomerInputPage.tsx",
            lineNumber: 253,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[10000] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-black border border-gray-800 w-full max-w-5xl shadow-2xl animate-fade-in overflow-hidden",
            style: {
                clipPath: clipPathValue
            },
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative aspect-[2.2/1] bg-gray-950 border-b border-gray-800 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                            src: view === 'street' ? streetUrl : satUrl,
                            className: "w-full h-full object-cover transition-all duration-700",
                            alt: "Location Preview"
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 281,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20"
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 286,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        view === 'satellite' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SolarIntelligenceOverlay, {
                            data: data
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 289,
                            columnNumber: 46
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 280,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-6 bg-black relative",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row justify-between items-center gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex bg-gray-900 p-1 border border-gray-800 shrink-0",
                                style: {
                                    clipPath: `polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)`
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setView('street'),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300", view === 'street' ? "bg-white/10 text-white border border-white/20" : "text-gray-500 hover:text-gray-300"),
                                        style: {
                                            clipPath: `polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)`
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CameraIcon"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 304,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "Street View"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 295,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setView('satellite'),
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center gap-2 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-all duration-300", view === 'satellite' ? "bg-white/10 text-white border border-white/20" : "text-gray-500 hover:text-gray-300"),
                                        style: {
                                            clipPath: `polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100% , 0 100%, 0 3px)`
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SatelliteIcon"], {
                                                className: "w-3.5 h-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 316,
                                                columnNumber: 33
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            "AI Scanning"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 307,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 294,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0 text-center md:text-left",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[9px] text-gray-500 font-black uppercase tracking-[0.3em] mb-1 opacity-60",
                                        children: "Universal Intake Target"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 322,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-white font-bold text-base md:text-lg tracking-tight",
                                        children: [
                                            data.address,
                                            ", ",
                                            data.city,
                                            ", ",
                                            data.state,
                                            " ",
                                            data.zip,
                                            ", USA"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 323,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 321,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4 shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                        onClick: onCancel,
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XIcon"],
                                        children: "Start Over"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 329,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                        onClick: onConfirm,
                                        variant: "primary",
                                        icon: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Check"],
                                        children: "Confirm Target"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 330,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 328,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 293,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 292,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/CustomerInputPage.tsx",
            lineNumber: 276,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 275,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)), document.body);
};
_s1(AddressConfirmationModal, "wtjPGVBeJ+xsvOmWOLpHPjXat/8=");
_c7 = AddressConfirmationModal;
const MapPickerModal = ({ onClose, onSelect })=>{
    _s2();
    const isApiReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGoogleMapsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGoogleMapsApi"])();
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [map, setMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const markerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isLocating, setIsLocating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const centerOnUser = (showError = false)=>{
        if (!navigator.geolocation) return;
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition((position)=>{
            if (!map) return;
            const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            map.setZoom(20);
            if (markerRef.current) markerRef.current.setPosition(pos);
            else {
                markerRef.current = new window.google.maps.Marker({
                    position: pos,
                    map: map,
                    title: "You are here",
                    icon: {
                        path: window.google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#ffffff",
                        fillOpacity: 1,
                        strokeColor: "#000000",
                        strokeWeight: 2
                    }
                });
            }
            setIsLocating(false);
        }, ()=>setIsLocating(false), {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        });
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "MapPickerModal.useEffect": ()=>{
            if (!isApiReady || !mapRef.current || map) return;
            const mapInstance = new window.google.maps.Map(mapRef.current, {
                center: {
                    lat: 40.7608,
                    lng: -111.8910
                },
                zoom: 12,
                mapTypeId: 'satellite',
                clickableIcons: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: true,
                tilt: 0
            });
            setMap(mapInstance);
            mapInstance.addListener("click", {
                "MapPickerModal.useEffect": (e)=>{
                    const latLng = e.latLng;
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode({
                        location: latLng
                    }, {
                        "MapPickerModal.useEffect": (results, status)=>{
                            if (status === "OK" && results[0]) {
                                const place = results[0];
                                const addressComponents = place.address_components;
                                let streetNumber = '', route = '', city = '', state = '', zip = '';
                                if (addressComponents) {
                                    for (const component of addressComponents){
                                        const componentType = component.types[0];
                                        switch(componentType){
                                            case 'street_number':
                                                streetNumber = component.long_name;
                                                break;
                                            case 'route':
                                                route = component.short_name;
                                                break;
                                            case 'locality':
                                                city = component.long_name;
                                                break;
                                            case 'administrative_area_level_1':
                                                state = component.short_name;
                                                break;
                                            case 'postal_code':
                                                zip = component.short_name;
                                                break;
                                        }
                                    }
                                }
                                onSelect({
                                    address: streetNumber && route ? `${streetNumber} ${route}` : place.formatted_address ? place.formatted_address.split(',')[0] : '',
                                    city,
                                    state,
                                    zip,
                                    latitude: latLng.lat(),
                                    longitude: latLng.lng(),
                                    placeName: place.name !== place.formatted_address ? place.name : undefined
                                });
                            }
                        }
                    }["MapPickerModal.useEffect"]);
                }
            }["MapPickerModal.useEffect"]);
        }
    }["MapPickerModal.useEffect"], [
        isApiReady,
        map,
        onSelect
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl h-[80vh] flex flex-col shadow-2xl relative overflow-hidden",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900 z-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "text-white font-bold text-lg",
                                    children: "Select Location"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 410,
                                    columnNumber: 26
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-gray-400 text-xs",
                                    children: "Tap the exact building on the map"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 410,
                                    columnNumber: 91
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 410,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: onClose,
                            className: "p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["XIcon"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 411,
                                columnNumber: 151
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 411,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 409,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex-1 relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            ref: mapRef,
                            className: "absolute inset-0 w-full h-full"
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 414,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>centerOnUser(true),
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("absolute bottom-8 right-4 p-4 rounded-full bg-white text-black shadow-2xl hover:bg-gray-200 transition-all z-[10000] flex items-center justify-center border-2 border-black/10", isLocating && "animate-pulse"),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RhiveGeopinIcon"], {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 415,
                                columnNumber: 302
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 415,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 413,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/CustomerInputPage.tsx",
            lineNumber: 408,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 407,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0)), document.body);
};
_s2(MapPickerModal, "6QFtSfneQjgv5gsOpKjXlDFfzL4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGoogleMapsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGoogleMapsApi"]
    ];
});
_c8 = MapPickerModal;
const AddressSection = ({ label, data, onChange, isCollapsed, setIsCollapsed, showMaps = false, readOnly = false })=>{
    _s3();
    const isApiReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGoogleMapsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGoogleMapsApi"])();
    const inputRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [isMapPickerOpen, setIsMapPickerOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pendingConfirmationData, setPendingConfirmationData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AddressSection.useEffect": ()=>{
            if (!isApiReady || !inputRef.current || isCollapsed || readOnly) return;
            const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
                fields: [
                    'address_components',
                    'geometry',
                    'formatted_address',
                    'name'
                ],
                componentRestrictions: {
                    country: 'us'
                }
            });
            autocomplete.addListener('place_changed', {
                "AddressSection.useEffect": ()=>{
                    const place = autocomplete.getPlace();
                    if (!place.geometry) return;
                    const extracted = {
                        address: place.formatted_address?.split(',')[0] || '',
                        city: place.address_components?.find({
                            "AddressSection.useEffect": (c)=>c.types.includes('locality')
                        }["AddressSection.useEffect"])?.long_name || '',
                        state: place.address_components?.find({
                            "AddressSection.useEffect": (c)=>c.types.includes('administrative_area_level_1')
                        }["AddressSection.useEffect"])?.short_name || '',
                        zip: place.address_components?.find({
                            "AddressSection.useEffect": (c)=>c.types.includes('postal_code')
                        }["AddressSection.useEffect"])?.long_name || '',
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng(),
                        placeName: place.name !== place.formatted_address ? place.name : undefined
                    };
                    if (showMaps) setPendingConfirmationData(extracted);
                    else {
                        onChange(extracted);
                        setIsCollapsed(true);
                    }
                }
            }["AddressSection.useEffect"]);
        }
    }["AddressSection.useEffect"], [
        isApiReady,
        isCollapsed,
        readOnly
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            isMapPickerOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapPickerModal, {
                onClose: ()=>setIsMapPickerOpen(false),
                onSelect: (d)=>{
                    if (showMaps) setPendingConfirmationData(d);
                    else {
                        onChange(d);
                        setIsCollapsed(true);
                    }
                    setIsMapPickerOpen(false);
                }
            }, void 0, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 456,
                columnNumber: 33
            }, ("TURBOPACK compile-time value", void 0)),
            pendingConfirmationData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AddressConfirmationModal, {
                data: pendingConfirmationData,
                onCancel: ()=>setPendingConfirmationData(null),
                onConfirm: ()=>{
                    onChange(pendingConfirmationData);
                    setIsCollapsed(true);
                    setPendingConfirmationData(null);
                }
            }, void 0, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 458,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)),
            isCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: ()=>!readOnly && setIsCollapsed(false),
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("bg-black/20 border border-gray-800 px-4 py-3 flex items-center justify-between shadow-lg transition-all backdrop-blur-md", !readOnly && "cursor-pointer hover:bg-black/40 group"),
                style: {
                    clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1.5",
                            children: label
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 468,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-white text-sm font-bold truncate tracking-tight",
                            children: [
                                data.address || 'Click to select...',
                                ", ",
                                data.city,
                                " ",
                                data.state
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 469,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 467,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 466,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4 animate-fade-in bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-gray-800/50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                        children: [
                            label,
                            " Search"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 474,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                ref: inputRef,
                                placeholder: "Start typing address...",
                                value: data.address,
                                onChange: (e)=>onChange({
                                        ...data,
                                        address: e.target.value
                                    }),
                                className: "pr-12"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 476,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setIsMapPickerOpen(true),
                                className: "absolute right-2 top-1/2 -translate-y-1/2 text-white/70 p-2.5 rounded-lg hover:bg-white/10 transition-all",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapIcon"], {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 477,
                                    columnNumber: 206
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 477,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 475,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 473,
                columnNumber: 17
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 455,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s3(AddressSection, "0w2yKZawdGHXE4Wd0s9pALg9yPo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGoogleMapsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGoogleMapsApi"]
    ];
});
_c9 = AddressSection;
// --- Contact Form Logic (Matches Screenshot) ---
const FunctionChip = ({ label, icon: Icon, active, onClick })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onClick,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("flex items-center justify-center gap-3 p-4 border-2 transition-all duration-300 backdrop-blur-md", active ? "bg-white/10 border-white/50 text-white shadow-xl" : "bg-black/30 border-gray-800 text-gray-500 hover:border-gray-700 hover:text-gray-300"),
        style: {
            clipPath: "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-5 h-5", active ? "text-white" : "text-gray-700")
            }, void 0, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 489,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-[10px] font-black uppercase tracking-widest",
                children: label
            }, void 0, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 490,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 488,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c10 = FunctionChip;
const MethodButton = ({ label, active, onClick })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onClick,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6 py-2 border text-[10px] font-black uppercase tracking-widest transition-all duration-300 backdrop-blur-sm", active ? "bg-white/10 border-white/50 text-white shadow-xl" : "bg-transparent border-gray-800 text-gray-500 hover:text-white hover:border-gray-600"),
        style: {
            clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)"
        },
        children: label
    }, void 0, false, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 495,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c11 = MethodButton;
const ContactForm = ({ initialData, companyName, propertyName, onSave, onCancel, isPrimary, projectCategory })=>{
    _s4();
    const { users } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$MockDatabaseContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockDB"])();
    const [data, setData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialData || {
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        role: projectCategory === 'Residential' ? 'Property Owner' : 'Property Manager',
        preferredContactMethod: 'Text',
        responsibilities: [],
        affiliations: []
    });
    const [activeRoleCategory, setActiveRoleCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(projectCategory || 'Residential');
    const handlePhoneChange = (e)=>{
        let v = e.target.value.replace(/\D/g, '');
        if (v.length > 0) v = '(' + v.substring(0, 3) + (v.length > 3 ? ') ' + v.substring(3, 6) : '') + (v.length > 6 ? '-' + v.substring(6, 10) : '');
        setData({
            ...data,
            phone: v
        });
    };
    const handleNameChange = (field, value)=>{
        const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
        setData({
            ...data,
            [field]: capitalized
        });
    };
    const toggleAffiliation = (aff)=>{
        const current = data.affiliations || [];
        const exists = current.includes(aff);
        setData({
            ...data,
            affiliations: exists ? current.filter((a)=>a !== aff) : [
                ...current,
                aff
            ]
        });
    };
    const toggleResponsibility = (opt)=>{
        const current = data.responsibilities || [];
        const exists = current.includes(opt);
        setData({
            ...data,
            responsibilities: exists ? current.filter((r)=>r !== opt) : [
                ...current,
                opt
            ]
        });
    };
    const roleCategories = {
        'Residential': [
            'Property Owner',
            'Landlord',
            'Tenant',
            'Neighbor',
            'Relative',
            'Other'
        ],
        'Commercial': [
            'Property Manager',
            'Building Owner',
            'Maintenance Supervisor',
            'HOA Board Member',
            'Other'
        ],
        'Government': [
            'Contracting Officer',
            'Site Representative',
            'Facility Manager',
            'Other'
        ]
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
        className: "animate-fade-in shadow-2xl relative overflow-hidden isolate",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
            className: "p-10 space-y-10",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                            className: "text-white/70 font-black text-xs uppercase tracking-[0.4em]",
                            children: isPrimary ? 'PRIMARY CONTACT' : 'STAKEHOLDER NODE'
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 550,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        isPrimary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-2 h-2 rounded-full bg-white shadow-xl"
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 551,
                            columnNumber: 35
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 549,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                    required: true,
                                    children: "First Name"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 555,
                                    columnNumber: 48
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                    value: data.firstName,
                                    onChange: (e)=>handleNameChange('firstName', e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 555,
                                    columnNumber: 98
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 555,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                    required: true,
                                    children: "Last Name"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 556,
                                    columnNumber: 48
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                    value: data.lastName,
                                    onChange: (e)=>handleNameChange('lastName', e.target.value)
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 556,
                                    columnNumber: 97
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 556,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                    required: true,
                                    children: "Phone Number"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 557,
                                    columnNumber: 48
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                    placeholder: "(000) 000-0000",
                                    value: data.phone,
                                    onChange: handlePhoneChange
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 557,
                                    columnNumber: 100
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 557,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                    required: true,
                                    children: "Email Address"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 558,
                                    columnNumber: 48
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                    type: "email",
                                    placeholder: "example@domain.com",
                                    value: data.email,
                                    onChange: (e)=>setData({
                                            ...data,
                                            email: e.target.value
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 558,
                                    columnNumber: 101
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 558,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 554,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                            required: true,
                            isPink: true,
                            children: "Preferred Contact Method"
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 562,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-4",
                            children: [
                                'Phone',
                                'Text',
                                'Email'
                            ].map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MethodButton, {
                                    label: m,
                                    active: data.preferredContactMethod === m,
                                    onClick: ()=>setData({
                                            ...data,
                                            preferredContactMethod: m
                                        })
                                }, m, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 565,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 563,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 561,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                projectCategory !== 'Residential' && (companyName || propertyName) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                            children: "Affiliation (Select all that apply)"
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 577,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-4",
                            children: [
                                companyName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>toggleAffiliation('Company'),
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6 py-3 border text-[11px] font-black uppercase tracking-widest transition-all backdrop-blur-md", data.affiliations?.includes('Company') ? "bg-white/10 border-white/50 text-white shadow-xl" : "bg-transparent border-gray-800 text-gray-300 hover:text-gray-300"),
                                    style: {
                                        clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)"
                                    },
                                    children: companyName
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 580,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)),
                                propertyName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>toggleAffiliation('Property'),
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-6 py-3 border text-[11px] font-black uppercase tracking-widest transition-all backdrop-blur-md", data.affiliations?.includes('Property') ? "bg-white/10 border-white/50 text-white shadow-xl" : "bg-transparent border-gray-800 text-gray-500 hover:text-gray-300"),
                                    style: {
                                        clipPath: "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)"
                                    },
                                    children: propertyName
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 585,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 578,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-[10px] text-gray-600 font-bold italic ml-1",
                            children: "Link this contact to the Company, the Property, or both."
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 590,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 576,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                            children: "Contact Functions (Select all that apply)"
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 595,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FunctionChip, {
                                    label: "Bid / Quote",
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DocumentTextIcon"],
                                    active: data.responsibilities?.includes('Bid'),
                                    onClick: ()=>toggleResponsibility('Bid')
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 597,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FunctionChip, {
                                    label: "Billing / Invoice",
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CurrencyDollarIcon"],
                                    active: data.responsibilities?.includes('Billing'),
                                    onClick: ()=>toggleResponsibility('Billing')
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 598,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FunctionChip, {
                                    label: "Site Access",
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["RhiveGeopinIcon"],
                                    active: data.responsibilities?.includes('Access'),
                                    onClick: ()=>toggleResponsibility('Access')
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 599,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 596,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 594,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                    children: "Project Role"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 605,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-4",
                                    children: [
                                        'Residential',
                                        'Commercial',
                                        'Government'
                                    ].map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>setActiveRoleCategory(cat),
                                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-[10px] font-black uppercase tracking-widest transition-all", activeRoleCategory === cat ? "text-white" : "text-gray-700 hover:text-gray-500"),
                                            children: cat
                                        }, cat, false, {
                                            fileName: "[project]/pages/CustomerInputPage.tsx",
                                            lineNumber: 608,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 606,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 604,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: roleCategories[activeRoleCategory].map((role)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "button",
                                    onClick: ()=>setData({
                                            ...data,
                                            role
                                        }),
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("px-4 py-2 border text-[10px] font-black uppercase tracking-tighter transition-all", data.role === role ? "bg-white/10 border-white/30 text-white" : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-400"),
                                    style: {
                                        clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)"
                                    },
                                    children: role
                                }, role, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 614,
                                    columnNumber: 29
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 612,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 603,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex justify-end gap-4 pt-8 border-t border-gray-800/50",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            variant: "secondary",
                            onClick: onCancel,
                            children: "Cancel"
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 620,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>onSave({
                                    id: data.id || String(Date.now()),
                                    ...data,
                                    isPrimary
                                }),
                            className: "px-12 py-4 bg-white/10 border border-white/30 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-xl hover:bg-white/20 transition-all shadow-xl",
                            style: {
                                clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)"
                            },
                            children: "Save Contact"
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 621,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 619,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/CustomerInputPage.tsx",
            lineNumber: 548,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 547,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s4(ContactForm, "qSuntxGz0fKMK4QaoBN8/asxCs4=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$MockDatabaseContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockDB"]
    ];
});
_c12 = ContactForm;
// --- Main Page Component ---
const CustomerInputPage = ()=>{
    _s5();
    const { addUser, createProject, users } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$MockDatabaseContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockDB"])();
    const { setActivePageId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigation"])();
    const { pricing } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$PricingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePricing"])();
    const isApiReady = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGoogleMapsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGoogleMapsApi"])();
    const propertyNameRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [propertyData, setPropertyData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        address: '',
        city: '',
        state: '',
        zip: '',
        latitude: 0,
        longitude: 0
    });
    const [isPropertyCollapsed, setIsPropertyCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [projectCategory, setProjectCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Residential');
    const [isInsurance, setIsInsurance] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isTypeCollapsed, setIsTypeCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [companyData, setCompanyData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        parentCompany: '',
        propertyName: ''
    });
    const [isOrgCollapsed, setIsOrgCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [contacts, setContacts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isAddingContact, setIsAddingContact] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [editingContactId, setEditingContactId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [insuranceInfo, setInsuranceInfo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        carrier: '',
        claimNumber: '',
        deductible: '',
        dateOfLoss: '',
        damageType: []
    });
    const [insuranceStatus, setInsuranceStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Not Sure');
    const [isInsuranceInfoCollapsed, setIsInsuranceInfoCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [billingData, setBillingData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        address: '',
        city: '',
        state: '',
        zip: '',
        latitude: 0,
        longitude: 0
    });
    const [billToName, setBillToName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isBillingCollapsed, setIsBillingCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [isBillingConfirmed, setIsBillingConfirmed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scopeType, setScopeType] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Replacement');
    const [repairDetails, setRepairDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        isOld: false,
        activeLeak: false,
        hasPhotos: false,
        emergencyTarp: false
    });
    const [purchaseIntent, setPurchaseIntent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [isIntentCollapsed, setIsIntentCollapsed] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [scheduledDetails, setScheduledDetails] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const isCommercialOrGov = projectCategory === 'Commercial' || projectCategory === 'Government';
    const isInspectionRequired = isCommercialOrGov || isInsurance || repairDetails.activeLeak || scopeType === 'Repair' && (repairDetails.isOld || !repairDetails.hasPhotos);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomerInputPage.useEffect": ()=>{
            if (!isApiReady || !propertyNameRef.current || !isCommercialOrGov || isOrgCollapsed) return;
            const autocomplete = new window.google.maps.places.Autocomplete(propertyNameRef.current, {
                fields: [
                    'formatted_address',
                    'geometry',
                    'name',
                    'address_components'
                ],
                componentRestrictions: {
                    country: 'us'
                }
            });
            autocomplete.addListener('place_changed', {
                "CustomerInputPage.useEffect": ()=>{
                    const place = autocomplete.getPlace();
                    if (!place.geometry) return;
                    const name = place.name || '';
                    const extracted = {
                        address: place.formatted_address?.split(',')[0] || '',
                        city: place.address_components?.find({
                            "CustomerInputPage.useEffect": (c)=>c.types.includes('locality')
                        }["CustomerInputPage.useEffect"])?.long_name || '',
                        state: place.address_components?.find({
                            "CustomerInputPage.useEffect": (c)=>c.types.includes('administrative_area_level_1')
                        }["CustomerInputPage.useEffect"])?.short_name || '',
                        zip: place.address_components?.find({
                            "CustomerInputPage.useEffect": (c)=>c.types.includes('postal_code')
                        }["CustomerInputPage.useEffect"])?.long_name || '',
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    };
                    setCompanyData({
                        "CustomerInputPage.useEffect": (prev)=>({
                                ...prev,
                                propertyName: name
                            })
                    }["CustomerInputPage.useEffect"]);
                    if (!isBillingConfirmed) {
                        setBillToName(name);
                        setBillingData(extracted);
                    }
                }
            }["CustomerInputPage.useEffect"]);
        }
    }["CustomerInputPage.useEffect"], [
        isApiReady,
        isCommercialOrGov,
        isOrgCollapsed
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CustomerInputPage.useEffect": ()=>{
            if (isBillingConfirmed) return;
            if (projectCategory === 'Residential') {
                const primary = contacts.find({
                    "CustomerInputPage.useEffect": (c)=>c.isPrimary
                }["CustomerInputPage.useEffect"]) || contacts[0];
                if (primary) {
                    setBillToName(`${primary.firstName} ${primary.lastName}`);
                }
                setBillingData(propertyData);
                if (propertyData.address && !companyData.propertyName) {
                    setCompanyData({
                        "CustomerInputPage.useEffect": (prev)=>({
                                ...prev,
                                propertyName: propertyData.address
                            })
                    }["CustomerInputPage.useEffect"]);
                }
            } else if (isCommercialOrGov) {
                if (companyData.parentCompany) {
                    setBillToName(companyData.parentCompany);
                }
            }
        }
    }["CustomerInputPage.useEffect"], [
        projectCategory,
        contacts,
        propertyData,
        companyData.parentCompany,
        isBillingConfirmed
    ]);
    const handleSubmit = (e)=>{
        e.preventDefault();
        if (contacts.length === 0) return alert("Please add at least one contact.");
        const primary = contacts.find((c)=>c.isPrimary) || contacts[0];
        const projNameStr = isCommercialOrGov ? companyData.propertyName || propertyData.address : `${primary.lastName} Residence`;
        createProject(projNameStr, projectCategory, propertyData.address, primary.existingUserId || 'U-NEW');
        setActivePageId('E-18');
    };
    const handleDeductibleChange = (e)=>{
        const val = e.target.value.replace(/\D/g, '');
        const formatted = val ? new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(Number(val)) : '';
        setInsuranceInfo({
            ...insuranceInfo,
            deductible: formatted
        });
    };
    const handleCarrierChange = (e)=>{
        const val = e.target.value;
        const capitalized = val.split(' ').map((word)=>word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        setInsuranceInfo({
            ...insuranceInfo,
            carrier: capitalized
        });
    };
    const handleQuickAddPropertyName = ()=>{
        if (propertyData.placeName) {
            setCompanyData((prev)=>({
                    ...prev,
                    propertyName: propertyData.placeName
                }));
            if (!isBillingConfirmed) {
                setBillToName(propertyData.placeName);
                setBillingData(propertyData);
            }
        } else if (propertyData.address) {
            const street = propertyData.address.split(',')[0].replace(/^\d+\s+/, '');
            setCompanyData((prev)=>({
                    ...prev,
                    propertyName: street
                }));
            if (!isBillingConfirmed) {
                setBillToName(street);
                setBillingData(propertyData);
            }
        }
    };
    const projectLabel = isCommercialOrGov ? companyData.propertyName || propertyData.address || "Unnamed Project" : contacts[0]?.lastName ? contacts[0].lastName + ' Residence' : 'New Project';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$PageContainer$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        title: "New Lead Entry",
        description: "Sequential intake logic for clean data nodes.",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
            onSubmit: handleSubmit,
            className: "max-w-4xl mx-auto pb-32 space-y-8",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AddressSection, {
                    label: "Property Location",
                    data: propertyData,
                    onChange: setPropertyData,
                    isCollapsed: isPropertyCollapsed,
                    setIsCollapsed: setIsPropertyCollapsed,
                    showMaps: true
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 762,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                isTypeCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RenderCollapsedSection, {
                    title: "Project Type",
                    summary: `${projectCategory}${isInsurance ? ' [Insurance]' : ''}`,
                    onEdit: ()=>setIsTypeCollapsed(false)
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 765,
                    columnNumber: 36
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "animate-fade-in shadow-2xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "p-8 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                title: "Project Type",
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BuildingStorefrontIcon"]
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 768,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleGroup, {
                                options: [
                                    'Residential',
                                    'Commercial',
                                    'Government'
                                ],
                                value: projectCategory,
                                onChange: (v)=>setProjectCategory(v)
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 769,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                onClick: ()=>setIsInsurance(!isInsurance),
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("mt-4 cursor-pointer px-4 py-4 border text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center backdrop-blur-md", isInsurance ? "bg-white/10 border-white/50 text-white shadow-xl" : "bg-transparent border-gray-800 text-gray-500 hover:border-gray-600 hover:text-gray-300"),
                                style: {
                                    clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)"
                                },
                                children: isInsurance ? "✓ Insurance Claim" : "Is this an Insurance Claim?"
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 770,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end pt-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    size: "sm",
                                    onClick: ()=>setIsTypeCollapsed(true),
                                    children: [
                                        "Continue to ",
                                        isCommercialOrGov ? 'Organization' : 'Contacts'
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 780,
                                    columnNumber: 68
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 780,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 767,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 766,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                isCommercialOrGov && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-fade-in",
                    children: isOrgCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RenderCollapsedSection, {
                        title: "Organization",
                        summary: `${companyData.parentCompany || 'N/A'} • ${companyData.propertyName || 'N/A'}`,
                        onEdit: ()=>setIsOrgCollapsed(false)
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 788,
                        columnNumber: 43
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: "shadow-2xl relative overflow-hidden isolate",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-8 space-y-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                    title: "Organization Details",
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["BriefcaseIcon"],
                                    className: "border-none mb-4"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 791,
                                    columnNumber: 37
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                    children: "Parent Company / Owner"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                                    lineNumber: 794,
                                                    columnNumber: 45
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MagnifyingGlassIcon"], {
                                                            className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/CustomerInputPage.tsx",
                                                            lineNumber: 796,
                                                            columnNumber: 49
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                                            className: "pl-11 h-14",
                                                            placeholder: "Search Companies...",
                                                            value: companyData.parentCompany,
                                                            onChange: (e)=>setCompanyData({
                                                                    ...companyData,
                                                                    parentCompany: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/CustomerInputPage.tsx",
                                                            lineNumber: 797,
                                                            columnNumber: 49
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                                    lineNumber: 795,
                                                    columnNumber: 45
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/CustomerInputPage.tsx",
                                            lineNumber: 793,
                                            columnNumber: 41
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                    children: "Property Name / Site"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                                    lineNumber: 801,
                                                    columnNumber: 45
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "relative",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MagnifyingGlassIcon"], {
                                                            className: "absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/CustomerInputPage.tsx",
                                                            lineNumber: 803,
                                                            columnNumber: 49
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                                            ref: propertyNameRef,
                                                            className: "pl-11 h-14",
                                                            placeholder: "e.g. Willow Park Apartments",
                                                            value: companyData.propertyName,
                                                            onChange: (e)=>setCompanyData({
                                                                    ...companyData,
                                                                    propertyName: e.target.value
                                                                })
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/CustomerInputPage.tsx",
                                                            lineNumber: 804,
                                                            columnNumber: 49
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                                    lineNumber: 802,
                                                    columnNumber: 45
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    onClick: handleQuickAddPropertyName,
                                                    className: "px-3 py-1.5 bg-white/5 border border-gray-800 text-[10px] font-black uppercase tracking-tighter text-gray-500 hover:text-white hover:border-gray-600 transition-all",
                                                    style: {
                                                        clipPath: "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)"
                                                    },
                                                    children: "Use Site Address"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                                    lineNumber: 806,
                                                    columnNumber: 45
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/CustomerInputPage.tsx",
                                            lineNumber: 800,
                                            columnNumber: 41
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 792,
                                    columnNumber: 37
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end pt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        size: "sm",
                                        onClick: ()=>setIsOrgCollapsed(true),
                                        children: "Next: Contact Discovery"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 816,
                                        columnNumber: 76
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 816,
                                    columnNumber: 37
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 790,
                            columnNumber: 33
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 789,
                        columnNumber: 29
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 787,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                            title: "Contact Directory",
                            icon: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["UserIcon"]
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 825,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        contacts.map((c)=>editingContactId === c.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ContactForm, {
                                initialData: c,
                                companyName: companyData.parentCompany,
                                propertyName: companyData.propertyName,
                                onSave: (upd)=>{
                                    setContacts((prev)=>prev.map((ex)=>ex.id === upd.id ? upd : ex));
                                    setEditingContactId(null);
                                },
                                onCancel: ()=>setEditingContactId(null),
                                isPrimary: c.isPrimary,
                                projectCategory: projectCategory
                            }, c.id, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 828,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ContactCard, {
                                contact: c,
                                onEdit: ()=>setEditingContactId(c.id),
                                onDelete: ()=>setContacts((p)=>p.filter((x)=>x.id !== c.id))
                            }, c.id, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 829,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))),
                        (isAddingContact || contacts.length === 0) && !editingContactId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ContactForm, {
                            companyName: companyData.parentCompany,
                            propertyName: companyData.propertyName,
                            onSave: (c)=>{
                                setContacts((p)=>[
                                        ...p,
                                        c
                                    ]);
                                setIsAddingContact(false);
                            },
                            onCancel: ()=>setIsAddingContact(false),
                            isPrimary: contacts.length === 0,
                            projectCategory: projectCategory
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 832,
                            columnNumber: 25
                        }, ("TURBOPACK compile-time value", void 0)),
                        !editingContactId && !isAddingContact && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            onClick: ()=>setIsAddingContact(true),
                            className: "py-4 border-2 border-dashed border-gray-800/30 rounded-[24px] text-gray-600 hover:border-white/30 hover:text-white transition-all flex items-center justify-center font-black text-xs uppercase tracking-widest cursor-pointer group backdrop-blur-sm",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PlusIcon"], {
                                    className: "w-4 h-4 mr-2 group-hover:scale-125 transition-transform"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 834,
                                    columnNumber: 367
                                }, ("TURBOPACK compile-time value", void 0)),
                                " Add Stakeholder"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 834,
                            columnNumber: 63
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 824,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                isInsurance && (isInsuranceInfoCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RenderCollapsedSection, {
                    title: "Insurance Details",
                    summary: `${insuranceInfo.carrier} - ${insuranceStatus}`,
                    onEdit: ()=>setIsInsuranceInfoCollapsed(false)
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 838,
                    columnNumber: 48
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "shadow-2xl border-gray-800/50",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "p-8 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                title: "Insurance Profile",
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ShieldCheckIcon"]
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 841,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                children: "Carrier"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 843,
                                                columnNumber: 42
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                                placeholder: "e.g. State Farm",
                                                value: insuranceInfo.carrier,
                                                onChange: handleCarrierChange
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 843,
                                                columnNumber: 80
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 843,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                children: "Status"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 844,
                                                columnNumber: 42
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleGroup, {
                                                options: [
                                                    'Approved',
                                                    'Process',
                                                    'Interest',
                                                    'Not Sure'
                                                ],
                                                value: insuranceStatus,
                                                onChange: setInsuranceStatus
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 844,
                                                columnNumber: 79
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 844,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                children: "Claim #"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 845,
                                                columnNumber: 42
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                                style: {
                                                    textTransform: 'uppercase'
                                                },
                                                placeholder: "CLAIM #",
                                                value: insuranceInfo.claimNumber,
                                                onChange: (e)=>setInsuranceInfo({
                                                        ...insuranceInfo,
                                                        claimNumber: e.target.value.toUpperCase()
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 845,
                                                columnNumber: 80
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 845,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                children: "Deductible"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 846,
                                                columnNumber: 42
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                                placeholder: "$1,000",
                                                value: insuranceInfo.deductible,
                                                onChange: handleDeductibleChange
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 846,
                                                columnNumber: 83
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 846,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 842,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                children: "Type of Damage"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 850,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MultiSelectGroup, {
                                                options: [
                                                    'Wind',
                                                    'Hail',
                                                    'Mechanical'
                                                ],
                                                selected: insuranceInfo.damageType,
                                                onChange: (v)=>setInsuranceInfo((p)=>({
                                                            ...p,
                                                            damageType: p.damageType.includes(v) ? p.damageType.filter((x)=>x !== v) : [
                                                                ...p.damageType,
                                                                v
                                                            ]
                                                        }))
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 851,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 849,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                children: "Date of Loss"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 853,
                                                columnNumber: 42
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                                type: "date",
                                                value: insuranceInfo.dateOfLoss,
                                                onChange: (e)=>setInsuranceInfo({
                                                        ...insuranceInfo,
                                                        dateOfLoss: e.target.value
                                                    })
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 853,
                                                columnNumber: 85
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 853,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 848,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-6 border-t border-gray-800/50 pt-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                        children: "Storm History (Selection autofills Type & Date)"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 856,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$WeatherReport$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WeatherReport"], {
                                        onDateSelect: (d)=>{
                                            const dmgType = d.includes('2023-08-15') || d.includes('2021-07-03') ? [
                                                'Hail'
                                            ] : [
                                                'Wind'
                                            ];
                                            setInsuranceInfo({
                                                ...insuranceInfo,
                                                dateOfLoss: d,
                                                damageType: dmgType
                                            });
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 857,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 855,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end pt-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    size: "sm",
                                    onClick: ()=>setIsInsuranceInfoCollapsed(true),
                                    children: "Continue"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 862,
                                    columnNumber: 72
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 862,
                                columnNumber: 33
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 840,
                        columnNumber: 29
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 839,
                    columnNumber: 25
                }, ("TURBOPACK compile-time value", void 0))),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "animate-fade-in",
                    children: isBillingCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>setIsBillingCollapsed(false),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("border p-6 flex items-center justify-between group cursor-pointer transition-all mb-6 backdrop-blur-md", isBillingConfirmed ? "border-white/20 bg-black/40" : "border-gray-800 bg-black/10"),
                        style: {
                            clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-[9px] text-gray-500 font-black uppercase tracking-widest mb-1.5",
                                        children: "Billing Confirmation Required"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 877,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-white font-bold tracking-tight text-lg",
                                        children: [
                                            billToName || 'Unspecified',
                                            " • ",
                                            billingData.address || 'Address Required'
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 878,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 876,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("transition-colors", isBillingConfirmed ? "text-white" : "text-gray-500 group-hover:text-white"),
                                children: isBillingConfirmed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Check"], {
                                    className: "w-6 h-6"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 880,
                                    columnNumber: 168
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PencilSquareIcon"], {
                                    className: "w-6 h-6"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 880,
                                    columnNumber: 200
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 880,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 871,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("animate-fade-in shadow-2xl", isBillingConfirmed ? "border-white/20" : "border-gray-800"),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                            className: "p-8 space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                    title: "Billing Profile",
                                    icon: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DocumentTextIcon"]
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 885,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                    children: "Bill To Entity / Individual"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                                    lineNumber: 887,
                                                    columnNumber: 42
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InputField, {
                                                    placeholder: "Company or Individual Name",
                                                    value: billToName,
                                                    onChange: (e)=>setBillToName(e.target.value)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                                    lineNumber: 887,
                                                    columnNumber: 100
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/CustomerInputPage.tsx",
                                            lineNumber: 887,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AddressSection, {
                                            label: "Billing Address",
                                            data: billingData,
                                            onChange: setBillingData,
                                            isCollapsed: false,
                                            setIsCollapsed: ()=>{}
                                        }, void 0, false, {
                                            fileName: "[project]/pages/CustomerInputPage.tsx",
                                            lineNumber: 888,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 886,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3 pt-4",
                                    children: [
                                        isBillingConfirmed && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            variant: "secondary",
                                            size: "sm",
                                            onClick: ()=>setIsBillingCollapsed(true),
                                            children: "Hide Section"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/CustomerInputPage.tsx",
                                            lineNumber: 891,
                                            columnNumber: 60
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            type: "button",
                                            onClick: ()=>{
                                                setIsBillingConfirmed(true);
                                                setIsBillingCollapsed(true);
                                            },
                                            className: "px-8 py-3 bg-white/10 border border-white/30 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/20 transition-all shadow-xl",
                                            style: {
                                                clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
                                            },
                                            children: "Confirm Billing Node"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/CustomerInputPage.tsx",
                                            lineNumber: 892,
                                            columnNumber: 37
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 890,
                                    columnNumber: 33
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 884,
                            columnNumber: 29
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 883,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 869,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                isIntentCollapsed ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RenderCollapsedSection, {
                    title: "Project Intent",
                    summary: scheduledDetails || scopeType + ' • ' + (purchaseIntent || 'Pending'),
                    onEdit: ()=>setIsIntentCollapsed(false)
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 907,
                    columnNumber: 38
                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "shadow-2xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "p-8 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SectionHeader, {
                                title: "Project Intent",
                                icon: __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["SparklesIcon"]
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 910,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                children: "Nature of Work"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 912,
                                                columnNumber: 38
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleGroup, {
                                                options: [
                                                    'Replacement',
                                                    'Repair'
                                                ],
                                                value: scopeType,
                                                onChange: (v)=>setScopeType(v)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 912,
                                                columnNumber: 83
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 912,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-5 bg-black/30 backdrop-blur-md border border-gray-800/50 space-y-6",
                                        style: {
                                            clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                        children: "Active Leak Detected?"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                                        lineNumber: 914,
                                                        columnNumber: 42
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleGroup, {
                                                        options: [
                                                            'Yes',
                                                            'No'
                                                        ],
                                                        value: repairDetails.activeLeak ? 'Yes' : 'No',
                                                        onChange: (v)=>setRepairDetails((p)=>({
                                                                    ...p,
                                                                    activeLeak: v === 'Yes'
                                                                }))
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                                        lineNumber: 914,
                                                        columnNumber: 94
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 914,
                                                columnNumber: 37
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            scopeType === 'Repair' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "animate-fade-in space-y-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                                children: "Is the system older than 15 years?"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                                lineNumber: 917,
                                                                columnNumber: 50
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleGroup, {
                                                                options: [
                                                                    'Yes',
                                                                    'No'
                                                                ],
                                                                value: repairDetails.isOld ? 'Yes' : 'No',
                                                                onChange: (v)=>setRepairDetails((p)=>({
                                                                            ...p,
                                                                            isOld: v === 'Yes'
                                                                        }))
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                                lineNumber: 917,
                                                                columnNumber: 115
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                                        lineNumber: 917,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    !repairDetails.isOld && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                                children: "Client has photos of damage?"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                                lineNumber: 919,
                                                                columnNumber: 54
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ToggleGroup, {
                                                                options: [
                                                                    'Yes',
                                                                    'No'
                                                                ],
                                                                value: repairDetails.hasPhotos ? 'Yes' : 'No',
                                                                onChange: (v)=>setRepairDetails((p)=>({
                                                                            ...p,
                                                                            hasPhotos: v === 'Yes'
                                                                        }))
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                                lineNumber: 919,
                                                                columnNumber: 113
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                                        lineNumber: 919,
                                                        columnNumber: 49
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 916,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 913,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    !repairDetails.activeLeak && !isInsurance && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(QuestionLabel, {
                                                children: "What is the goal today?"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 926,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>setPurchaseIntent('Ready'),
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 border cursor-pointer transition-all group backdrop-blur-md", purchaseIntent === 'Ready' ? "bg-white/10 border-white/50 shadow-xl" : "border-gray-800 bg-black/10 hover:border-gray-600"),
                                                        style: {
                                                            clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-black text-xs text-white uppercase tracking-widest group-hover:text-white transition-colors",
                                                                children: "Direct Install"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                                lineNumber: 933,
                                                                columnNumber: 49
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-gray-500 uppercase mt-1",
                                                                children: "Ready to sign & schedule"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                                lineNumber: 934,
                                                                columnNumber: 49
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                                        lineNumber: 928,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        onClick: ()=>setPurchaseIntent('Exploring'),
                                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("p-6 border cursor-pointer transition-all group backdrop-blur-md", purchaseIntent === 'Exploring' ? "bg-white/10 border-white/50 shadow-xl" : "border-gray-800 bg-black/10 hover:border-gray-600"),
                                                        style: {
                                                            clipPath: "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)"
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "font-black text-xs text-white uppercase tracking-widest group-hover:text-white transition-colors",
                                                                children: "Ballpark Analysis"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                                lineNumber: 941,
                                                                columnNumber: 49
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-[10px] text-gray-500 uppercase mt-1",
                                                                children: "Seeking instant estimate"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                                lineNumber: 942,
                                                                columnNumber: 49
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                                        lineNumber: 936,
                                                        columnNumber: 45
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 927,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 925,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    isInspectionRequired && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-8 pt-8 border-t border-gray-800/50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-white/70 font-black text-xs uppercase tracking-[0.3em] mb-6 flex items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CalendarDaysIcon"], {
                                                        className: "w-4 h-4 mr-2"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                                        lineNumber: 949,
                                                        columnNumber: 140
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    " Site Inspection Scheduling"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 949,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CalendarWidget, {
                                                onSelectSlot: (s)=>{
                                                    setScheduledDetails(s);
                                                    setIsIntentCollapsed(true);
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                                lineNumber: 950,
                                                columnNumber: 41
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 948,
                                        columnNumber: 37
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 911,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end pt-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    size: "sm",
                                    onClick: ()=>setIsIntentCollapsed(true),
                                    children: "Confirm Intent"
                                }, void 0, false, {
                                    fileName: "[project]/pages/CustomerInputPage.tsx",
                                    lineNumber: 954,
                                    columnNumber: 68
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 954,
                                columnNumber: 29
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 909,
                        columnNumber: 25
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 908,
                    columnNumber: 21
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                    className: "border-gray-800/80 shadow-2xl animate-fade-in mt-12 overflow-hidden bg-black/30 backdrop-blur-lg",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "p-10 flex flex-col md:flex-row items-center justify-between gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] mb-2",
                                        children: purchaseIntent === 'Exploring' ? "Ready for Analysis:" : "Ready to Commit:"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 963,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white font-black text-2xl uppercase tracking-tighter",
                                        children: projectLabel
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 964,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 962,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        variant: "secondary",
                                        size: "lg",
                                        onClick: ()=>setActivePageId('E-01'),
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 967,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        size: "lg",
                                        type: "submit",
                                        className: "shadow-2xl border border-white/20 bg-white/10 text-white hover:bg-white/20",
                                        children: "Launch Project Core"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 968,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 966,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 961,
                        columnNumber: 21
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 960,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/pages/CustomerInputPage.tsx",
            lineNumber: 759,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 758,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s5(CustomerInputPage, "TzwADjnudlCfipplhHeEqJRgKgM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$MockDatabaseContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMockDB"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$NavigationContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useNavigation"],
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$PricingContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePricing"],
        __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useGoogleMapsApi$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGoogleMapsApi"]
    ];
});
_c13 = CustomerInputPage;
const ContactCard = ({ contact, onEdit, onDelete })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: onEdit,
        className: "flex items-center justify-between p-6 bg-black/30 backdrop-blur-md border border-gray-800 hover:border-white/30 transition-all cursor-pointer group shadow-xl",
        style: {
            clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center space-x-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-14 h-14 border flex items-center justify-center text-white font-black text-xl transition-all", contact.isPrimary ? "bg-white/10 border-white/30" : "bg-gray-900 border-gray-800 group-hover:border-white/20"),
                        style: {
                            clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)"
                        },
                        children: contact.firstName[0]
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 984,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                className: "text-white font-bold text-lg leading-none mb-1.5 group-hover:text-white transition-colors",
                                children: [
                                    contact.firstName,
                                    " ",
                                    contact.lastName
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 986,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500 font-medium uppercase tracking-widest",
                                children: [
                                    contact.role,
                                    " • ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white/70",
                                        children: contact.phone
                                    }, void 0, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 987,
                                        columnNumber: 109
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 987,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 mt-3",
                                children: contact.responsibilities && contact.responsibilities.map((r)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-[8px] bg-black border border-gray-800 px-2 py-0.5 rounded text-gray-600 uppercase font-black tracking-tighter",
                                        children: r
                                    }, r, false, {
                                        fileName: "[project]/pages/CustomerInputPage.tsx",
                                        lineNumber: 990,
                                        columnNumber: 25
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/pages/CustomerInputPage.tsx",
                                lineNumber: 988,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 985,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 983,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PencilSquareIcon"], {
                        className: "w-5 h-5 text-gray-700 group-hover:text-white transition-all"
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 996,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    !contact.isPrimary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: (e)=>{
                            e.stopPropagation();
                            onDelete();
                        },
                        className: "p-3 text-gray-700 hover:text-red-500 transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TrashIcon"], {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/pages/CustomerInputPage.tsx",
                            lineNumber: 997,
                            columnNumber: 163
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 997,
                        columnNumber: 36
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 995,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 978,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c14 = ContactCard;
const RenderCollapsedSection = ({ title, summary, onEdit })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: onEdit,
        className: "border border-gray-800 bg-black/20 backdrop-blur-md p-6 flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all mb-6 shadow-lg",
        style: {
            clipPath: "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)"
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-[9px] text-gray-500 font-black uppercase tracking-[0.2em] mb-1.5",
                        children: title
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 1009,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-white font-bold tracking-tight text-lg",
                        children: summary
                    }, void 0, false, {
                        fileName: "[project]/pages/CustomerInputPage.tsx",
                        lineNumber: 1010,
                        columnNumber: 13
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 1008,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-gray-700 group-hover:text-white transition-colors",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$icons$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["PencilSquareIcon"], {
                    className: "w-6 h-6"
                }, void 0, false, {
                    fileName: "[project]/pages/CustomerInputPage.tsx",
                    lineNumber: 1013,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/pages/CustomerInputPage.tsx",
                lineNumber: 1012,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/pages/CustomerInputPage.tsx",
        lineNumber: 1003,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c15 = RenderCollapsedSection;
const __TURBOPACK__default__export__ = CustomerInputPage;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11, _c12, _c13, _c14, _c15;
__turbopack_context__.k.register(_c, "SectionHeader");
__turbopack_context__.k.register(_c1, "QuestionLabel");
__turbopack_context__.k.register(_c2, "InputField");
__turbopack_context__.k.register(_c3, "ToggleGroup");
__turbopack_context__.k.register(_c4, "MultiSelectGroup");
__turbopack_context__.k.register(_c5, "CalendarWidget");
__turbopack_context__.k.register(_c6, "SolarIntelligenceOverlay");
__turbopack_context__.k.register(_c7, "AddressConfirmationModal");
__turbopack_context__.k.register(_c8, "MapPickerModal");
__turbopack_context__.k.register(_c9, "AddressSection");
__turbopack_context__.k.register(_c10, "FunctionChip");
__turbopack_context__.k.register(_c11, "MethodButton");
__turbopack_context__.k.register(_c12, "ContactForm");
__turbopack_context__.k.register(_c13, "CustomerInputPage");
__turbopack_context__.k.register(_c14, "ContactCard");
__turbopack_context__.k.register(_c15, "RenderCollapsedSection");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=pages_CustomerInputPage_tsx_b5907bb0._.js.map