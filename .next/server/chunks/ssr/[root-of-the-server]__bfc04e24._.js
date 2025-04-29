module.exports = {

"[externals]/pg [external] (pg, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/lib/neondb.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "pool": (()=>pool),
    "query": (()=>query),
    "safeQuery": (()=>safeQuery),
    "testConnection": (()=>testConnection)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/pg [external] (pg, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
// استخدام عنوان الاتصال المباشر بقاعدة بيانات Neon
const connectionString = 'postgresql://HousingMaintenance_owner:npg_fC8S4bpZLsJw@ep-weathered-meadow-a44a1v3i-pooler.us-east-1.aws.neon.tech/HousingMaintenance?sslmode=require';
// إنشاء تجمع اتصالات لقاعدة البيانات
const poolInstance = new __TURBOPACK__imported__module__$5b$externals$5d2f$pg__$5b$external$5d$__$28$pg$2c$__esm_import$29$__["Pool"]({
    connectionString,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});
const pool = poolInstance;
async function query(text, params, retries = 3) {
    let lastError;
    for(let attempt = 0; attempt < retries; attempt++){
        const client = await poolInstance.connect().catch((err)=>{
            console.error(`فشل الاتصال بقاعدة البيانات (محاولة ${attempt + 1}/${retries}):`, err.message);
            return null;
        });
        if (!client) {
            lastError = new Error('تعذر إنشاء اتصال بقاعدة البيانات');
            continue;
        }
        try {
            const result = await client.query(text, params);
            return result;
        } catch (error) {
            lastError = error;
            console.error(`فشل الاستعلام (محاولة ${attempt + 1}/${retries}):`, error.message);
        } finally{
            client.release();
        }
    }
    // إذا وصلنا إلى هنا، فقد فشلت جميع المحاولات
    throw lastError || new Error('فشل الاستعلام بعد عدة محاولات');
}
async function testConnection() {
    try {
        const result = await query('SELECT NOW()', [], 1);
        console.log('اتصال ناجح بقاعدة بيانات Neon:', result.rows[0]);
        return true;
    } catch (error) {
        console.error('فشل الاتصال بقاعدة بيانات Neon:', error);
        return false;
    }
}
async function safeQuery(text, params, defaultValue = []) {
    try {
        const result = await query(text, params);
        return result.rows || defaultValue;
    } catch (error) {
        console.error('فشل الاستعلام، استخدام القيمة الافتراضية:', error);
        return defaultValue;
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/services/maintenanceService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/neondb.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
const getMaintenanceRequests = async (complexId, buildingId, status)=>{
    try {
        let sql = 'SELECT * FROM maintenance_requests WHERE 1=1';
        const params = [];
        if (complexId) {
            params.push(complexId);
            sql += ` AND complex_id = $${params.length}`;
        }
        if (buildingId) {
            params.push(buildingId);
            sql += ` AND building_id = $${params.length}`;
        }
        if (status) {
            params.push(status);
            sql += ` AND status = $${params.length}`;
        }
        sql += ' ORDER BY reported_date DESC';
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["safeQuery"])(sql, params, []);
    } catch (err) {
        console.error('Error in getMaintenanceRequests:', err);
        return [];
    }
};
const getMaintenanceRequestById = async (id)=>{
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM maintenance_requests WHERE id = $1', [
            id
        ]);
        return result.rows[0] || null;
    } catch (err) {
        console.error('Error in getMaintenanceRequestById:', err);
        return null;
    }
};
const createMaintenanceRequest = async (request)=>{
    try {
        const newRequest = {
            ...request,
            reported_date: new Date().toISOString(),
            status: request.status || 'pending'
        };
        const fields = Object.keys(newRequest).join(', ');
        const placeholders = Object.keys(newRequest).map((_, i)=>`$${i + 1}`).join(', ');
        const values = Object.values(newRequest);
        const sql = `
      INSERT INTO maintenance_requests (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in createMaintenanceRequest:', err);
        throw err;
    }
};
const updateMaintenanceRequest = async (id, updates)=>{
    try {
        const fields = Object.keys(updates);
        const setClause = fields.map((field, i)=>`${field} = $${i + 1}`).join(', ');
        const values = [
            ...Object.values(updates),
            id
        ];
        const sql = `
      UPDATE maintenance_requests 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in updateMaintenanceRequest:', err);
        throw err;
    }
};
const deleteMaintenanceRequest = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('DELETE FROM maintenance_requests WHERE id = $1', [
            id
        ]);
    } catch (err) {
        console.error('Error in deleteMaintenanceRequest:', err);
        throw err;
    }
};
const getMaintenanceItems = async (maintenanceId)=>{
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM maintenance_items WHERE maintenance_id = $1', [
            maintenanceId
        ]);
        return result.rows || [];
    } catch (err) {
        console.error('Error in getMaintenanceItems:', err);
        throw err;
    }
};
const getMaintenanceItemById = async (id)=>{
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM maintenance_items WHERE id = $1', [
            id
        ]);
        return result.rows[0] || null;
    } catch (err) {
        console.error('Error in getMaintenanceItemById:', err);
        throw err;
    }
};
const createMaintenanceItem = async (item)=>{
    try {
        const fields = Object.keys(item).join(', ');
        const placeholders = Object.keys(item).map((_, i)=>`$${i + 1}`).join(', ');
        const values = Object.values(item);
        const sql = `
      INSERT INTO maintenance_items (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in createMaintenanceItem:', err);
        throw err;
    }
};
const updateMaintenanceItem = async (id, updates)=>{
    try {
        const fields = Object.keys(updates);
        const setClause = fields.map((field, i)=>`${field} = $${i + 1}`).join(', ');
        const values = [
            ...Object.values(updates),
            id
        ];
        const sql = `
      UPDATE maintenance_items 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in updateMaintenanceItem:', err);
        throw err;
    }
};
const deleteMaintenanceItem = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('DELETE FROM maintenance_items WHERE id = $1', [
            id
        ]);
    } catch (err) {
        console.error('Error in deleteMaintenanceItem:', err);
        throw err;
    }
};
const getMonthlyMaintenanceRequests = async (year, month)=>{
    try {
        // Create start and end date for the specified month
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0).toISOString();
        const sql = `
      SELECT * FROM maintenance_requests
      WHERE reported_date >= $1 AND reported_date <= $2
    `;
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["safeQuery"])(sql, [
            startDate,
            endDate
        ], []);
    } catch (err) {
        console.error('Error in getMonthlyMaintenanceRequests:', err);
        return [];
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
/* __next_internal_action_entry_do_not_use__ [{"400e25ba755609ce4e74fda3d0d845ee5d0fea3efb":"getMaintenanceRequestByIdAction","403987f5fbe82b002d61e3936d1beb3410647b0389":"createMaintenanceRequestAction","409c851ca092f327f138c2333508e2e11af723e429":"getMaintenanceItemsAction","604095e084b8431de8ce398d530e40026319e03fa7":"updateMaintenanceRequestAction","70bb6ee1ec2b889e82cd193d1be01daa9a9933b2af":"getMaintenanceRequestsAction"},"",""] */ __turbopack_context__.s({
    "createMaintenanceRequestAction": (()=>createMaintenanceRequestAction),
    "getMaintenanceItemsAction": (()=>getMaintenanceItemsAction),
    "getMaintenanceRequestByIdAction": (()=>getMaintenanceRequestByIdAction),
    "getMaintenanceRequestsAction": (()=>getMaintenanceRequestsAction),
    "updateMaintenanceRequestAction": (()=>updateMaintenanceRequestAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/maintenanceService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
async function getMaintenanceRequestsAction(complexId, buildingId, status) {
    try {
        const requests = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMaintenanceRequests"])(complexId, buildingId, status);
        return {
            data: requests,
            error: null
        };
    } catch (error) {
        console.error('خطأ في جلب طلبات الصيانة:', error);
        return {
            data: [],
            error: `فشل في جلب طلبات الصيانة: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function getMaintenanceRequestByIdAction(id) {
    try {
        const request = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMaintenanceRequestById"])(id);
        return {
            data: request,
            error: null
        };
    } catch (error) {
        console.error(`خطأ في جلب طلب الصيانة رقم ${id}:`, error);
        return {
            data: null,
            error: `فشل في جلب طلب الصيانة: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function createMaintenanceRequestAction(request) {
    try {
        const newRequest = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createMaintenanceRequest"])(request);
        return {
            data: newRequest,
            error: null
        };
    } catch (error) {
        console.error('خطأ في إنشاء طلب صيانة جديد:', error);
        return {
            data: null,
            error: `فشل في إنشاء طلب الصيانة: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function updateMaintenanceRequestAction(id, updates) {
    try {
        const updatedRequest = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateMaintenanceRequest"])(id, updates);
        return {
            data: updatedRequest,
            error: null
        };
    } catch (error) {
        console.error(`خطأ في تحديث طلب الصيانة رقم ${id}:`, error);
        return {
            data: null,
            error: `فشل في تحديث طلب الصيانة: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function getMaintenanceItemsAction(maintenanceId) {
    try {
        const items = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMaintenanceItems"])(maintenanceId);
        return {
            data: items,
            error: null
        };
    } catch (error) {
        console.error(`خطأ في جلب عناصر طلب الصيانة رقم ${maintenanceId}:`, error);
        return {
            data: [],
            error: `فشل في جلب عناصر طلب الصيانة: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getMaintenanceRequestsAction,
    getMaintenanceRequestByIdAction,
    createMaintenanceRequestAction,
    updateMaintenanceRequestAction,
    getMaintenanceItemsAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMaintenanceRequestsAction, "70bb6ee1ec2b889e82cd193d1be01daa9a9933b2af", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMaintenanceRequestByIdAction, "400e25ba755609ce4e74fda3d0d845ee5d0fea3efb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createMaintenanceRequestAction, "403987f5fbe82b002d61e3936d1beb3410647b0389", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateMaintenanceRequestAction, "604095e084b8431de8ce398d530e40026319e03fa7", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getMaintenanceItemsAction, "409c851ca092f327f138c2333508e2e11af723e429", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/services/housingService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
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
"[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/* __next_internal_action_entry_do_not_use__ [{"00bb2d82c6928939996d181af8789efc1543424a70":"getComplexesAction","402709b8cf649b7af957de63f11db50cce3d694c3d":"createBuildingAction","4060dab5b8630691ebdba88c6003267cb40373361d":"getBuildingByIdAction","4061168614551aa93cb763436e690a9dcadd48026e":"createComplexAction","4068c37e97217c3e9e4ef4b719b483eb451ec8170b":"getBuildingsAction","40d4135efd0f01f33f88aafff9cdf5bdc2069d5351":"getComplexByIdAction","40d4923e97ade028147c1fc320652ad8490a758755":"getRoomsAction","6010ba36cfecde96273f983d37b2c3133f270f0acd":"updateBuildingAction","6020c5ccca05b9edcee1b4194818ce8df196ba504b":"getFacilitiesAction","609d44bc6f01912b9256046a94586916c30f6b5f38":"updateComplexAction"},"",""] */ __turbopack_context__.s({
    "createBuildingAction": (()=>createBuildingAction),
    "createComplexAction": (()=>createComplexAction),
    "getBuildingByIdAction": (()=>getBuildingByIdAction),
    "getBuildingsAction": (()=>getBuildingsAction),
    "getComplexByIdAction": (()=>getComplexByIdAction),
    "getComplexesAction": (()=>getComplexesAction),
    "getFacilitiesAction": (()=>getFacilitiesAction),
    "getRoomsAction": (()=>getRoomsAction),
    "updateBuildingAction": (()=>updateBuildingAction),
    "updateComplexAction": (()=>updateComplexAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/housingService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function getComplexesAction() {
    try {
        const complexes = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getComplexes"])();
        return {
            data: complexes,
            error: null
        };
    } catch (error) {
        console.error('خطأ في جلب المجمعات السكنية:', error);
        return {
            data: [],
            error: `فشل في جلب المجمعات السكنية: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function getComplexByIdAction(id) {
    try {
        const complex = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getComplexById"])(id);
        return {
            data: complex,
            error: null
        };
    } catch (error) {
        console.error(`خطأ في جلب المجمع السكني رقم ${id}:`, error);
        return {
            data: null,
            error: `فشل في جلب المجمع السكني: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function createComplexAction(complex) {
    try {
        const newComplex = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createComplex"])(complex);
        return {
            data: newComplex,
            error: null
        };
    } catch (error) {
        console.error('خطأ في إنشاء مجمع سكني جديد:', error);
        return {
            data: null,
            error: `فشل في إنشاء المجمع السكني: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function updateComplexAction(id, updates) {
    try {
        const updatedComplex = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateComplex"])(id, updates);
        return {
            data: updatedComplex,
            error: null
        };
    } catch (error) {
        console.error(`خطأ في تحديث المجمع السكني رقم ${id}:`, error);
        return {
            data: null,
            error: `فشل في تحديث المجمع السكني: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function getBuildingsAction(complexId) {
    try {
        const buildings = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBuildings"])(complexId);
        return {
            data: buildings,
            error: null
        };
    } catch (error) {
        console.error('خطأ في جلب المباني:', error);
        return {
            data: [],
            error: `فشل في جلب المباني: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function getBuildingByIdAction(id) {
    try {
        const building = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBuildingById"])(id);
        return {
            data: building,
            error: null
        };
    } catch (error) {
        console.error(`خطأ في جلب المبنى رقم ${id}:`, error);
        return {
            data: null,
            error: `فشل في جلب المبنى: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function createBuildingAction(building) {
    try {
        const newBuilding = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createBuilding"])(building);
        return {
            data: newBuilding,
            error: null
        };
    } catch (error) {
        console.error('خطأ في إنشاء مبنى جديد:', error);
        return {
            data: null,
            error: `فشل في إنشاء المبنى: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function updateBuildingAction(id, updates) {
    try {
        const updatedBuilding = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateBuilding"])(id, updates);
        return {
            data: updatedBuilding,
            error: null
        };
    } catch (error) {
        console.error(`خطأ في تحديث المبنى رقم ${id}:`, error);
        return {
            data: null,
            error: `فشل في تحديث المبنى: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function getRoomsAction(buildingId) {
    try {
        const rooms = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getRooms"])(buildingId);
        return {
            data: rooms,
            error: null
        };
    } catch (error) {
        console.error('خطأ في جلب الغرف:', error);
        return {
            data: [],
            error: `فشل في جلب الغرف: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function getFacilitiesAction(complexId, buildingId) {
    try {
        const facilities = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$housingService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getFacilities"])(complexId, buildingId);
        return {
            data: facilities,
            error: null
        };
    } catch (error) {
        console.error('خطأ في جلب المرافق:', error);
        return {
            data: [],
            error: `فشل في جلب المرافق: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getComplexesAction,
    getComplexByIdAction,
    createComplexAction,
    updateComplexAction,
    getBuildingsAction,
    getBuildingByIdAction,
    createBuildingAction,
    updateBuildingAction,
    getRoomsAction,
    getFacilitiesAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getComplexesAction, "00bb2d82c6928939996d181af8789efc1543424a70", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getComplexByIdAction, "40d4135efd0f01f33f88aafff9cdf5bdc2069d5351", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createComplexAction, "4061168614551aa93cb763436e690a9dcadd48026e", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateComplexAction, "609d44bc6f01912b9256046a94586916c30f6b5f38", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getBuildingsAction, "4068c37e97217c3e9e4ef4b719b483eb451ec8170b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getBuildingByIdAction, "4060dab5b8630691ebdba88c6003267cb40373361d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createBuildingAction, "402709b8cf649b7af957de63f11db50cce3d694c3d", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateBuildingAction, "6010ba36cfecde96273f983d37b2c3133f270f0acd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getRoomsAction, "40d4923e97ade028147c1fc320652ad8490a758755", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getFacilitiesAction, "6020c5ccca05b9edcee1b4194818ce8df196ba504b", null);
}}),
"[project]/.next-internal/server/app/maintenance/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/maintenance/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/maintenance/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/maintenance/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "00bb2d82c6928939996d181af8789efc1543424a70": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getComplexesAction"]),
    "4068c37e97217c3e9e4ef4b719b483eb451ec8170b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getBuildingsAction"]),
    "70bb6ee1ec2b889e82cd193d1be01daa9a9933b2af": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMaintenanceRequestsAction"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/maintenance/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/maintenance/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)\", ACTIONS_MODULE1 => \"[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "00bb2d82c6928939996d181af8789efc1543424a70": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00bb2d82c6928939996d181af8789efc1543424a70"]),
    "4068c37e97217c3e9e4ef4b719b483eb451ec8170b": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["4068c37e97217c3e9e4ef4b719b483eb451ec8170b"]),
    "70bb6ee1ec2b889e82cd193d1be01daa9a9933b2af": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["70bb6ee1ec2b889e82cd193d1be01daa9a9933b2af"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/maintenance/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/maintenance/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/maintenance-actions.ts [app-rsc] (ecmascript)", ACTIONS_MODULE1 => "[project]/src/app/api/server-actions/housing-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$maintenance$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$maintenance$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29222c$__ACTIONS_MODULE1__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$housing$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/maintenance/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/maintenance/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/maintenance/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/maintenance/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/maintenance/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/maintenance/page.tsx", "default");
}}),
"[project]/src/app/maintenance/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$maintenance$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/maintenance/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$maintenance$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/maintenance/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$maintenance$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/maintenance/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/maintenance/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__bfc04e24._.js.map