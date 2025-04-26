import { supabase } from '../supabase';
import { Category, Item, Inventory } from '@/models/types';

// Category Operations
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  
  if (error) throw error;
  return data || [];
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .insert([category])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category> => {
  const { data, error } = await supabase
    .from('categories')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Item Operations
export const getItems = async (categoryId?: string): Promise<Item[]> => {
  let query = supabase.from('items').select('*');
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  return data || [];
};

export const getItemById = async (id: string): Promise<Item | null> => {
  const { data, error } = await supabase
    .from('items')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createItem = async (item: Omit<Item, 'id'>): Promise<Item> => {
  const { data, error } = await supabase
    .from('items')
    .insert([item])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateItem = async (id: string, updates: Partial<Item>): Promise<Item> => {
  const { data, error } = await supabase
    .from('items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Inventory Operations
export const getInventory = async (itemId?: string): Promise<Inventory[]> => {
  let query = supabase
    .from('inventory')
    .select(`
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

export const getInventoryItemById = async (id: string): Promise<Inventory | null> => {
  const { data, error } = await supabase
    .from('inventory')
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

export const updateInventoryQuantity = async (
  itemId: string, 
  quantityChange: number
): Promise<Inventory> => {
  // First, get the current inventory item
  const { data: currentInventory, error: fetchError } = await supabase
    .from('inventory')
    .select('*')
    .eq('item_id', itemId)
    .single();
  
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
    
    const { data, error } = await supabase
      .from('inventory')
      .update({
        quantity: newQuantity,
        last_updated: new Date().toISOString()
      })
      .eq('id', currentInventory.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } 
  // If inventory item does not exist, create it (only if adding quantity)
  else if (quantityChange > 0) {
    const { data, error } = await supabase
      .from('inventory')
      .insert([{
        item_id: itemId,
        quantity: quantityChange,
        last_updated: new Date().toISOString()
      }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } else {
    throw new Error('Cannot reduce quantity of non-existent inventory item');
  }
};

export const updateInventoryItem = async (
  id: string, 
  updates: Partial<Inventory>
): Promise<Inventory> => {
  const updateData = {
    ...updates,
    last_updated: new Date().toISOString()
  };
  
  const { data, error } = await supabase
    .from('inventory')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getLowStockItems = async (threshold: number = 10): Promise<Inventory[]> => {
  const { data, error } = await supabase
    .from('inventory')
    .select(`
      *,
      items:item_id (
        id,
        name,
        category_id,
        unit
      )
    `)
    .lte('quantity', threshold);
  
  if (error) throw error;
  return data || [];
};