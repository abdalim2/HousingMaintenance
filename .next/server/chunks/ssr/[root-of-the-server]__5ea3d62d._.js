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
"[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
/* __next_internal_action_entry_do_not_use__ [{"00c6e5b21a5046bd2746e640af967b35e4c7524cc3":"getCategoriesAction","402a283f9d3242aaafe7948c797d16be244849735b":"createItemAction","404fa6998a25bd6df7763bdd9542da276326616b77":"getInventoryAction","405b72a0f38fc8c58ab306a438d054154506457aba":"getLowStockItemsAction","40a2d515984398086fffcf41e8eead33a08670cb3a":"getItemsAction","40c3f121faf1f417729ef71392bcbad8970a38a7f5":"getItemByIdAction","6019ea2bd9734ed714a49750575012b59a21800cdb":"updateItemAction","608660d1a06897ad459cd94186d8b2a8c701a07b33":"updateInventoryQuantityAction"},"",""] */ __turbopack_context__.s({
    "createItemAction": (()=>createItemAction),
    "getCategoriesAction": (()=>getCategoriesAction),
    "getInventoryAction": (()=>getInventoryAction),
    "getItemByIdAction": (()=>getItemByIdAction),
    "getItemsAction": (()=>getItemsAction),
    "getLowStockItemsAction": (()=>getLowStockItemsAction),
    "updateInventoryQuantityAction": (()=>updateInventoryQuantityAction),
    "updateItemAction": (()=>updateItemAction)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/inventoryService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
async function getInventoryAction(itemId) {
    try {
        const inventory = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getInventory"])(itemId);
        return {
            data: inventory,
            error: null
        };
    } catch (error) {
        console.error('خطأ في جلب بيانات المخزون:', error);
        return {
            data: [],
            error: `فشل في جلب بيانات المخزون: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function getLowStockItemsAction(threshold = 10) {
    try {
        const items = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getLowStockItems"])(threshold);
        return {
            data: items,
            error: null
        };
    } catch (error) {
        console.error('خطأ في جلب العناصر منخفضة المخزون:', error);
        return {
            data: [],
            error: `فشل في جلب العناصر منخفضة المخزون: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function getCategoriesAction() {
    try {
        const categories = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategories"])();
        return {
            data: categories,
            error: null
        };
    } catch (error) {
        console.error('خطأ في جلب الفئات:', error);
        return {
            data: [],
            error: `فشل في جلب الفئات: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function getItemsAction(categoryId) {
    try {
        const items = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getItems"])(categoryId);
        return {
            data: items,
            error: null
        };
    } catch (error) {
        console.error('خطأ في جلب العناصر:', error);
        return {
            data: [],
            error: `فشل في جلب العناصر: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function getItemByIdAction(id) {
    try {
        const item = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getItemById"])(id);
        return {
            data: item,
            error: null
        };
    } catch (error) {
        console.error(`خطأ في جلب العنصر رقم ${id}:`, error);
        return {
            data: null,
            error: `فشل في جلب العنصر: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function createItemAction(item) {
    try {
        const newItem = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createItem"])(item);
        return {
            data: newItem,
            error: null
        };
    } catch (error) {
        console.error('خطأ في إنشاء عنصر جديد:', error);
        return {
            data: null,
            error: `فشل في إنشاء العنصر: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function updateItemAction(id, updates) {
    try {
        const updatedItem = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateItem"])(id, updates);
        return {
            data: updatedItem,
            error: null
        };
    } catch (error) {
        console.error(`خطأ في تحديث العنصر رقم ${id}:`, error);
        return {
            data: null,
            error: `فشل في تحديث العنصر: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
async function updateInventoryQuantityAction(itemId, quantityChange) {
    try {
        const updatedInventory = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$inventoryService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["updateInventoryQuantity"])(itemId, quantityChange);
        return {
            data: updatedInventory,
            error: null
        };
    } catch (error) {
        console.error(`خطأ في تحديث كمية المخزون للعنصر رقم ${itemId}:`, error);
        return {
            data: null,
            error: `فشل في تحديث كمية المخزون: ${error.message || 'خطأ غير معروف'}`
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    getInventoryAction,
    getLowStockItemsAction,
    getCategoriesAction,
    getItemsAction,
    getItemByIdAction,
    createItemAction,
    updateItemAction,
    updateInventoryQuantityAction
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getInventoryAction, "404fa6998a25bd6df7763bdd9542da276326616b77", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getLowStockItemsAction, "405b72a0f38fc8c58ab306a438d054154506457aba", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getCategoriesAction, "00c6e5b21a5046bd2746e640af967b35e4c7524cc3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getItemsAction, "40a2d515984398086fffcf41e8eead33a08670cb3a", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(getItemByIdAction, "40c3f121faf1f417729ef71392bcbad8970a38a7f5", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(createItemAction, "402a283f9d3242aaafe7948c797d16be244849735b", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateItemAction, "6019ea2bd9734ed714a49750575012b59a21800cdb", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(updateInventoryQuantityAction, "608660d1a06897ad459cd94186d8b2a8c701a07b33", null);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/inventory/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/inventory/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/inventory/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/inventory/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <exports>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "00c6e5b21a5046bd2746e640af967b35e4c7524cc3": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategoriesAction"]),
    "404fa6998a25bd6df7763bdd9542da276326616b77": (()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getInventoryAction"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/inventory/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/.next-internal/server/app/inventory/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "00c6e5b21a5046bd2746e640af967b35e4c7524cc3": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["00c6e5b21a5046bd2746e640af967b35e4c7524cc3"]),
    "404fa6998a25bd6df7763bdd9542da276326616b77": (()=>__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__["404fa6998a25bd6df7763bdd9542da276326616b77"])
});
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/inventory/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <module evaluation>');
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/inventory/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/api/server-actions/inventory-actions.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <exports>');
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$module__evaluation$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$inventory$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$api$2f$server$2d$actions$2f$inventory$2d$actions$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$exports$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/app/layout.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.tsx [app-rsc] (ecmascript)"));
}}),
"[project]/src/app/inventory/page.tsx (client reference/proxy) <module evaluation>": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/inventory/page.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/inventory/page.tsx <module evaluation>", "default");
}}),
"[project]/src/app/inventory/page.tsx (client reference/proxy)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server-edge.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2d$edge$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/inventory/page.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/inventory/page.tsx", "default");
}}),
"[project]/src/app/inventory/page.tsx [app-rsc] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$inventory$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/inventory/page.tsx (client reference/proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$inventory$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__ = __turbopack_context__.i("[project]/src/app/inventory/page.tsx (client reference/proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$inventory$2f$page$2e$tsx__$28$client__reference$2f$proxy$29$__);
}}),
"[project]/src/app/inventory/page.tsx [app-rsc] (ecmascript, Next.js server component)": ((__turbopack_context__) => {

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/inventory/page.tsx [app-rsc] (ecmascript)"));
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__5ea3d62d._.js.map