module.exports = {

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
const supabaseUrl = 'zzzzz';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10aWN2bXlmcmRtY2lhZWlwZnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODc1OTMsImV4cCI6MjA1NjY2MzU5M30.6iudxBl6js0heW1mhoSmcXegTIN_lAN2GiFeA3plSIo';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
const postgresUrl = 'postgresql://HousingMaintenance_owner:npg_fC8S4bpZLsJw@ep-weathered-meadow-a44a1v3i-pooler.us-east-1.aws.neon.tech/HousingMaintenance?sslmode=require';
}}),
"[project]/src/lib/services/inventoryService.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "createCategory": (()=>createCategory),
    "createItem": (()=>createItem),
    "deleteCategory": (()=>deleteCategory),
    "deleteItem": (()=>deleteItem),
    "getCategories": (()=>getCategories),
    "getCategoryById": (()=>getCategoryById),
    "getInventory": (()=>getInventory),
    "getInventoryItemById": (()=>getInventoryItemById),
    "getItemById": (()=>getItemById),
    "getItems": (()=>getItems),
    "getLowStockItems": (()=>getLowStockItems),
    "updateCategory": (()=>updateCategory),
    "updateInventoryItem": (()=>updateInventoryItem),
    "updateInventoryQuantity": (()=>updateInventoryQuantity),
    "updateItem": (()=>updateItem)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
const getCategories = async ()=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('categories').select('*');
    if (error) throw error;
    return data || [];
};
const getCategoryById = async (id)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('categories').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};
const createCategory = async (category)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('categories').insert([
        category
    ]).select().single();
    if (error) throw error;
    return data;
};
const updateCategory = async (id, updates)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('categories').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};
const deleteCategory = async (id)=>{
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('categories').delete().eq('id', id);
    if (error) throw error;
};
const getItems = async (categoryId)=>{
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('items').select('*');
    if (categoryId) {
        query = query.eq('category_id', categoryId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};
const getItemById = async (id)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('items').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};
const createItem = async (item)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('items').insert([
        item
    ]).select().single();
    if (error) throw error;
    return data;
};
const updateItem = async (id, updates)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('items').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};
const deleteItem = async (id)=>{
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('items').delete().eq('id', id);
    if (error) throw error;
};
const getInventory = async (itemId)=>{
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').select(`
      *,
      items:item_id (
        id,
        name,
        category_id,
        unit
      )
    `);
    if (itemId) {
        query = query.eq('item_id', itemId);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data || [];
};
const getInventoryItemById = async (id)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').select(`
      *,
      items:item_id (
        id,
        name,
        category_id,
        unit
      )
    `).eq('id', id).single();
    if (error) throw error;
    return data;
};
const updateInventoryQuantity = async (itemId, quantityChange)=>{
    // First, get the current inventory item
    const { data: currentInventory, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').select('*').eq('item_id', itemId).single();
    if (fetchError && fetchError.code !== 'PGRST116') {
        // PGRST116 is the error code for "no rows returned"
        throw fetchError;
    }
    // If inventory item exists, update it
    if (currentInventory) {
        const newQuantity = currentInventory.quantity + quantityChange;
        if (newQuantity < 0) {
            throw new Error('Insufficient inventory quantity');
        }
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').update({
            quantity: newQuantity,
            last_updated: new Date().toISOString()
        }).eq('id', currentInventory.id).select().single();
        if (error) throw error;
        return data;
    } else if (quantityChange > 0) {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').insert([
            {
                item_id: itemId,
                quantity: quantityChange,
                last_updated: new Date().toISOString()
            }
        ]).select().single();
        if (error) throw error;
        return data;
    } else {
        throw new Error('Cannot reduce quantity of non-existent inventory item');
    }
};
const updateInventoryItem = async (id, updates)=>{
    const updateData = {
        ...updates,
        last_updated: new Date().toISOString()
    };
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').update(updateData).eq('id', id).select().single();
    if (error) throw error;
    return data;
};
const getLowStockItems = async (threshold = 10)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').select(`
      *,
      items:item_id (
        id,
        name,
        category_id,
        unit
      )
    `).lte('quantity', threshold);
    if (error) throw error;
    return data || [];
};
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
"[project]/src/app/maintenance/new/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>NewMaintenanceRequestPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/housingService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/inventoryService.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/maintenanceService.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
;
function NewMaintenanceRequestPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    // Form data state
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        complex_id: '',
        building_id: '',
        room_id: '',
        facility_id: '',
        reported_by: '',
        priority: 'medium',
        description: ''
    });
    // Select options state
    const [complexes, setComplexes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [buildings, setBuildings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [rooms, setRooms] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [facilities, setFacilities] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    // Items needed for maintenance
    const [allItems, setAllItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedItems, setSelectedItems] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch all required data on component mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchInitialData = async ()=>{
            setIsLoading(true);
            try {
                // Fetch complexes and items separately to better handle potential errors
                let complexesData = [];
                let itemsData = [];
                try {
                    complexesData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getComplexes"])();
                } catch (complexError) {
                    console.error('Error fetching complexes:', complexError);
                }
                try {
                    itemsData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getItems"])();
                } catch (itemsError) {
                    console.error('Error fetching items:', itemsError);
                }
                setComplexes(complexesData);
                setAllItems(itemsData);
            } catch (err) {
                console.error('Error in fetchInitialData:', err);
                setError('حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.');
            } finally{
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);
    // Fetch buildings when complex is selected
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (formData.complex_id) {
            const fetchBuildings = async ()=>{
                try {
                    const buildingsData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getBuildings"])(formData.complex_id);
                    setBuildings(buildingsData);
                    // Reset dependent fields
                    setFormData((prev)=>({
                            ...prev,
                            building_id: '',
                            room_id: '',
                            facility_id: ''
                        }));
                    setRooms([]);
                    setFacilities([]);
                } catch (err) {
                    console.error('Error fetching buildings:', err);
                }
            };
            fetchBuildings();
        }
    }, [
        formData.complex_id
    ]);
    // Fetch rooms and facilities when building is selected
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (formData.building_id) {
            const fetchRoomsAndFacilities = async ()=>{
                try {
                    const [roomsData, facilitiesData] = await Promise.all([
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRooms"])(formData.building_id),
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getFacilities"])(formData.complex_id, formData.building_id)
                    ]);
                    setRooms(roomsData);
                    setFacilities(facilitiesData);
                    // Reset dependent fields
                    setFormData((prev)=>({
                            ...prev,
                            room_id: '',
                            facility_id: ''
                        }));
                } catch (err) {
                    console.error('Error fetching rooms and facilities:', err);
                }
            };
            fetchRoomsAndFacilities();
        }
    }, [
        formData.building_id,
        formData.complex_id
    ]);
    // Handle input changes
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    // Handle adding a new item
    const handleAddItem = ()=>{
        const newItem = {
            id: Date.now().toString(),
            item_id: '',
            quantity: 1,
            notes: ''
        };
        setSelectedItems((prev)=>[
                ...prev,
                newItem
            ]);
    };
    // Handle item changes
    const handleItemChange = (id, field, value)=>{
        setSelectedItems((prev)=>prev.map((item)=>item.id === id ? {
                    ...item,
                    [field]: value
                } : item));
    };
    // Handle removing an item
    const handleRemoveItem = (id)=>{
        setSelectedItems((prev)=>prev.filter((item)=>item.id !== id));
    };
    // Handle form submission
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setMessage(null);
        try {
            // Validate form
            if (!formData.complex_id || !formData.building_id || !formData.reported_by || !formData.description) {
                throw new Error('الرجاء تعبئة جميع الحقول المطلوبة');
            }
            // Create maintenance request
            const maintenanceRequest = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMaintenanceRequest"])({
                complex_id: formData.complex_id,
                building_id: formData.building_id,
                room_id: formData.room_id || undefined,
                facility_id: formData.facility_id || undefined,
                reported_by: formData.reported_by,
                priority: formData.priority,
                description: formData.description,
                status: 'pending'
            });
            // Create maintenance items
            const itemPromises = selectedItems.map((item)=>{
                if (!item.item_id || item.quantity < 1) return null;
                return (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createMaintenanceItem"])({
                    maintenance_id: maintenanceRequest.id,
                    item_id: item.item_id,
                    quantity_needed: item.quantity,
                    notes: item.notes
                });
            });
            // Filter out null promises and wait for all promises to resolve
            await Promise.all(itemPromises.filter(Boolean));
            setMessage('تم تقديم طلب الصيانة بنجاح');
            // Redirect to maintenance list after 2 seconds
            setTimeout(()=>{
                router.push('/maintenance');
            }, 2000);
        } catch (err) {
            console.error('Error submitting maintenance request:', err);
            setError(err.message || 'حدث خطأ أثناء تقديم طلب الصيانة. الرجاء المحاولة مرة أخرى.');
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold",
                        children: "طلب صيانة جديد"
                    }, void 0, false, {
                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                        lineNumber: 217,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>router.back(),
                        className: "btn bg-gray-500 hover:bg-gray-600",
                        children: "عودة"
                    }, void 0, false, {
                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                        lineNumber: 218,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/maintenance/new/page.tsx",
                lineNumber: 216,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/maintenance/new/page.tsx",
                    lineNumber: 229,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/maintenance/new/page.tsx",
                lineNumber: 228,
                columnNumber: 9
            }, this),
            message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-green-100 border-r-4 border-green-500 text-green-700 p-4 mb-6 rounded-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: message
                }, void 0, false, {
                    fileName: "[project]/src/app/maintenance/new/page.tsx",
                    lineNumber: 235,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/maintenance/new/page.tsx",
                lineNumber: 234,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                className: "bg-white shadow-md rounded-lg p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 font-medium",
                                        children: [
                                            "المجمع السكني ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-500",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 242,
                                                columnNumber: 69
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 242,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "complex_id",
                                        value: formData.complex_id,
                                        onChange: handleChange,
                                        className: "select w-full",
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "اختر المجمع"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 250,
                                                columnNumber: 15
                                            }, this),
                                            complexes.map((complex)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: complex.id,
                                                    children: complex.name
                                                }, complex.id, false, {
                                                    fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                    lineNumber: 252,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 243,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 font-medium",
                                        children: [
                                            "المبنى ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-500",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 260,
                                                columnNumber: 62
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 260,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "building_id",
                                        value: formData.building_id,
                                        onChange: handleChange,
                                        className: "select w-full",
                                        disabled: !formData.complex_id,
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "اختر المبنى"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 269,
                                                columnNumber: 15
                                            }, this),
                                            buildings.map((building)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: building.id,
                                                    children: building.name
                                                }, building.id, false, {
                                                    fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 259,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 font-medium",
                                        children: "الغرفة"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 281,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "room_id",
                                        value: formData.room_id,
                                        onChange: handleChange,
                                        className: "select w-full",
                                        disabled: !formData.building_id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "اختر الغرفة"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 289,
                                                columnNumber: 15
                                            }, this),
                                            rooms.map((room)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: room.id,
                                                    children: [
                                                        "الطابق ",
                                                        room.floor,
                                                        " - غرفة ",
                                                        room.room_number,
                                                        " (",
                                                        room.type,
                                                        ")"
                                                    ]
                                                }, room.id, true, {
                                                    fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 282,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 280,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 font-medium",
                                        children: "المرافق"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 299,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "facility_id",
                                        value: formData.facility_id,
                                        onChange: handleChange,
                                        className: "select w-full",
                                        disabled: !formData.building_id,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "اختر المرافق"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 307,
                                                columnNumber: 15
                                            }, this),
                                            facilities.map((facility)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: facility.id,
                                                    children: [
                                                        facility.name,
                                                        " (",
                                                        facility.type,
                                                        ")"
                                                    ]
                                                }, facility.id, true, {
                                                    fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                    lineNumber: 309,
                                                    columnNumber: 17
                                                }, this))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 300,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 298,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 font-medium",
                                        children: [
                                            "مقدم الطلب ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-500",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 319,
                                                columnNumber: 66
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 319,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        name: "reported_by",
                                        value: formData.reported_by,
                                        onChange: handleChange,
                                        className: "input w-full",
                                        placeholder: "اسم مقدم الطلب",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 318,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 font-medium",
                                        children: [
                                            "الأولوية ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-red-500",
                                                children: "*"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 332,
                                                columnNumber: 64
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 332,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        name: "priority",
                                        value: formData.priority,
                                        onChange: handleChange,
                                        className: "select w-full",
                                        required: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "low",
                                                children: "منخفضة"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 340,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "medium",
                                                children: "متوسطة"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 341,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "high",
                                                children: "عالية"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 342,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "emergency",
                                                children: "طارئة"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 343,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 333,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 331,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                        lineNumber: 317,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block mb-2 font-medium",
                                children: [
                                    "وصف المشكلة ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-red-500",
                                        children: "*"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 349,
                                        columnNumber: 65
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 349,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                name: "description",
                                value: formData.description,
                                onChange: handleChange,
                                className: "input w-full h-32",
                                placeholder: "اكتب وصفاً تفصيلياً للمشكلة...",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 350,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                        lineNumber: 348,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between items-center mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "text-lg font-medium",
                                        children: "الأصناف المطلوبة"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 362,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleAddItem,
                                        className: "btn bg-secondary hover:bg-secondary/90",
                                        children: "إضافة صنف"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 363,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 361,
                                columnNumber: 11
                            }, this),
                            selectedItems.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-gray-500 italic",
                                children: "لم يتم إضافة أي أصناف بعد."
                            }, void 0, false, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 373,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: selectedItems.map((item, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-gray-50 p-4 rounded-md border flex flex-wrap items-end gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-grow min-w-[250px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block mb-2 text-sm font-medium",
                                                        children: [
                                                            "الصنف ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                                lineNumber: 379,
                                                                columnNumber: 77
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                        lineNumber: 379,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: item.item_id,
                                                        onChange: (e)=>handleItemChange(item.id, 'item_id', e.target.value),
                                                        className: "select w-full",
                                                        required: true,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: "",
                                                                children: "اختر الصنف"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                                lineNumber: 386,
                                                                columnNumber: 23
                                                            }, this),
                                                            allItems.map((itemOption)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                    value: itemOption.id,
                                                                    children: itemOption.name
                                                                }, itemOption.id, false, {
                                                                    fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                                    lineNumber: 388,
                                                                    columnNumber: 25
                                                                }, this))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                        lineNumber: 380,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 378,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-24",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block mb-2 text-sm font-medium",
                                                        children: [
                                                            "الكمية ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-red-500",
                                                                children: "*"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                                lineNumber: 396,
                                                                columnNumber: 78
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                        lineNumber: 396,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        min: "1",
                                                        value: item.quantity,
                                                        onChange: (e)=>handleItemChange(item.id, 'quantity', parseInt(e.target.value)),
                                                        className: "input w-full",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                        lineNumber: 397,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 395,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-grow min-w-[250px]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block mb-2 text-sm font-medium",
                                                        children: "ملاحظات"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                        lineNumber: 408,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: item.notes,
                                                        onChange: (e)=>handleItemChange(item.id, 'notes', e.target.value),
                                                        className: "input w-full",
                                                        placeholder: "أي ملاحظات خاصة بالصنف..."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                        lineNumber: 409,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 407,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>handleRemoveItem(item.id),
                                                className: "bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    xmlns: "http://www.w3.org/2000/svg",
                                                    className: "h-5 w-5",
                                                    fill: "none",
                                                    viewBox: "0 0 24 24",
                                                    stroke: "currentColor",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                        strokeLinecap: "round",
                                                        strokeLinejoin: "round",
                                                        strokeWidth: 2,
                                                        d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                        lineNumber: 424,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                    lineNumber: 423,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                                lineNumber: 418,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, item.id, true, {
                                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                                        lineNumber: 377,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 375,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                        lineNumber: 360,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-end gap-4 mt-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>router.back(),
                                className: "btn bg-gray-500 hover:bg-gray-600",
                                disabled: isLoading,
                                children: "إلغاء"
                            }, void 0, false, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 434,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                className: "btn btn-primary",
                                disabled: isLoading,
                                children: isLoading ? 'جاري الحفظ...' : 'تقديم طلب الصيانة'
                            }, void 0, false, {
                                fileName: "[project]/src/app/maintenance/new/page.tsx",
                                lineNumber: 442,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/maintenance/new/page.tsx",
                        lineNumber: 433,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/maintenance/new/page.tsx",
                lineNumber: 239,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/maintenance/new/page.tsx",
        lineNumber: 215,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__e84cea2d._.js.map