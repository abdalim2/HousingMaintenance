import { query, safeQuery } from '../neondb';
import { PurchaseOrder, PurchaseItem } from '@/models/types';

// Purchase Order Operations
export const getPurchaseOrders = async (
  status?: PurchaseOrder['status']
): Promise<PurchaseOrder[]> => {
  try {
    let sql = 'SELECT * FROM purchase_orders WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }
    
    sql += ' ORDER BY order_date DESC';
    
    return await safeQuery(sql, params, []);
  } catch (err) {
    console.error('Error in getPurchaseOrders:', err);
    return [];
  }
};

export const getPurchaseOrderById = async (id: string): Promise<PurchaseOrder | null> => {
  try {
    const result = await query('SELECT * FROM purchase_orders WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error in getPurchaseOrderById:', err);
    throw err;
  }
};

export const createPurchaseOrder = async (
  order: Omit<PurchaseOrder, 'id' | 'order_date'>
): Promise<PurchaseOrder> => {
  try {
    const newOrder = {
      ...order,
      order_date: new Date().toISOString(),
      status: order.status || 'draft'
    };
    
    const fields = Object.keys(newOrder).join(', ');
    const placeholders = Object.keys(newOrder).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(newOrder);
    
    const sql = `
      INSERT INTO purchase_orders (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in createPurchaseOrder:', err);
    throw err;
  }
};

export const updatePurchaseOrder = async (
  id: string, 
  updates: Partial<PurchaseOrder>
): Promise<PurchaseOrder> => {
  try {
    const fields = Object.keys(updates);
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = [...Object.values(updates), id];
    
    const sql = `
      UPDATE purchase_orders 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in updatePurchaseOrder:', err);
    throw err;
  }
};

export const deletePurchaseOrder = async (id: string): Promise<void> => {
  try {
    await query('DELETE FROM purchase_orders WHERE id = $1', [id]);
  } catch (err) {
    console.error('Error in deletePurchaseOrder:', err);
    throw err;
  }
};

// Purchase Items Operations
export const getPurchaseItems = async (
  purchaseOrderId: string
): Promise<PurchaseItem[]> => {
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
    
    const result = await query(sql, [purchaseOrderId]);
    
    // Format the result to match the expected structure
    return result.rows.map(row => ({
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

export const getPurchaseItemById = async (id: string): Promise<PurchaseItem | null> => {
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
    
    const result = await query(sql, [id]);
    
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

export const createPurchaseItem = async (
  item: Omit<PurchaseItem, 'id'>
): Promise<PurchaseItem> => {
  try {
    const fields = Object.keys(item).join(', ');
    const placeholders = Object.keys(item).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(item);
    
    const sql = `
      INSERT INTO purchase_items (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in createPurchaseItem:', err);
    throw err;
  }
};

export const updatePurchaseItem = async (
  id: string, 
  updates: Partial<PurchaseItem>
): Promise<PurchaseItem> => {
  try {
    const fields = Object.keys(updates);
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = [...Object.values(updates), id];
    
    const sql = `
      UPDATE purchase_items 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in updatePurchaseItem:', err);
    throw err;
  }
};

export const deletePurchaseItem = async (id: string): Promise<void> => {
  try {
    await query('DELETE FROM purchase_items WHERE id = $1', [id]);
  } catch (err) {
    console.error('Error in deletePurchaseItem:', err);
    throw err;
  }
};

// Generate Monthly Purchase Orders
export const generateMonthlyPurchaseOrder = async (
  year: number,
  month: number,
  createdBy: string
): Promise<PurchaseOrder> => {
  try {
    // 1. Get all maintenance requests for the month
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();
    
    // Get all maintenance requests for the specified month first
    let result;
    try {
      result = await query(
        'SELECT id FROM maintenance_requests WHERE reported_date >= $1 AND reported_date <= $2',
        [startDate, endDate]
      );
    } catch (err: any) {
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
    const maintenanceIds = maintenanceRequests.map(req => req.id);
    const placeholders = maintenanceIds.map((_, i) => `$${i + 1}`).join(',');
    
    let itemsResult;
    try {
      itemsResult = await query(
        `SELECT * FROM maintenance_items WHERE maintenance_id IN (${placeholders})`,
        maintenanceIds
      );
    } catch (err: any) {
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
    const itemQuantities: Record<string, number> = {};
    
    maintenanceItems.forEach(item => {
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
    const orderPlaceholders = Object.keys(newOrder).map((_, i) => `$${i + 1}`).join(', ');
    const orderValues = Object.values(newOrder);
    
    const orderResult = await query(
      `INSERT INTO purchase_orders (${orderFields}) VALUES (${orderPlaceholders}) RETURNING *`,
      orderValues
    );
    
    const purchaseOrder = orderResult.rows[0];
    
    // 4. Create purchase items for each item type
    if (Object.keys(itemQuantities).length > 0) {
      const purchaseItems = Object.entries(itemQuantities).map(([itemId, quantity]) => ({
        purchase_order_id: purchaseOrder.id,
        item_id: itemId,
        quantity: quantity
      }));
      
      for (const item of purchaseItems) {
        const itemFields = Object.keys(item).join(', ');
        const itemPlaceholders = Object.keys(item).map((_, i) => `$${i + 1}`).join(', ');
        const itemValues = Object.values(item);
        
        await query(
          `INSERT INTO purchase_items (${itemFields}) VALUES (${itemPlaceholders})`,
          itemValues
        );
      }
    }
    
    return purchaseOrder;
  } catch (error: any) {
    console.error('Error generating monthly purchase order:', error);
    throw error;
  }
};

// Helper function to create an empty purchase order when no maintenance items are found
const createEmptyPurchaseOrder = async (
  year: number,
  month: number,
  createdBy: string
): Promise<PurchaseOrder> => {
  const newOrder = {
    order_date: new Date().toISOString(),
    status: 'draft',
    created_by: createdBy,
    notes: `Auto-generated order for ${year}-${month.toString().padStart(2, '0')} (No maintenance items found)`
  };
  
  const fields = Object.keys(newOrder).join(', ');
  const placeholders = Object.keys(newOrder).map((_, i) => `$${i + 1}`).join(', ');
  const values = Object.values(newOrder);
  
  const result = await query(
    `INSERT INTO purchase_orders (${fields}) VALUES (${placeholders}) RETURNING *`,
    values
  );
  
  return result.rows[0];
};

// Process Received Items
export const processReceivedItems = async (
  purchaseOrderId: string, 
  receivedItems: Array<{ id: string, received_quantity: number }>
): Promise<void> => {
  try {
    // Process each received item
    for (const item of receivedItems) {
      // 1. Update the purchase item
      const updateItemResult = await query(
        'UPDATE purchase_items SET received_quantity = $1 WHERE id = $2 RETURNING *',
        [item.received_quantity, item.id]
      );
      
      if (updateItemResult.rows.length === 0) {
        throw new Error(`Purchase item with ID ${item.id} not found`);
      }
      
      const purchaseItem = updateItemResult.rows[0];
      
      // 2. Update inventory
      // First, get the current inventory for this item
      const inventoryResult = await query(
        'SELECT * FROM inventory WHERE item_id = $1',
        [purchaseItem.item_id]
      );
      
      const currentInventory = inventoryResult.rows[0];
      
      // If inventory entry exists, update it
      if (currentInventory) {
        await query(
          'UPDATE inventory SET quantity = $1, last_updated = $2 WHERE id = $3',
          [currentInventory.quantity + item.received_quantity, new Date().toISOString(), currentInventory.id]
        );
      } 
      // If no inventory entry exists, create one
      else {
        await query(
          'INSERT INTO inventory (item_id, quantity, unit_price, last_updated) VALUES ($1, $2, $3, $4)',
          [purchaseItem.item_id, item.received_quantity, purchaseItem.unit_price, new Date().toISOString()]
        );
      }
    }
    
    // 3. Update the purchase order status to 'received'
    await query(
      'UPDATE purchase_orders SET status = $1 WHERE id = $2',
      ['received', purchaseOrderId]
    );
  } catch (err) {
    console.error('Error in processReceivedItems:', err);
    throw err;
  }
};