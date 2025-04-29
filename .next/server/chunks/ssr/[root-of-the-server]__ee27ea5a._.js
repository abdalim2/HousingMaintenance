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
"[project]/src/lib/services/inventoryService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/neondb.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
const getCategories = async ()=>{
    try {
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["safeQuery"])('SELECT * FROM categories', [], []);
    } catch (err) {
        console.error('Error in getCategories:', err);
        return [];
    }
};
const getCategoryById = async (id)=>{
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM categories WHERE id = $1', [
            id
        ]);
        return result.rows[0] || null;
    } catch (err) {
        console.error('Error in getCategoryById:', err);
        throw err;
    }
};
const createCategory = async (category)=>{
    try {
        const fields = Object.keys(category).join(', ');
        const placeholders = Object.keys(category).map((_, i)=>`$${i + 1}`).join(', ');
        const values = Object.values(category);
        const sql = `
      INSERT INTO categories (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in createCategory:', err);
        throw err;
    }
};
const updateCategory = async (id, updates)=>{
    try {
        const fields = Object.keys(updates);
        const setClause = fields.map((field, i)=>`${field} = $${i + 1}`).join(', ');
        const values = [
            ...Object.values(updates),
            id
        ];
        const sql = `
      UPDATE categories 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in updateCategory:', err);
        throw err;
    }
};
const deleteCategory = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('DELETE FROM categories WHERE id = $1', [
            id
        ]);
    } catch (err) {
        console.error('Error in deleteCategory:', err);
        throw err;
    }
};
const getItems = async (categoryId)=>{
    try {
        let sql = 'SELECT * FROM items';
        const params = [];
        if (categoryId) {
            params.push(categoryId);
            sql += ' WHERE category_id = $1';
        }
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, params);
        return result.rows || [];
    } catch (err) {
        console.error('Error in getItems:', err);
        throw err;
    }
};
const getItemById = async (id)=>{
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM items WHERE id = $1', [
            id
        ]);
        return result.rows[0] || null;
    } catch (err) {
        console.error('Error in getItemById:', err);
        throw err;
    }
};
const createItem = async (item)=>{
    try {
        const fields = Object.keys(item).join(', ');
        const placeholders = Object.keys(item).map((_, i)=>`$${i + 1}`).join(', ');
        const values = Object.values(item);
        const sql = `
      INSERT INTO items (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in createItem:', err);
        throw err;
    }
};
const updateItem = async (id, updates)=>{
    try {
        const fields = Object.keys(updates);
        const setClause = fields.map((field, i)=>`${field} = $${i + 1}`).join(', ');
        const values = [
            ...Object.values(updates),
            id
        ];
        const sql = `
      UPDATE items 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in updateItem:', err);
        throw err;
    }
};
const deleteItem = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('DELETE FROM items WHERE id = $1', [
            id
        ]);
    } catch (err) {
        console.error('Error in deleteItem:', err);
        throw err;
    }
};
const getInventory = async (itemId)=>{
    try {
        let sql = `
      SELECT i.*, 
             it.id as item_id, 
             it.name as item_name, 
             it.category_id, 
             it.unit
      FROM inventory i
      LEFT JOIN items it ON i.item_id = it.id
    `;
        const params = [];
        if (itemId) {
            params.push(itemId);
            sql += ' WHERE i.item_id = $1';
        }
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["safeQuery"])(sql, params, []);
        // Format the result to match the expected structure
        return rows.map((row)=>({
                ...row,
                items: {
                    id: row.item_id,
                    name: row.item_name,
                    category_id: row.category_id,
                    unit: row.unit
                }
            }));
    } catch (err) {
        console.error('Error in getInventory:', err);
        return [];
    }
};
const getInventoryItemById = async (id)=>{
    try {
        const sql = `
      SELECT i.*, 
             it.id as item_id, 
             it.name as item_name, 
             it.category_id, 
             it.unit
      FROM inventory i
      LEFT JOIN items it ON i.item_id = it.id
      WHERE i.id = $1
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, [
            id
        ]);
        if (result.rows.length === 0) {
            return null;
        }
        // Format the result to match the expected structure
        const row = result.rows[0];
        return {
            ...row,
            items: {
                id: row.item_id,
                name: row.item_name,
                category_id: row.category_id,
                unit: row.unit
            }
        };
    } catch (err) {
        console.error('Error in getInventoryItemById:', err);
        throw err;
    }
};
const updateInventoryQuantity = async (itemId, quantityChange)=>{
    try {
        // First, get the current inventory item
        const currentInventoryResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM inventory WHERE item_id = $1', [
            itemId
        ]);
        const currentInventory = currentInventoryResult.rows[0];
        // If inventory item exists, update it
        if (currentInventory) {
            const newQuantity = currentInventory.quantity + quantityChange;
            if (newQuantity < 0) {
                throw new Error('Insufficient inventory quantity');
            }
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('UPDATE inventory SET quantity = $1, last_updated = $2 WHERE id = $3 RETURNING *', [
                newQuantity,
                new Date().toISOString(),
                currentInventory.id
            ]);
            return result.rows[0];
        } else if (quantityChange > 0) {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('INSERT INTO inventory (item_id, quantity, last_updated) VALUES ($1, $2, $3) RETURNING *', [
                itemId,
                quantityChange,
                new Date().toISOString()
            ]);
            return result.rows[0];
        } else {
            throw new Error('Cannot reduce quantity of non-existent inventory item');
        }
    } catch (err) {
        console.error('Error in updateInventoryQuantity:', err);
        throw err;
    }
};
const updateInventoryItem = async (id, updates)=>{
    try {
        const updateData = {
            ...updates,
            last_updated: new Date().toISOString()
        };
        const fields = Object.keys(updateData);
        const setClause = fields.map((field, i)=>`${field} = $${i + 1}`).join(', ');
        const values = [
            ...Object.values(updateData),
            id
        ];
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(`UPDATE inventory SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in updateInventoryItem:', err);
        throw err;
    }
};
const getLowStockItems = async (threshold = 10)=>{
    try {
        const sql = `
      SELECT i.*, 
             it.id as item_id, 
             it.name, 
             it.category_id, 
             it.unit,
             c.name as category
      FROM inventory i
      LEFT JOIN items it ON i.item_id = it.id
      LEFT JOIN categories c ON it.category_id = c.id
      WHERE i.quantity <= $1
    `;
        const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["safeQuery"])(sql, [
            threshold
        ], []);
        // Format the result to match the expected structure
        return rows.map((row)=>({
                id: row.id,
                item_id: row.item_id,
                quantity: row.quantity,
                last_updated: row.last_updated,
                name: row.name,
                category: row.category,
                unit: row.unit
            }));
    } catch (err) {
        console.error('Error in getLowStockItems:', err);
        return [];
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/lib/services/purchaseService.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "createPurchaseItem": (()=>createPurchaseItem),
    "createPurchaseOrder": (()=>createPurchaseOrder),
    "deletePurchaseItem": (()=>deletePurchaseItem),
    "deletePurchaseOrder": (()=>deletePurchaseOrder),
    "generateMonthlyPurchaseOrder": (()=>generateMonthlyPurchaseOrder),
    "getPurchaseItemById": (()=>getPurchaseItemById),
    "getPurchaseItems": (()=>getPurchaseItems),
    "getPurchaseOrderById": (()=>getPurchaseOrderById),
    "getPurchaseOrders": (()=>getPurchaseOrders),
    "processReceivedItems": (()=>processReceivedItems),
    "updatePurchaseItem": (()=>updatePurchaseItem),
    "updatePurchaseOrder": (()=>updatePurchaseOrder)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/neondb.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
const getPurchaseOrders = async (status)=>{
    try {
        let sql = 'SELECT * FROM purchase_orders WHERE 1=1';
        const params = [];
        if (status) {
            params.push(status);
            sql += ` AND status = $${params.length}`;
        }
        sql += ' ORDER BY order_date DESC';
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["safeQuery"])(sql, params, []);
    } catch (err) {
        console.error('Error in getPurchaseOrders:', err);
        return [];
    }
};
const getPurchaseOrderById = async (id)=>{
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM purchase_orders WHERE id = $1', [
            id
        ]);
        return result.rows[0] || null;
    } catch (err) {
        console.error('Error in getPurchaseOrderById:', err);
        throw err;
    }
};
const createPurchaseOrder = async (order)=>{
    try {
        const newOrder = {
            ...order,
            order_date: new Date().toISOString(),
            status: order.status || 'draft'
        };
        const fields = Object.keys(newOrder).join(', ');
        const placeholders = Object.keys(newOrder).map((_, i)=>`$${i + 1}`).join(', ');
        const values = Object.values(newOrder);
        const sql = `
      INSERT INTO purchase_orders (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in createPurchaseOrder:', err);
        throw err;
    }
};
const updatePurchaseOrder = async (id, updates)=>{
    try {
        const fields = Object.keys(updates);
        const setClause = fields.map((field, i)=>`${field} = $${i + 1}`).join(', ');
        const values = [
            ...Object.values(updates),
            id
        ];
        const sql = `
      UPDATE purchase_orders 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in updatePurchaseOrder:', err);
        throw err;
    }
};
const deletePurchaseOrder = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('DELETE FROM purchase_orders WHERE id = $1', [
            id
        ]);
    } catch (err) {
        console.error('Error in deletePurchaseOrder:', err);
        throw err;
    }
};
const getPurchaseItems = async (purchaseOrderId)=>{
    try {
        const sql = `
      SELECT pi.*, 
             i.id as item_id, 
             i.name as item_name, 
             i.category_id, 
             i.unit
      FROM purchase_items pi
      LEFT JOIN items i ON pi.item_id = i.id
      WHERE pi.purchase_order_id = $1
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, [
            purchaseOrderId
        ]);
        // Format the result to match the expected structure
        return result.rows.map((row)=>({
                ...row,
                items: {
                    id: row.item_id,
                    name: row.item_name,
                    category_id: row.category_id,
                    unit: row.unit
                }
            }));
    } catch (err) {
        console.error('Error in getPurchaseItems:', err);
        throw err;
    }
};
const getPurchaseItemById = async (id)=>{
    try {
        const sql = `
      SELECT pi.*, 
             i.id as item_id, 
             i.name as item_name, 
             i.category_id, 
             i.unit
      FROM purchase_items pi
      LEFT JOIN items i ON pi.item_id = i.id
      WHERE pi.id = $1
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, [
            id
        ]);
        if (result.rows.length === 0) {
            return null;
        }
        // Format the result to match the expected structure
        const row = result.rows[0];
        return {
            ...row,
            items: {
                id: row.item_id,
                name: row.item_name,
                category_id: row.category_id,
                unit: row.unit
            }
        };
    } catch (err) {
        console.error('Error in getPurchaseItemById:', err);
        throw err;
    }
};
const createPurchaseItem = async (item)=>{
    try {
        const fields = Object.keys(item).join(', ');
        const placeholders = Object.keys(item).map((_, i)=>`$${i + 1}`).join(', ');
        const values = Object.values(item);
        const sql = `
      INSERT INTO purchase_items (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in createPurchaseItem:', err);
        throw err;
    }
};
const updatePurchaseItem = async (id, updates)=>{
    try {
        const fields = Object.keys(updates);
        const setClause = fields.map((field, i)=>`${field} = $${i + 1}`).join(', ');
        const values = [
            ...Object.values(updates),
            id
        ];
        const sql = `
      UPDATE purchase_items 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in updatePurchaseItem:', err);
        throw err;
    }
};
const deletePurchaseItem = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('DELETE FROM purchase_items WHERE id = $1', [
            id
        ]);
    } catch (err) {
        console.error('Error in deletePurchaseItem:', err);
        throw err;
    }
};
const generateMonthlyPurchaseOrder = async (year, month, createdBy)=>{
    try {
        // 1. Get all maintenance requests for the month
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0).toISOString();
        // Get all maintenance requests for the specified month first
        let result;
        try {
            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('SELECT id FROM maintenance_requests WHERE reported_date >= $1 AND reported_date <= $2', [
                startDate,
                endDate
            ]);
        } catch (err) {
            // If the table doesn't exist, create a purchase order without items
            if (err.message.includes('does not exist')) {
                console.warn('Maintenance requests table does not exist yet. Creating empty purchase order.');
                return createEmptyPurchaseOrder(year, month, createdBy);
            }
            throw err;
        }
        const maintenanceRequests = result.rows;
        if (!maintenanceRequests || maintenanceRequests.length === 0) {
            console.log('No maintenance requests found for the specified month. Creating empty purchase order.');
            return createEmptyPurchaseOrder(year, month, createdBy);
        }
        // Get maintenance items for these requests
        const maintenanceIds = maintenanceRequests.map((req)=>req.id);
        const placeholders = maintenanceIds.map((_, i)=>`$${i + 1}`).join(',');
        let itemsResult;
        try {
            itemsResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(`SELECT * FROM maintenance_items WHERE maintenance_id IN (${placeholders})`, maintenanceIds);
        } catch (err) {
            // If the table doesn't exist, create a purchase order without items
            if (err.message.includes('does not exist')) {
                console.warn('Maintenance items table does not exist yet. Creating empty purchase order.');
                return createEmptyPurchaseOrder(year, month, createdBy);
            }
            throw err;
        }
        const maintenanceItems = itemsResult.rows;
        if (!maintenanceItems || maintenanceItems.length === 0) {
            console.log('No maintenance items found for the specified month. Creating empty purchase order.');
            return createEmptyPurchaseOrder(year, month, createdBy);
        }
        // 2. Group items by item_id and sum quantities
        const itemQuantities = {};
        maintenanceItems.forEach((item)=>{
            if (!itemQuantities[item.item_id]) {
                itemQuantities[item.item_id] = 0;
            }
            itemQuantities[item.item_id] += item.quantity_needed;
        });
        // 3. Create a new purchase order
        const newOrder = {
            order_date: new Date().toISOString(),
            status: 'draft',
            created_by: createdBy,
            notes: `Auto-generated order for ${year}-${month.toString().padStart(2, '0')}`
        };
        const orderFields = Object.keys(newOrder).join(', ');
        const orderPlaceholders = Object.keys(newOrder).map((_, i)=>`$${i + 1}`).join(', ');
        const orderValues = Object.values(newOrder);
        const orderResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO purchase_orders (${orderFields}) VALUES (${orderPlaceholders}) RETURNING *`, orderValues);
        const purchaseOrder = orderResult.rows[0];
        // 4. Create purchase items for each item type
        if (Object.keys(itemQuantities).length > 0) {
            const purchaseItems = Object.entries(itemQuantities).map(([itemId, quantity])=>({
                    purchase_order_id: purchaseOrder.id,
                    item_id: itemId,
                    quantity: quantity
                }));
            for (const item of purchaseItems){
                const itemFields = Object.keys(item).join(', ');
                const itemPlaceholders = Object.keys(item).map((_, i)=>`$${i + 1}`).join(', ');
                const itemValues = Object.values(item);
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO purchase_items (${itemFields}) VALUES (${itemPlaceholders})`, itemValues);
            }
        }
        return purchaseOrder;
    } catch (error) {
        console.error('Error generating monthly purchase order:', error);
        throw error;
    }
};
// Helper function to create an empty purchase order when no maintenance items are found
const createEmptyPurchaseOrder = async (year, month, createdBy)=>{
    const newOrder = {
        order_date: new Date().toISOString(),
        status: 'draft',
        created_by: createdBy,
        notes: `Auto-generated order for ${year}-${month.toString().padStart(2, '0')} (No maintenance items found)`
    };
    const fields = Object.keys(newOrder).join(', ');
    const placeholders = Object.keys(newOrder).map((_, i)=>`$${i + 1}`).join(', ');
    const values = Object.values(newOrder);
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO purchase_orders (${fields}) VALUES (${placeholders}) RETURNING *`, values);
    return result.rows[0];
};
const processReceivedItems = async (purchaseOrderId, receivedItems)=>{
    try {
        // Process each received item
        for (const item of receivedItems){
            // 1. Update the purchase item
            const updateItemResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('UPDATE purchase_items SET received_quantity = $1 WHERE id = $2 RETURNING *', [
                item.received_quantity,
                item.id
            ]);
            if (updateItemResult.rows.length === 0) {
                throw new Error(`Purchase item with ID ${item.id} not found`);
            }
            const purchaseItem = updateItemResult.rows[0];
            // 2. Update inventory
            // First, get the current inventory for this item
            const inventoryResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM inventory WHERE item_id = $1', [
                purchaseItem.item_id
            ]);
            const currentInventory = inventoryResult.rows[0];
            // If inventory entry exists, update it
            if (currentInventory) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('UPDATE inventory SET quantity = $1, last_updated = $2 WHERE id = $3', [
                    currentInventory.quantity + item.received_quantity,
                    new Date().toISOString(),
                    currentInventory.id
                ]);
            } else {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('INSERT INTO inventory (item_id, quantity, unit_price, last_updated) VALUES ($1, $2, $3, $4)', [
                    purchaseItem.item_id,
                    item.received_quantity,
                    purchaseItem.unit_price,
                    new Date().toISOString()
                ]);
            }
        }
        // 3. Update the purchase order status to 'received'
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["query"])('UPDATE purchase_orders SET status = $1 WHERE id = $2', [
            'received',
            purchaseOrderId
        ]);
    } catch (err) {
        console.error('Error in processReceivedItems:', err);
        throw err;
    }
};
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
/* __next_internal_action_entry_do_not_use__ [{"00e5bfb5317f6b9399092c25f7b0c659dfa0c4dd15":"getDashboardData"},"",""] */ __turbopack_context__.s({
    "getDashboardData": (()=>getDashboardData)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/maintenanceService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/inventoryService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$purchaseService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/purchaseService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$purchaseService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$purchaseService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
;
async function getDashboardData() {
    try {
        // استخدام Promise.allSettled للتعامل مع الاستعلامات بشكل متوازي
        const [pendingResult, inProgressResult, lowStockResult, ordersResult] = await Promise.allSettled([
            // Get maintenance requests by status
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMaintenanceRequests"])(undefined, undefined, 'pending').catch(()=>[]),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$maintenanceService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getMaintenanceRequests"])(undefined, undefined, 'in_progress').catch(()=>[]),
            // Get low stock items (threshold of 5)
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLowStockItems"])(5).catch(()=>[]),
            // Get recent purchase orders (limit to 5)
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$purchaseService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getPurchaseOrders"])().catch(()=>[])
        ]);
        // معالجة النتائج وإعادة بيانات منظمة
        return {
            pendingMaintenanceRequests: pendingResult.status === 'fulfilled' ? pendingResult.value : [],
            inProgressMaintenanceRequests: inProgressResult.status === 'fulfilled' ? inProgressResult.value : [],
            lowStockItems: lowStockResult.status === 'fulfilled' ? lowStockResult.value : [],
            recentOrders: ordersResult.status === 'fulfilled' ? ordersResult.value.slice(0, 5) : [],
            error: null
        };
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        return {
            pendingMaintenanceRequests: [],
            inProgressMaintenanceRequests: [],
            lowStockItems: [],
            recentOrders: [],
            error: `فشل في تحميل بيانات لوحة التحكم: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getDashboardData
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getDashboardData, "00e5bfb5317f6b9399092c25f7b0c659dfa0c4dd15", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "00e5bfb5317f6b9399092c25f7b0c659dfa0c4dd15": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getDashboardData"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "00e5bfb5317f6b9399092c25f7b0c659dfa0c4dd15": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00e5bfb5317f6b9399092c25f7b0c659dfa0c4dd15"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/dashboard-data.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$dashboard$2d$data$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/page.tsx", "default");
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__ee27ea5a._.js.map