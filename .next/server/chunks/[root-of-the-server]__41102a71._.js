module.exports = {

"[project]/.next-internal/server/app/api/inventory/process-file/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/app/api/inventory/process-file/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
// Helper function to get common units based on category
const getCommonUnit = (category)=>{
    const categoryMap = {
        'أدوات كهربائية': 'قطعة',
        'أدوات سباكة': 'قطعة',
        'مواد بناء': 'كيس',
        'دهانات': 'جالون',
        'أدوات نجارة': 'قطعة',
        'مواد تنظيف': 'عبوة',
        'أدوات صيانة': 'قطعة',
        'أجهزة كهربائية': 'جهاز',
        'معدات': 'قطعة'
    };
    return categoryMap[category] || 'قطعة';
};
// Helper function to categorize items
const categorizeItem = (itemName)=>{
    const lowerName = itemName.toLowerCase();
    if (/مفتاح|مصباح|كابل|سلك|انارة|لمبة|فيش|ليد/.test(lowerName)) {
        return 'أدوات كهربائية';
    } else if (/حنفية|خلاط|محبس|مواسير|صنبور|سيفون|مرحاض/.test(lowerName)) {
        return 'أدوات سباكة';
    } else if (/اسمنت|طوب|خرسانة|جبس|رمل/.test(lowerName)) {
        return 'مواد بناء';
    } else if (/دهان|طلاء|لاكيه|بوية|ورنيش/.test(lowerName)) {
        return 'دهانات';
    } else if (/مسامير|خشب|قشرة|لوح|مفك/.test(lowerName)) {
        return 'أدوات نجارة';
    } else if (/منظف|صابون|معطر|كلور|مطهر/.test(lowerName)) {
        return 'مواد تنظيف';
    } else if (/مفتاح|مطرقة|كماشة|عدة|أداة|مفك/.test(lowerName)) {
        return 'أدوات صيانة';
    } else if (/تلفاز|ثلاجة|غسالة|مكيف|فرن|سخان/.test(lowerName)) {
        return 'أجهزة كهربائية';
    }
    return 'معدات';
};
// Helper to generate image URL (using placeholder images for now)
const getImageUrl = (item)=>{
    // Generate a placeholder image based on the item name's first letter
    const firstLetter = item.trim().charAt(0).toUpperCase();
    return `https://via.placeholder.com/150/3498db/ffffff?text=${encodeURIComponent(firstLetter)}`;
};
async function POST(request) {
    try {
        const { content } = await request.json();
        if (!content) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'No content provided'
            }, {
                status: 400
            });
        }
        // Parse the file content - assuming one item per line
        const lines = content.split('\n').map((line)=>line.trim()).filter((line)=>line.length > 0);
        // Process each line to create item entries
        const items = lines.map((line)=>{
            const arabicName = line.trim();
            let englishName = '';
            // Generate a simple transliteration for English name
            // This is a simplified version - in a production app you'd use a proper transliteration library
            const transliterationMap = {
                ا: 'a',
                ب: 'b',
                ت: 't',
                ث: 'th',
                ج: 'j',
                ح: 'h',
                خ: 'kh',
                د: 'd',
                ذ: 'th',
                ر: 'r',
                ز: 'z',
                س: 's',
                ش: 'sh',
                ص: 's',
                ض: 'd',
                ط: 't',
                ظ: 'z',
                ع: 'a',
                غ: 'gh',
                ف: 'f',
                ق: 'q',
                ك: 'k',
                ل: 'l',
                م: 'm',
                ن: 'n',
                ه: 'h',
                و: 'w',
                ي: 'y'
            };
            // Generate a simple English name version - this is just a placeholder
            englishName = arabicName.split('').map((char)=>transliterationMap[char] || char).join('').replace(/\s+/g, ' ');
            // Categorize the item based on its name
            const category = categorizeItem(arabicName);
            // Get common unit based on category
            const unit = getCommonUnit(category);
            // Generate placeholder image URL
            const imageUrl = getImageUrl(arabicName);
            return {
                arabicName,
                englishName,
                category,
                unit,
                imageUrl
            };
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            items
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error processing inventory file:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to process file',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__41102a71._.js.map