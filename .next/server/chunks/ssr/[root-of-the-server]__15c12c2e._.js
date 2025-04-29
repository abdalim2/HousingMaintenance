module.exports = {

"[externals]/pg [external] (pg, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("pg");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/lib/neondb.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
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
"[project]/src/lib/services/purchaseService.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/neondb.ts [app-ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
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
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeQuery"])(sql, params, []);
    } catch (err) {
        console.error('Error in getPurchaseOrders:', err);
        return [];
    }
};
const getPurchaseOrderById = async (id)=>{
    try {
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM purchase_orders WHERE id = $1', [
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
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(sql, values);
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
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in updatePurchaseOrder:', err);
        throw err;
    }
};
const deletePurchaseOrder = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])('DELETE FROM purchase_orders WHERE id = $1', [
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
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(sql, [
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
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(sql, [
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
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(sql, values);
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
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(sql, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error in updatePurchaseItem:', err);
        throw err;
    }
};
const deletePurchaseItem = async (id)=>{
    try {
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])('DELETE FROM purchase_items WHERE id = $1', [
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
            result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])('SELECT id FROM maintenance_requests WHERE reported_date >= $1 AND reported_date <= $2', [
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
            itemsResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(`SELECT * FROM maintenance_items WHERE maintenance_id IN (${placeholders})`, maintenanceIds);
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
        const orderResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO purchase_orders (${orderFields}) VALUES (${orderPlaceholders}) RETURNING *`, orderValues);
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
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO purchase_items (${itemFields}) VALUES (${itemPlaceholders})`, itemValues);
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
    const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])(`INSERT INTO purchase_orders (${fields}) VALUES (${placeholders}) RETURNING *`, values);
    return result.rows[0];
};
const processReceivedItems = async (purchaseOrderId, receivedItems)=>{
    try {
        // Process each received item
        for (const item of receivedItems){
            // 1. Update the purchase item
            const updateItemResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])('UPDATE purchase_items SET received_quantity = $1 WHERE id = $2 RETURNING *', [
                item.received_quantity,
                item.id
            ]);
            if (updateItemResult.rows.length === 0) {
                throw new Error(`Purchase item with ID ${item.id} not found`);
            }
            const purchaseItem = updateItemResult.rows[0];
            // 2. Update inventory
            // First, get the current inventory for this item
            const inventoryResult = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])('SELECT * FROM inventory WHERE item_id = $1', [
                purchaseItem.item_id
            ]);
            const currentInventory = inventoryResult.rows[0];
            // If inventory entry exists, update it
            if (currentInventory) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])('UPDATE inventory SET quantity = $1, last_updated = $2 WHERE id = $3', [
                    currentInventory.quantity + item.received_quantity,
                    new Date().toISOString(),
                    currentInventory.id
                ]);
            } else {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])('INSERT INTO inventory (item_id, quantity, unit_price, last_updated) VALUES ($1, $2, $3, $4)', [
                    purchaseItem.item_id,
                    item.received_quantity,
                    purchaseItem.unit_price,
                    new Date().toISOString()
                ]);
            }
        }
        // 3. Update the purchase order status to 'received'
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$neondb$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["query"])('UPDATE purchase_orders SET status = $1 WHERE id = $2', [
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
"[project]/src/app/purchase-orders/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>PurchaseOrdersPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$purchaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/purchaseService.ts [app-ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$purchaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$purchaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
"use client";
;
;
;
;
function PurchaseOrdersPage() {
    const [purchaseOrders, setPurchaseOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Filter state
    const [filterStatus, setFilterStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [dateRange, setDateRange] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        start: '',
        end: ''
    });
    // Load purchase orders
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const fetchData = async ()=>{
            setLoading(true);
            setError(null);
            try {
                const orders = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$purchaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getPurchaseOrders"])(filterStatus || undefined);
                setPurchaseOrders(orders);
            } catch (err) {
                console.error('Error fetching purchase orders:', err.message || JSON.stringify(err));
                setError(`حدث خطأ أثناء تحميل طلبات الشراء: ${err.message || 'خطأ غير معروف'}. الرجاء المحاولة مرة أخرى.`);
            } finally{
                setLoading(false);
            }
        };
        fetchData();
    }, [
        filterStatus
    ]);
    // Filter by date range
    const filteredOrders = purchaseOrders.filter((order)=>{
        let includeOrder = true;
        // Apply date filters if they exist
        if (dateRange.start) {
            includeOrder = includeOrder && new Date(order.order_date) >= new Date(dateRange.start);
        }
        if (dateRange.end) {
            includeOrder = includeOrder && new Date(order.order_date) <= new Date(dateRange.end);
        }
        return includeOrder;
    });
    // Calculate statistics
    const pendingCount = purchaseOrders.filter((order)=>order.status === 'draft' || order.status === 'submitted').length;
    const receivedCount = purchaseOrders.filter((order)=>order.status === 'received').length;
    const completedCount = purchaseOrders.filter((order)=>order.status === 'completed').length;
    // Monthly purchase orders (group by month)
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const thisMonthOrders = purchaseOrders.filter((order)=>{
        const orderDate = new Date(order.order_date);
        return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear;
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "container mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex justify-between items-center mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold",
                        children: "طلبات الشراء"
                    }, void 0, false, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/purchase-orders/monthly",
                                className: "btn btn-secondary",
                                children: "إنشاء طلب شهري"
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/purchase-orders/new",
                                className: "btn btn-primary",
                                children: "إنشاء طلب شراء"
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 86,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/purchase-orders/page.tsx",
                lineNumber: 84,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-4 gap-6 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card bg-white",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-gray-700",
                                children: "إجمالي الطلبات"
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-3xl font-bold",
                                children: purchaseOrders.length
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 100,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card bg-yellow-50 border-r-4 border-yellow-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-gray-700",
                                children: "طلبات معلقة"
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 104,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-3xl font-bold",
                                children: pendingCount
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 105,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 103,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card bg-blue-50 border-r-4 border-blue-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-gray-700",
                                children: "تم الاستلام"
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-3xl font-bold",
                                children: receivedCount
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 108,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "card bg-green-50 border-r-4 border-green-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-medium text-gray-700",
                                children: "مكتملة"
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-2 text-3xl font-bold",
                                children: completedCount
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/purchase-orders/page.tsx",
                lineNumber: 97,
                columnNumber: 7
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                    lineNumber: 121,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/purchase-orders/page.tsx",
                lineNumber: 120,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow rounded-lg p-6 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-semibold mb-4",
                        children: "تصفية طلبات الشراء"
                    }, void 0, false, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 127,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 text-sm font-medium",
                                        children: "الحالة"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                                        lineNumber: 130,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                        value: filterStatus,
                                        onChange: (e)=>setFilterStatus(e.target.value),
                                        className: "select w-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "",
                                                children: "جميع الحالات"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 136,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "draft",
                                                children: "مسودة"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 137,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "submitted",
                                                children: "مقدم"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 138,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "approved",
                                                children: "معتمد"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 139,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "ordered",
                                                children: "تم الطلب"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 140,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "received",
                                                children: "تم الاستلام"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 141,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                value: "completed",
                                                children: "مكتمل"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 142,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                                        lineNumber: 131,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 129,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 text-sm font-medium",
                                        children: "من تاريخ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                                        lineNumber: 147,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: dateRange.start,
                                        onChange: (e)=>setDateRange({
                                                ...dateRange,
                                                start: e.target.value
                                            }),
                                        className: "input w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                                        lineNumber: 148,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 text-sm font-medium",
                                        children: "إلى تاريخ"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                                        lineNumber: 157,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "date",
                                        value: dateRange.end,
                                        onChange: (e)=>setDateRange({
                                                ...dateRange,
                                                end: e.target.value
                                            }),
                                        className: "input w-full"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                                        lineNumber: 158,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 156,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/purchase-orders/page.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow-md rounded-lg p-6 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex justify-between items-center mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-semibold",
                                children: [
                                    "طلبات الشهر الحالي (",
                                    thisMonthOrders.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this),
                            thisMonthOrders.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: `/reports/monthly/${currentYear}/${currentMonth + 1}`,
                                className: "text-primary hover:underline",
                                children: "عرض التقرير الشهري"
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 173,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 170,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                        children: [
                            thisMonthOrders.slice(0, 3).map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border rounded-md p-4 hover:bg-gray-50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-center mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "font-medium",
                                                    children: [
                                                        "طلب #",
                                                        order.id.substring(0, 8)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                    lineNumber: 183,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusBadge, {
                                                    status: order.status
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                    lineNumber: 184,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                                            lineNumber: 182,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-600 text-sm mb-2",
                                            dir: "ltr",
                                            children: new Date(order.order_date).toLocaleDateString('ar-SA')
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                                            lineNumber: 186,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-gray-700",
                                            children: order.total_amount ? `${order.total_amount} ريال` : 'المبلغ غير محدد'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                                            lineNumber: 189,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "mt-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: `/purchase-orders/${order.id}`,
                                                className: "text-primary hover:underline text-sm",
                                                children: "عرض التفاصيل"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 193,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                                            lineNumber: 192,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, order.id, true, {
                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                    lineNumber: 181,
                                    columnNumber: 13
                                }, this)),
                            thisMonthOrders.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-span-3 bg-gray-50 p-4 rounded-md text-center text-gray-500",
                                children: "لا توجد طلبات شراء لهذا الشهر"
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                lineNumber: 201,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/purchase-orders/page.tsx",
                lineNumber: 169,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white shadow-md rounded-lg overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 bg-gray-50 border-b",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "font-semibold text-lg",
                            children: "جميع طلبات الشراء"
                        }, void 0, false, {
                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                            lineNumber: 211,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 210,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg",
                            children: "جاري تحميل البيانات..."
                        }, void 0, false, {
                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                            lineNumber: 216,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this) : filteredOrders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-10",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-lg text-gray-500",
                            children: "لا توجد طلبات شراء مطابقة للمعايير المحددة."
                        }, void 0, false, {
                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                            lineNumber: 220,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "overflow-x-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                            className: "min-w-full divide-y divide-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                    className: "bg-gray-50",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                children: "رقم الطلب"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 227,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                children: "التاريخ"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 230,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                children: "الحالة"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 233,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                children: "المبلغ الإجمالي"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 236,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                children: "المورد"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 239,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                children: "منشئ الطلب"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 242,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                                className: "px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider",
                                                children: "إجراءات"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                lineNumber: 245,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                                        lineNumber: 226,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                    lineNumber: 225,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                    className: "bg-white divide-y divide-gray-200",
                                    children: filteredOrders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                            className: "hover:bg-gray-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 whitespace-nowrap",
                                                    children: [
                                                        "#",
                                                        order.id.substring(0, 8)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                    lineNumber: 253,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 whitespace-nowrap",
                                                    dir: "ltr",
                                                    children: new Date(order.order_date).toLocaleDateString('ar-SA')
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                    lineNumber: 256,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 whitespace-nowrap",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusBadge, {
                                                        status: order.status
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                        lineNumber: 260,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 whitespace-nowrap",
                                                    children: order.total_amount ? `${order.total_amount} ريال` : 'غير محدد'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 whitespace-nowrap",
                                                    children: order.vendor || 'غير محدد'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 whitespace-nowrap",
                                                    children: order.created_by
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                    lineNumber: 268,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                    className: "px-4 py-4 whitespace-nowrap text-sm",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/purchase-orders/${order.id}`,
                                                            className: "text-secondary hover:underline ml-2",
                                                            children: "عرض"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                            lineNumber: 272,
                                                            columnNumber: 23
                                                        }, this),
                                                        (order.status === 'draft' || order.status === 'submitted') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/purchase-orders/${order.id}/edit`,
                                                            className: "text-primary hover:underline ml-2",
                                                            children: "تحرير"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                            lineNumber: 280,
                                                            columnNumber: 25
                                                        }, this),
                                                        order.status === 'ordered' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                            href: `/purchase-orders/${order.id}/receive`,
                                                            className: "text-accent hover:underline",
                                                            children: "استلام"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                            lineNumber: 289,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                                    lineNumber: 271,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, order.id, true, {
                                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                                            lineNumber: 252,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/purchase-orders/page.tsx",
                                    lineNumber: 250,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/purchase-orders/page.tsx",
                            lineNumber: 224,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/purchase-orders/page.tsx",
                        lineNumber: 223,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/purchase-orders/page.tsx",
                lineNumber: 209,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/purchase-orders/page.tsx",
        lineNumber: 83,
        columnNumber: 5
    }, this);
}
// Helper component for status badges
function StatusBadge({ status }) {
    const statusColors = {
        draft: {
            bg: 'bg-gray-100',
            text: 'text-gray-800',
            label: 'مسودة'
        },
        submitted: {
            bg: 'bg-blue-100',
            text: 'text-blue-800',
            label: 'مقدم'
        },
        approved: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            label: 'معتمد'
        },
        ordered: {
            bg: 'bg-purple-100',
            text: 'text-purple-800',
            label: 'تم الطلب'
        },
        received: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            label: 'تم الاستلام'
        },
        completed: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            label: 'مكتمل'
        }
    };
    const { bg, text, label } = statusColors[status] || {
        bg: 'bg-gray-100',
        text: 'text-gray-800',
        label: status
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `${bg} ${text} px-2 py-1 rounded-full text-xs`,
        children: label
    }, void 0, false, {
        fileName: "[project]/src/app/purchase-orders/page.tsx",
        lineNumber: 322,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__15c12c2e._.js.map