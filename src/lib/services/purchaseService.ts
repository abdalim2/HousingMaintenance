import { supabase } from '../supabase';
import { PurchaseOrder, PurchaseItem } from '@/models/types';

// Purchase Order Operations
export const getPurchaseOrders = async (
  status?: PurchaseOrder['status']
): Promise<PurchaseOrder[]> => {
  try {
    let query = supabase.from('purchase_orders').select('*');
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query.order('order_date', { ascending: false });
    
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

export const getPurchaseOrderById = async (id: string): Promise<PurchaseOrder | null> => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createPurchaseOrder = async (
  order: Omit<PurchaseOrder, 'id' | 'order_date'>
): Promise<PurchaseOrder> => {
  const newOrder = {
    ...order,
    order_date: new Date().toISOString(),
    status: order.status || 'draft'
  };

  const { data, error } = await supabase
    .from('purchase_orders')
    .insert([newOrder])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updatePurchaseOrder = async (
  id: string, 
  updates: Partial<PurchaseOrder>
): Promise<PurchaseOrder> => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deletePurchaseOrder = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('purchase_orders')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Purchase Items Operations
export const getPurchaseItems = async (
  purchaseOrderId: string
): Promise<PurchaseItem[]> => {
  const { data, error } = await supabase
    .from('purchase_items')
    .select(`
      *,
      items:item_id (
        id,
        name,
        category_id,
        unit
      )
    `)
    .eq('purchase_order_id', purchaseOrderId);
  
  if (error) throw error;
  return data || [];
};

export const getPurchaseItemById = async (id: string): Promise<PurchaseItem | null> => {
  const { data, error } = await supabase
    .from('purchase_items')
    .select(`
      *,
      items:item_id (
        id,
        name,
        category_id,
        unit
      )
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createPurchaseItem = async (
  item: Omit<PurchaseItem, 'id'>
): Promise<PurchaseItem> => {
  const { data, error } = await supabase
    .from('purchase_items')
    .insert([item])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updatePurchaseItem = async (
  id: string, 
  updates: Partial<PurchaseItem>
): Promise<PurchaseItem> => {
  const { data, error } = await supabase
    .from('purchase_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deletePurchaseItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('purchase_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
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
    const { data: maintenanceRequests, error: requestsError } = await supabase
      .from('maintenance_requests')
      .select('id')
      .gte('reported_date', startDate)
      .lte('reported_date', endDate);
    
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
    const maintenanceIds = maintenanceRequests.map(req => req.id);
    const { data: maintenanceItems, error: itemsError } = await supabase
      .from('maintenance_items')
      .select('*')
      .in('maintenance_id', maintenanceIds);
    
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
    const itemQuantities: Record<string, number> = {};
    
    maintenanceItems.forEach(item => {
      if (!itemQuantities[item.item_id]) {
        itemQuantities[item.item_id] = 0;
      }
      itemQuantities[item.item_id] += item.quantity_needed;
    });
    
    // 3. Create a new purchase order
    const { data: purchaseOrder, error: orderError } = await supabase
      .from('purchase_orders')
      .insert([{
        order_date: new Date().toISOString(),
        status: 'draft',
        created_by: createdBy,
        notes: `Auto-generated order for ${year}-${month.toString().padStart(2, '0')}`
      }])
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // 4. Create purchase items for each item type
    if (Object.keys(itemQuantities).length > 0) {
      const purchaseItems = Object.entries(itemQuantities).map(([itemId, quantity]) => ({
        purchase_order_id: purchaseOrder.id,
        item_id: itemId,
        quantity: quantity
      }));
      
      const { error: purchaseItemsError } = await supabase
        .from('purchase_items')
        .insert(purchaseItems);
      
      if (purchaseItemsError) throw purchaseItemsError;
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
  const { data: purchaseOrder, error: orderError } = await supabase
    .from('purchase_orders')
    .insert([{
      order_date: new Date().toISOString(),
      status: 'draft',
      created_by: createdBy,
      notes: `Auto-generated order for ${year}-${month.toString().padStart(2, '0')} (No maintenance items found)`
    }])
    .select()
    .single();
  
  if (orderError) throw orderError;
  return purchaseOrder;
};

// Process Received Items
export const processReceivedItems = async (
  purchaseOrderId: string, 
  receivedItems: Array<{ id: string, received_quantity: number }>
): Promise<void> => {
  // Start a transaction to update both purchase items and inventory
  for (const item of receivedItems) {
    // 1. Update the purchase item
    const { data: purchaseItem, error: updateError } = await supabase
      .from('purchase_items')
      .update({ received_quantity: item.received_quantity })
      .eq('id', item.id)
      .select('*')
      .single();
    
    if (updateError) throw updateError;
    
    // 2. Update inventory
    // First, get the current inventory for this item
    const { data: currentInventory, error: inventoryError } = await supabase
      .from('inventory')
      .select('*')
      .eq('item_id', purchaseItem.item_id)
      .single();
    
    if (inventoryError && inventoryError.code !== 'PGRST116') {
      throw inventoryError;
    }
    
    // If inventory entry exists, update it
    if (currentInventory) {
      const { error: updateInventoryError } = await supabase
        .from('inventory')
        .update({
          quantity: currentInventory.quantity + item.received_quantity,
          last_updated: new Date().toISOString()
        })
        .eq('id', currentInventory.id);
      
      if (updateInventoryError) throw updateInventoryError;
    } 
    // If no inventory entry exists, create one
    else {
      const { error: createInventoryError } = await supabase
        .from('inventory')
        .insert([{
          item_id: purchaseItem.item_id,
          quantity: item.received_quantity,
          unit_price: purchaseItem.unit_price,
          last_updated: new Date().toISOString()
        }]);
      
      if (createInventoryError) throw createInventoryError;
    }
  }
  
  // 3. Update the purchase order status to 'received'
  const { error: orderUpdateError } = await supabase
    .from('purchase_orders')
    .update({ status: 'received' })
    .eq('id', purchaseOrderId);
  
  if (orderUpdateError) throw orderUpdateError;
};