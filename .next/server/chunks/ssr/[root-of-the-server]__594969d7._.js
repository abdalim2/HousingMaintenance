module.exports = {

"[externals]/stream [external] (stream, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}}),
"[externals]/http [external] (http, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}}),
"[externals]/url [external] (url, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}}),
"[externals]/punycode [external] (punycode, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("punycode", () => require("punycode"));

module.exports = mod;
}}),
"[externals]/https [external] (https, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}}),
"[externals]/zlib [external] (zlib, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}}),
"[project]/src/lib/supabase.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "postgresUrl": (()=>postgresUrl),
    "supabase": (()=>supabase)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/module/index.js [app-ssr] (ecmascript) <locals>");
;
// Initialize the Supabase client with proper Supabase URL and key
const supabaseUrl = 'https://mticvmyfrdmciaeipfxu.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10aWN2bXlmcmRtY2lhZWlwZnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODc1OTMsImV4cCI6MjA1NjY2MzU5M30.6iudxBl6js0heW1mhoSmcXegTIN_lAN2GiFeA3plSIo';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
const postgresUrl = 'postgresql://HousingMaintenance_owner:npg_fC8S4bpZLsJw@ep-weathered-meadow-a44a1v3i-pooler.us-east-1.aws.neon.tech/HousingMaintenance?sslmode=require';
}}),
"[project]/src/lib/services/maintenanceService.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createMaintenanceItem": (()=>createMaintenanceItem),
    "createMaintenanceRequest": (()=>createMaintenanceRequest),
    "deleteMaintenanceItem": (()=>deleteMaintenanceItem),
    "deleteMaintenanceRequest": (()=>deleteMaintenanceRequest),
    "getMaintenanceItemById": (()=>getMaintenanceItemById),
    "getMaintenanceItems": (()=>getMaintenanceItems),
    "getMaintenanceRequestById": (()=>getMaintenanceRequestById),
    "getMaintenanceRequests": (()=>getMaintenanceRequests),
    "getMonthlyMaintenanceRequests": (()=>getMonthlyMaintenanceRequests),
    "updateMaintenanceItem": (()=>updateMaintenanceItem),
    "updateMaintenanceRequest": (()=>updateMaintenanceRequest)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
const getMaintenanceRequests = async (complexId, buildingId, status)=>{
    try {
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_requests').select('*');
        if (complexId) {
            query = query.eq('complex_id', complexId);
        }
        if (buildingId) {
            query = query.eq('building_id', buildingId);
        }
        if (status) {
            query = query.eq('status', status);
        }
        const { data, error } = await query.order('reported_date', {
            ascending: false
        });
        if (error) {
            console.error('Supabase error in getMaintenanceRequests:', error);
            if (error.message.includes('does not exist')) {
                console.warn('The maintenance_requests table might not exist yet. Make sure to run database initialization scripts.');
            }
            throw new Error(`Database error: ${error.message}`);
        }
        return data || [];
    } catch (err) {
        console.error('Error in getMaintenanceRequests:', err);
        throw err;
    }
};
const getMaintenanceRequestById = async (id)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_requests').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};
const createMaintenanceRequest = async (request)=>{
    const newRequest = {
        ...request,
        reported_date: new Date().toISOString(),
        status: request.status || 'pending'
    };
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_requests').insert([
        newRequest
    ]).select().single();
    if (error) throw error;
    return data;
};
const updateMaintenanceRequest = async (id, updates)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_requests').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};
const deleteMaintenanceRequest = async (id)=>{
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_requests').delete().eq('id', id);
    if (error) throw error;
};
const getMaintenanceItems = async (maintenanceId)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_items').select('*').eq('maintenance_id', maintenanceId);
    if (error) throw error;
    return data || [];
};
const getMaintenanceItemById = async (id)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_items').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};
const createMaintenanceItem = async (item)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_items').insert([
        item
    ]).select().single();
    if (error) throw error;
    return data;
};
const updateMaintenanceItem = async (id, updates)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_items').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};
const deleteMaintenanceItem = async (id)=>{
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_items').delete().eq('id', id);
    if (error) throw error;
};
const getMonthlyMaintenanceRequests = async (year, month)=>{
    // Create start and end date for the specified month
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_requests').select('*').gte('reported_date', startDate).lte('reported_date', endDate);
    if (error) throw error;
    return data || [];
};
}}),
"[project]/src/lib/services/housingService.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createBuilding": (()=>createBuilding),
    "createComplex": (()=>createComplex),
    "deleteBuilding": (()=>deleteBuilding),
    "deleteComplex": (()=>deleteComplex),
    "getBuildingById": (()=>getBuildingById),
    "getBuildings": (()=>getBuildings),
    "getComplexById": (()=>getComplexById),
    "getComplexes": (()=>getComplexes),
    "getFacilities": (()=>getFacilities),
    "getRooms": (()=>getRooms),
    "testDatabaseConnection": (()=>testDatabaseConnection),
    "updateBuilding": (()=>updateBuilding),
    "updateComplex": (()=>updateComplex)
});
const getComplexes = async ()=>{
    try {
        const response = await fetch('/api/housing');
        if (!response.ok) {
            throw new Error(`فشل في جلب المجمعات السكنية: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('فشل في جلب المجمعات السكنية:', error);
        throw error;
    }
};
const getComplexById = async (id)=>{
    try {
        const response = await fetch(`/api/housing/${id}`);
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`فشل في جلب المجمع السكني: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`فشل في جلب المجمع السكني بالمعرف ${id}:`, error);
        throw error;
    }
};
const createComplex = async (complex)=>{
    console.log('محاولة إنشاء مجمع سكني جديد:', complex);
    try {
        // التحقق من وجود الحقول المطلوبة
        if (!complex.name || !complex.location) {
            throw new Error('اسم المجمع والموقع مطلوبان');
        }
        const response = await fetch('/api/housing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(complex)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `فشل في إنشاء المجمع السكني: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('تم إنشاء المجمع بنجاح:', data);
        return data;
    } catch (err) {
        console.error('خطأ غير متوقع عند إنشاء المجمع:', err);
        throw err;
    }
};
const updateComplex = async (id, updates)=>{
    try {
        const response = await fetch('/api/housing', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                ...updates
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `فشل في تحديث المجمع السكني: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`فشل في تحديث المجمع السكني بالمعرف ${id}:`, error);
        throw error;
    }
};
const deleteComplex = async (id)=>{
    try {
        const response = await fetch(`/api/housing?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `فشل في حذف المجمع السكني: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`فشل في حذف المجمع السكني بالمعرف ${id}:`, error);
        throw error;
    }
};
const testDatabaseConnection = async ()=>{
    try {
        const response = await fetch('/api/housing', {
            method: 'OPTIONS'
        });
        if (!response.ok) {
            return false;
        }
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('فشل في اختبار الاتصال بقاعدة البيانات:', error);
        return false;
    }
};
const getBuildings = async (complexId)=>{
    try {
        const url = complexId ? `/api/housing/buildings?complexId=${complexId}` : '/api/housing/buildings';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`فشل في جلب المباني: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('فشل في جلب المباني:', error);
        throw error;
    }
};
const getBuildingById = async (id)=>{
    try {
        const response = await fetch(`/api/housing/buildings/${id}`);
        if (response.status === 404) {
            return null;
        }
        if (!response.ok) {
            throw new Error(`فشل في جلب المبنى: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`فشل في جلب المبنى بالمعرف ${id}:`, error);
        throw error;
    }
};
const createBuilding = async (building)=>{
    try {
        const response = await fetch('/api/housing/buildings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(building)
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `فشل في إنشاء المبنى: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('فشل في إنشاء مبنى جديد:', error);
        throw error;
    }
};
const updateBuilding = async (id, updates)=>{
    try {
        const response = await fetch('/api/housing/buildings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id,
                ...updates
            })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `فشل في تحديث المبنى: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`فشل في تحديث المبنى بالمعرف ${id}:`, error);
        throw error;
    }
};
const deleteBuilding = async (id)=>{
    try {
        const response = await fetch(`/api/housing/buildings?id=${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `فشل في حذف المبنى: ${response.statusText}`);
        }
    } catch (error) {
        console.error(`فشل في حذف المبنى بالمعرف ${id}:`, error);
        throw error;
    }
};
const getRooms = async (buildingId)=>{
    try {
        const url = buildingId ? `/api/housing/rooms?buildingId=${buildingId}` : '/api/housing/rooms';
        console.log(`Fetching rooms from ${url}`);
        const response = await fetch(url, {
            // Adding cache: no-store to prevent caching issues
            cache: 'no-store'
        });
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            try {
                // Try to parse as JSON
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || response.statusText;
            } catch  {
                // If not JSON, use as plain text
                errorMessage = errorText || response.statusText;
            }
            console.error(`Error response from rooms API: ${errorMessage}`);
            throw new Error(`فشل في جلب الغرف: ${errorMessage}`);
        }
        const data = await response.json();
        // Map database schema to the expected Room interface if needed
        return data.map((room)=>({
                id: room.id,
                building_id: room.building_id,
                room_number: room.room_number,
                type: room.type,
                status: room.status || 'available',
                floor: room.floor,
                // Add other expected fields with defaults
                name: room.room_number // Use room_number as name if not present
            }));
    } catch (error) {
        console.error('فشل في جلب الغرف:', error);
        throw error;
    }
};
const getFacilities = async (complexId, buildingId)=>{
    try {
        let url = '/api/housing/facilities';
        const params = new URLSearchParams();
        if (complexId) params.append('complexId', complexId);
        if (buildingId) params.append('buildingId', buildingId);
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        console.log(`Fetching facilities from ${url}`);
        const response = await fetch(url, {
            // Adding cache: no-store to prevent caching issues
            cache: 'no-store'
        });
        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            try {
                // Try to parse as JSON
                const errorData = JSON.parse(errorText);
                errorMessage = errorData.error || response.statusText;
            } catch  {
                // If not JSON, use as plain text
                errorMessage = errorText || response.statusText;
            }
            console.error(`Error response from facilities API: ${errorMessage}`);
            throw new Error(`فشل في جلب المرافق: ${errorMessage}`);
        }
        const data = await response.json();
        // Map database schema to the expected Facility interface if needed
        return data.map((facility)=>({
                id: facility.id,
                complex_id: facility.complex_id,
                building_id: facility.building_id,
                name: facility.name,
                type: facility.type,
                location_description: facility.location_description
            }));
    } catch (error) {
        console.error('فشل في جلب المرافق:', error);
        throw error;
    }
};
}}),
"[project]/src/app/maintenance/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>MaintenanceRequestsPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/maintenanceService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/housingService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function MaintenanceRequestsPage() {
    const [maintenanceRequests, setMaintenanceRequests] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [complexes, setComplexes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [buildings, setBuildings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Filters
    const [filters, setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        complexId: '',
        buildingId: '',
        status: '',
        priority: ''
    });
    // تحقق من وجود جدول maintenance_requests وإنشاؤه إذا لزم الأمر
    const setupMaintenanceTable = async ()=>{
        try {
            // التحقق من وجود الجدول
            const { data: tableExists, error: checkError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_requests').select('id').limit(1);
            if (checkError && checkError.message.includes('does not exist')) {
                // الجدول غير موجود، نقوم بتشغيل سكريبت إعداد قاعدة البيانات
                console.log('جدول maintenance_requests غير موجود. سيتم إنشاؤه الآن...');
                // تنفيذ سكريبت إنشاء قاعدة البيانات
                const response = await fetch('/api/diagnostics', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        action: 'setup_database'
                    })
                });
                if (response.ok) {
                    console.log('تم إعداد قاعدة البيانات بنجاح');
                    return true;
                } else {
                    const errorData = await response.json();
                    throw new Error(`فشل إعداد قاعدة البيانات: ${errorData.error || 'خطأ غير معروف'}`);
                }
            } else if (checkError) {
                throw checkError;
            }
            return true;
        } catch (err) {
            console.error('خطأ في التحقق من جدول maintenance_requests:', err);
            return false;
        }
    };
    // Fetch all complexes on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchComplexes = async ()=>{
            try {
                const complexesData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getComplexes"])();
                setComplexes(complexesData);
            } catch (err) {
                console.error('Error fetching complexes:', err);
            }
        };
        fetchComplexes();
    }, []);
    // Fetch buildings when complex filter changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (filters.complexId) {
            const fetchBuildings = async ()=>{
                try {
                    const buildingsData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBuildings"])(filters.complexId);
                    setBuildings(buildingsData);
                    // Reset building filter if selected complex changes
                    setFilters((prev)=>({
                            ...prev,
                            buildingId: ''
                        }));
                } catch (err) {
                    console.error('Error fetching buildings:', err);
                }
            };
            fetchBuildings();
        } else {
            setBuildings([]);
        }
    }, [
        filters.complexId
    ]);
    // Fetch maintenance requests with filters
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchMaintenanceRequests = async ()=>{
            setLoading(true);
            setError(null);
            try {
                // التحقق من وجود جدول maintenance_requests وإنشاؤه إذا لزم الأمر
                await setupMaintenanceTable();
                const requests = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaintenanceRequests"])(filters.complexId || undefined, filters.buildingId || undefined, filters.status || undefined);
                // Apply priority filter in-memory if needed
                const filteredRequests = filters.priority ? requests.filter((request)=>request.priority === filters.priority) : requests;
                setMaintenanceRequests(filteredRequests);
            } catch (err) {
                console.error('Error fetching maintenance requests:', err);
                // Show more detailed error message to help with debugging
                setError(`حدث خطأ أثناء تحميل البيانات: ${err.message || 'خطأ غير معروف'}. الرجاء المحاولة مرة أخرى.`);
            } finally{
                setLoading(false);
            }
        };
        fetchMaintenanceRequests();
    }, [
        filters
    ]);
    // Handle filter changes
    const handleFilterChange = (field, value)=>{
        setFilters((prev)=>({
                ...prev,
                [field]: value
            }));
    };
    // Reset all filters
    const resetFilters = ()=>{
        setFilters({
            complexId: '',
            buildingId: '',
            status: '',
            priority: ''
        });
    };
    // إعادة تهيئة قاعدة البيانات يدويًا
    const handleDatabaseSetup = async ()=>{
        setLoading(true);
        setError(null);
        try {
            // تنفيذ سكريبت إعداد قاعدة البيانات
            const response = await fetch('/api/diagnostics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    action: 'setup_database'
                })
            });
            if (response.ok) {
                // إعادة تحميل البيانات بعد إعداد قاعدة البيانات
                const requests = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getMaintenanceRequests"])();
                setMaintenanceRequests(requests);
            } else {
                const errorData = await response.json();
                throw new Error(`فشل إعداد قاعدة البيانات: ${errorData.error || 'خطأ غير معروف'}`);
            }
        } catch (err) {
            console.error('Error setting up database:', err);
            setError(`فشل إعداد قاعدة البيانات: ${err.message || 'خطأ غير معروف'}`);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen p-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold dark:text-white",
                        children: "طلبات الصيانة"
                    }, void 0, false, {
                        fileName: "[project]/src/app/maintenance/page.tsx",
                        lineNumber: 189,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/maintenance/new",
                        className: "btn btn-primary bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded dark:bg-teal-700 dark:hover:bg-teal-600",
                        children: "طلب صيانة جديد"
                    }, void 0, false, {
                        fileName: "[project]/src/app/maintenance/page.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/maintenance/page.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow rounded-lg p-6 mb-6 dark:bg-gray-800",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold mb-4 dark:text-white",
                        children: "تصفية النتائج"
                    }, void 0, false, {
                        fileName: "[project]/src/app/maintenance/page.tsx",
                        lineNumber: 197,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 text-sm font-medium dark:text-gray-300",
                                        children: "المجمع السكني"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                        lineNumber: 200,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: filters.complexId,
                                        onChange: (e)=>handleFilterChange('complexId', e.target.value),
                                        className: "select w-full border border-gray-300 rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "جميع المجمعات"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 206,
                                                columnNumber: 15
                                            }, this),
                                            complexes.map((complex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: complex.id,
                                                    children: complex.name
                                                }, complex.id, false, {
                                                    fileName: "[project]/src/app/maintenance/page.tsx",
                                                    lineNumber: 208,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                        lineNumber: 201,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/page.tsx",
                                lineNumber: 199,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 text-sm font-medium dark:text-gray-300",
                                        children: "المبنى"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                        lineNumber: 216,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: filters.buildingId,
                                        onChange: (e)=>handleFilterChange('buildingId', e.target.value),
                                        className: "select w-full border border-gray-300 rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                        disabled: !filters.complexId,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "جميع المباني"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 223,
                                                columnNumber: 15
                                            }, this),
                                            buildings.map((building)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: building.id,
                                                    children: building.name
                                                }, building.id, false, {
                                                    fileName: "[project]/src/app/maintenance/page.tsx",
                                                    lineNumber: 225,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                        lineNumber: 217,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/page.tsx",
                                lineNumber: 215,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 text-sm font-medium dark:text-gray-300",
                                        children: "الحالة"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                        lineNumber: 233,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: filters.status,
                                        onChange: (e)=>handleFilterChange('status', e.target.value),
                                        className: "select w-full border border-gray-300 rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "جميع الحالات"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 239,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "pending",
                                                children: "معلق"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 240,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "approved",
                                                children: "معتمد"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 241,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "rejected",
                                                children: "مرفوض"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 242,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "in_progress",
                                                children: "قيد التنفيذ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 243,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "completed",
                                                children: "مكتمل"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 244,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/page.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 text-sm font-medium dark:text-gray-300",
                                        children: "الأولوية"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                        lineNumber: 249,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: filters.priority,
                                        onChange: (e)=>handleFilterChange('priority', e.target.value),
                                        className: "select w-full border border-gray-300 rounded p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "جميع الأولويات"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 255,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "low",
                                                children: "منخفضة"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 256,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "medium",
                                                children: "متوسطة"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 257,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "high",
                                                children: "عالية"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 258,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "emergency",
                                                children: "طارئة"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 259,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                        lineNumber: 250,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/page.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/maintenance/page.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-4 flex justify-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: resetFilters,
                                className: "btn bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded dark:bg-gray-600 dark:hover:bg-gray-700 mr-2",
                                children: "إعادة تعيين التصفية"
                            }, void 0, false, {
                                fileName: "[project]/src/app/maintenance/page.tsx",
                                lineNumber: 265,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: handleDatabaseSetup,
                                className: "btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded dark:bg-blue-700 dark:hover:bg-blue-600",
                                children: "إعادة تهيئة قاعدة البيانات"
                            }, void 0, false, {
                                fileName: "[project]/src/app/maintenance/page.tsx",
                                lineNumber: 272,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/maintenance/page.tsx",
                        lineNumber: 264,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/maintenance/page.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md dark:bg-red-900/30 dark:border-red-800 dark:text-red-400",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/maintenance/page.tsx",
                    lineNumber: 284,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/maintenance/page.tsx",
                lineNumber: 283,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-10 dark:text-gray-300",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg",
                        children: "جاري تحميل البيانات..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/maintenance/page.tsx",
                        lineNumber: 292,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/maintenance/page.tsx",
                    lineNumber: 291,
                    columnNumber: 11
                }, this) : maintenanceRequests.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center py-10",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-lg text-gray-500 dark:text-gray-400",
                        children: "لا توجد طلبات صيانة مطابقة للمعايير المحددة."
                    }, void 0, false, {
                        fileName: "[project]/src/app/maintenance/page.tsx",
                        lineNumber: 296,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/maintenance/page.tsx",
                    lineNumber: 295,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "overflow-x-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "min-w-full divide-y divide-gray-200 dark:divide-gray-700",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                className: "bg-gray-50 dark:bg-gray-700",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300",
                                            children: "رقم الطلب"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/maintenance/page.tsx",
                                            lineNumber: 303,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300",
                                            children: "المجمع / المبنى"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/maintenance/page.tsx",
                                            lineNumber: 306,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300",
                                            children: "الحالة"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/maintenance/page.tsx",
                                            lineNumber: 309,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300",
                                            children: "الأولوية"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/maintenance/page.tsx",
                                            lineNumber: 312,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300",
                                            children: "مقدم الطلب"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/maintenance/page.tsx",
                                            lineNumber: 315,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300",
                                            children: "تاريخ الطلب"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/maintenance/page.tsx",
                                            lineNumber: 318,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300",
                                            children: "إجراءات"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/maintenance/page.tsx",
                                            lineNumber: 321,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/maintenance/page.tsx",
                                    lineNumber: 302,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/maintenance/page.tsx",
                                lineNumber: 301,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                className: "bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700",
                                children: maintenanceRequests.map((request)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "hover:bg-gray-50 dark:hover:bg-gray-700",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 whitespace-nowrap dark:text-gray-300",
                                                children: request.id.substring(0, 8)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 329,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 whitespace-nowrap dark:text-gray-300",
                                                children: [
                                                    "المجمع: ",
                                                    request.complex_id.substring(0, 8),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                                        lineNumber: 333,
                                                        columnNumber: 23
                                                    }, this),
                                                    "المبنى: ",
                                                    request.building_id.substring(0, 8)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 330,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 whitespace-nowrap",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusBadge, {
                                                    status: request.status
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/maintenance/page.tsx",
                                                    lineNumber: 337,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 336,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 whitespace-nowrap",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PriorityBadge, {
                                                    priority: request.priority
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/maintenance/page.tsx",
                                                    lineNumber: 340,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 339,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 whitespace-nowrap dark:text-gray-300",
                                                children: request.reported_by
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 342,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 whitespace-nowrap dark:text-gray-300",
                                                dir: "ltr",
                                                children: new Date(request.reported_date).toLocaleDateString('ar-SA')
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 345,
                                                columnNumber: 21
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-4 whitespace-nowrap text-sm",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/maintenance/${request.id}`,
                                                        className: "text-blue-600 hover:underline ml-2 dark:text-blue-400",
                                                        children: "عرض التفاصيل"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: `/maintenance/${request.id}/edit`,
                                                        className: "text-teal-600 hover:underline dark:text-teal-400",
                                                        children: "تحرير"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/maintenance/page.tsx",
                                                lineNumber: 348,
                                                columnNumber: 21
                                            }, this)
                                        ]
                                    }, request.id, true, {
                                        fileName: "[project]/src/app/maintenance/page.tsx",
                                        lineNumber: 328,
                                        columnNumber: 19
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/maintenance/page.tsx",
                                lineNumber: 326,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/maintenance/page.tsx",
                        lineNumber: 300,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/app/maintenance/page.tsx",
                    lineNumber: 299,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/maintenance/page.tsx",
                lineNumber: 289,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/maintenance/page.tsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}
// Helper component for status badges
function StatusBadge({ status }) {
    const statusColors = {
        pending: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            darkBg: 'dark:bg-yellow-900/30',
            darkText: 'dark:text-yellow-300',
            label: 'معلق'
        },
        approved: {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            darkBg: 'dark:bg-blue-900/30',
            darkText: 'dark:text-blue-300',
            label: 'معتمد'
        },
        rejected: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            darkBg: 'dark:bg-red-900/30',
            darkText: 'dark:text-red-300',
            label: 'مرفوض'
        },
        in_progress: {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            darkBg: 'dark:bg-purple-900/30',
            darkText: 'dark:text-purple-300',
            label: 'قيد التنفيذ'
        },
        completed: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            darkBg: 'dark:bg-green-900/30',
            darkText: 'dark:text-green-300',
            label: 'مكتمل'
        }
    };
    const { bg, text, darkBg, darkText, label } = statusColors[status];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `${bg} ${text} ${darkBg} ${darkText} px-2 py-1 rounded-full text-xs`,
        children: label
    }, void 0, false, {
        fileName: "[project]/src/app/maintenance/page.tsx",
        lineNumber: 416,
        columnNumber: 5
    }, this);
}
// Helper component for priority badges
function PriorityBadge({ priority }) {
    const priorityColors = {
        low: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            darkBg: 'dark:bg-green-900/30',
            darkText: 'dark:text-green-300',
            label: 'منخفضة'
        },
        medium: {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            darkBg: 'dark:bg-blue-900/30',
            darkText: 'dark:text-blue-300',
            label: 'متوسطة'
        },
        high: {
            bg: 'bg-orange-100',
            text: 'text-orange-800',
            darkBg: 'dark:bg-orange-900/30',
            darkText: 'dark:text-orange-300',
            label: 'عالية'
        },
        emergency: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            darkBg: 'dark:bg-red-900/30',
            darkText: 'dark:text-red-300',
            label: 'طارئة'
        }
    };
    const { bg, text, darkBg, darkText, label } = priorityColors[priority];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `${bg} ${text} ${darkBg} ${darkText} px-2 py-1 rounded-full text-xs`,
        children: label
    }, void 0, false, {
        fileName: "[project]/src/app/maintenance/page.tsx",
        lineNumber: 458,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__594969d7._.js.map