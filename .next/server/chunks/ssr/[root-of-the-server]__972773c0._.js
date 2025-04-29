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
const supabaseUrl = 'zzzzz';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10aWN2bXlmcmRtY2lhZWlwZnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEwODc1OTMsImV4cCI6MjA1NjY2MzU5M30.6iudxBl6js0heW1mhoSmcXegTIN_lAN2GiFeA3plSIo';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseKey);
const postgresUrl = 'postgresql://HousingMaintenance_owner:npg_fC8S4bpZLsJw@ep-weathered-meadow-a44a1v3i-pooler.us-east-1.aws.neon.tech/HousingMaintenance?sslmode=require';
}}),
"[project]/src/lib/services/purchaseService.ts [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
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
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-ssr] (ecmascript)");
;
const getPurchaseOrders = async (status)=>{
    try {
        let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_orders').select('*');
        if (status) {
            query = query.eq('status', status);
        }
        const { data, error } = await query.order('order_date', {
            ascending: false
        });
        if (error) {
            console.error('Supabase error in getPurchaseOrders:', error);
            if (error.message.includes('does not exist')) {
                console.warn('The purchase_orders table might not exist yet. Make sure to run database initialization scripts.');
            }
            throw new Error(`Database error: ${error.message}`);
        }
        return data || [];
    } catch (err) {
        console.error('Error in getPurchaseOrders:', err);
        throw err;
    }
};
const getPurchaseOrderById = async (id)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_orders').select('*').eq('id', id).single();
    if (error) throw error;
    return data;
};
const createPurchaseOrder = async (order)=>{
    const newOrder = {
        ...order,
        order_date: new Date().toISOString(),
        status: order.status || 'draft'
    };
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_orders').insert([
        newOrder
    ]).select().single();
    if (error) throw error;
    return data;
};
const updatePurchaseOrder = async (id, updates)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_orders').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};
const deletePurchaseOrder = async (id)=>{
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_orders').delete().eq('id', id);
    if (error) throw error;
};
const getPurchaseItems = async (purchaseOrderId)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_items').select(`
      *,
      items:item_id (
        id,
        name,
        category_id,
        unit
      )
    `).eq('purchase_order_id', purchaseOrderId);
    if (error) throw error;
    return data || [];
};
const getPurchaseItemById = async (id)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_items').select(`
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
const createPurchaseItem = async (item)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_items').insert([
        item
    ]).select().single();
    if (error) throw error;
    return data;
};
const updatePurchaseItem = async (id, updates)=>{
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_items').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data;
};
const deletePurchaseItem = async (id)=>{
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_items').delete().eq('id', id);
    if (error) throw error;
};
const generateMonthlyPurchaseOrder = async (year, month, createdBy)=>{
    try {
        // 1. Get all maintenance requests for the month
        const startDate = new Date(year, month - 1, 1).toISOString();
        const endDate = new Date(year, month, 0).toISOString();
        // Get all maintenance requests for the specified month first
        const { data: maintenanceRequests, error: requestsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_requests').select('id').gte('reported_date', startDate).lte('reported_date', endDate);
        if (requestsError) {
            // If the table doesn't exist, create a purchase order without items
            if (requestsError.message.includes('does not exist')) {
                console.warn('Maintenance requests table does not exist yet. Creating empty purchase order.');
                return createEmptyPurchaseOrder(year, month, createdBy);
            }
            throw requestsError;
        }
        if (!maintenanceRequests || maintenanceRequests.length === 0) {
            console.log('No maintenance requests found for the specified month. Creating empty purchase order.');
            return createEmptyPurchaseOrder(year, month, createdBy);
        }
        // Get maintenance items for these requests
        const maintenanceIds = maintenanceRequests.map((req)=>req.id);
        const { data: maintenanceItems, error: itemsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('maintenance_items').select('*').in('maintenance_id', maintenanceIds);
        if (itemsError) {
            // If the table doesn't exist, create a purchase order without items
            if (itemsError.message.includes('does not exist')) {
                console.warn('Maintenance items table does not exist yet. Creating empty purchase order.');
                return createEmptyPurchaseOrder(year, month, createdBy);
            }
            throw itemsError;
        }
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
        const { data: purchaseOrder, error: orderError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_orders').insert([
            {
                order_date: new Date().toISOString(),
                status: 'draft',
                created_by: createdBy,
                notes: `Auto-generated order for ${year}-${month.toString().padStart(2, '0')}`
            }
        ]).select().single();
        if (orderError) throw orderError;
        // 4. Create purchase items for each item type
        if (Object.keys(itemQuantities).length > 0) {
            const purchaseItems = Object.entries(itemQuantities).map(([itemId, quantity])=>({
                    purchase_order_id: purchaseOrder.id,
                    item_id: itemId,
                    quantity: quantity
                }));
            const { error: purchaseItemsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_items').insert(purchaseItems);
            if (purchaseItemsError) throw purchaseItemsError;
        }
        return purchaseOrder;
    } catch (error) {
        console.error('Error generating monthly purchase order:', error);
        throw error;
    }
};
// Helper function to create an empty purchase order when no maintenance items are found
const createEmptyPurchaseOrder = async (year, month, createdBy)=>{
    const { data: purchaseOrder, error: orderError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_orders').insert([
        {
            order_date: new Date().toISOString(),
            status: 'draft',
            created_by: createdBy,
            notes: `Auto-generated order for ${year}-${month.toString().padStart(2, '0')} (No maintenance items found)`
        }
    ]).select().single();
    if (orderError) throw orderError;
    return purchaseOrder;
};
const processReceivedItems = async (purchaseOrderId, receivedItems)=>{
    // Start a transaction to update both purchase items and inventory
    for (const item of receivedItems){
        // 1. Update the purchase item
        const { data: purchaseItem, error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_items').update({
            received_quantity: item.received_quantity
        }).eq('id', item.id).select('*').single();
        if (updateError) throw updateError;
        // 2. Update inventory
        // First, get the current inventory for this item
        const { data: currentInventory, error: inventoryError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').select('*').eq('item_id', purchaseItem.item_id).single();
        if (inventoryError && inventoryError.code !== 'PGRST116') {
            throw inventoryError;
        }
        // If inventory entry exists, update it
        if (currentInventory) {
            const { error: updateInventoryError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').update({
                quantity: currentInventory.quantity + item.received_quantity,
                last_updated: new Date().toISOString()
            }).eq('id', currentInventory.id);
            if (updateInventoryError) throw updateInventoryError;
        } else {
            const { error: createInventoryError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('inventory').insert([
                {
                    item_id: purchaseItem.item_id,
                    quantity: item.received_quantity,
                    unit_price: purchaseItem.unit_price,
                    last_updated: new Date().toISOString()
                }
            ]);
            if (createInventoryError) throw createInventoryError;
        }
    }
    // 3. Update the purchase order status to 'received'
    const { error: orderUpdateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["supabase"].from('purchase_orders').update({
        status: 'received'
    }).eq('id', purchaseOrderId);
    if (orderUpdateError) throw orderUpdateError;
};
}}),
"[project]/src/app/purchase-orders/monthly/page.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>MonthlyPurchaseOrderPage)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$purchaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/services/purchaseService.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
function MonthlyPurchaseOrderPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [year, setYear] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().getFullYear());
    const [month, setMonth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(new Date().getMonth() + 1);
    const [createdBy, setCreatedBy] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Years range (current year and 2 years back)
    const currentYear = new Date().getFullYear();
    const years = [
        currentYear,
        currentYear - 1,
        currentYear - 2
    ];
    // Month names in Arabic
    const months = [
        {
            value: 1,
            label: 'يناير'
        },
        {
            value: 2,
            label: 'فبراير'
        },
        {
            value: 3,
            label: 'مارس'
        },
        {
            value: 4,
            label: 'أبريل'
        },
        {
            value: 5,
            label: 'مايو'
        },
        {
            value: 6,
            label: 'يونيو'
        },
        {
            value: 7,
            label: 'يوليو'
        },
        {
            value: 8,
            label: 'أغسطس'
        },
        {
            value: 9,
            label: 'سبتمبر'
        },
        {
            value: 10,
            label: 'أكتوبر'
        },
        {
            value: 11,
            label: 'نوفمبر'
        },
        {
            value: 12,
            label: 'ديسمبر'
        }
    ];
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!createdBy.trim()) {
            setError("الرجاء إدخال اسم منشئ الطلب");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const purchaseOrder = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$services$2f$purchaseService$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["generateMonthlyPurchaseOrder"])(year, month, createdBy);
            // Redirect to the newly created purchase order
            router.push(`/purchase-orders/${purchaseOrder.id}`);
        } catch (err) {
            console.error('Error generating monthly purchase order:', err);
            setError(err.message || 'حدث خطأ أثناء إنشاء طلب الشراء الشهري');
            setLoading(false);
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
                        children: "إنشاء طلب شراء شهري"
                    }, void 0, false, {
                        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                        href: "/purchase-orders",
                        className: "btn btn-secondary",
                        children: "العودة لقائمة طلبات الشراء"
                    }, void 0, false, {
                        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                        lineNumber: 63,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                lineNumber: 61,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-white rounded-lg shadow p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "mb-6 text-gray-600",
                        children: "سيقوم النظام بإنشاء طلب شراء يتضمن جميع المواد المطلوبة لطلبات الصيانة المسجلة خلال الشهر المحدد."
                    }, void 0, false, {
                        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                        lineNumber: 69,
                        columnNumber: 9
                    }, this),
                    error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            children: error
                        }, void 0, false, {
                            fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                            lineNumber: 75,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                        lineNumber: 74,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSubmit,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-6 mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block mb-2 text-sm font-medium",
                                                children: "السنة"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                                lineNumber: 82,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: year,
                                                onChange: (e)=>setYear(Number(e.target.value)),
                                                className: "select w-full",
                                                disabled: loading,
                                                children: years.map((y)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: y,
                                                        children: y
                                                    }, y, false, {
                                                        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                                        lineNumber: 90,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                                lineNumber: 83,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                        lineNumber: 81,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block mb-2 text-sm font-medium",
                                                children: "الشهر"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                                lineNumber: 96,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                value: month,
                                                onChange: (e)=>setMonth(Number(e.target.value)),
                                                className: "select w-full",
                                                disabled: loading,
                                                children: months.map((m)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                        value: m.value,
                                                        children: m.label
                                                    }, m.value, false, {
                                                        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                                        lineNumber: 104,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                                lineNumber: 97,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                        lineNumber: 95,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mb-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block mb-2 text-sm font-medium",
                                        children: "منشئ الطلب"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                        lineNumber: 111,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        value: createdBy,
                                        onChange: (e)=>setCreatedBy(e.target.value),
                                        className: "input w-full",
                                        placeholder: "أدخل اسمك هنا",
                                        disabled: loading,
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                        lineNumber: 112,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                lineNumber: 110,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: "btn btn-primary",
                                    disabled: loading,
                                    children: loading ? 'جاري الإنشاء...' : 'إنشاء طلب الشراء الشهري'
                                }, void 0, false, {
                                    fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                    lineNumber: 124,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
                lineNumber: 68,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/purchase-orders/monthly/page.tsx",
        lineNumber: 60,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__972773c0._.js.map