import { query, safeQuery } from '../neondb';
import { Category, Item, Inventory } from '@/models/types';

// Category Operations
export const getCategories = async (): Promise<Category[]> => {
  try {
    return await safeQuery('SELECT * FROM categories', [], []);
  } catch (err) {
    console.error('Error in getCategories:', err);
    return [];
  }
};

export const getCategoryById = async (id: string): Promise<Category | null> => {
  try {
    const result = await query('SELECT * FROM categories WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error in getCategoryById:', err);
    throw err;
  }
};

export const createCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
  try {
    const fields = Object.keys(category).join(', ');
    const placeholders = Object.keys(category).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(category);
    
    const sql = `
      INSERT INTO categories (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in createCategory:', err);
    throw err;
  }
};

export const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category> => {
  try {
    const fields = Object.keys(updates);
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = [...Object.values(updates), id];
    
    const sql = `
      UPDATE categories 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in updateCategory:', err);
    throw err;
  }
};

export const deleteCategory = async (id: string): Promise<void> => {
  try {
    await query('DELETE FROM categories WHERE id = $1', [id]);
  } catch (err) {
    console.error('Error in deleteCategory:', err);
    throw err;
  }
};

// Item Operations
export const getItems = async (categoryId?: string): Promise<Item[]> => {
  try {
    let sql = 'SELECT * FROM items';
    const params: any[] = [];
    
    if (categoryId) {
      params.push(categoryId);
      sql += ' WHERE category_id = $1';
    }
    
    const result = await query(sql, params);
    return result.rows || [];
  } catch (err) {
    console.error('Error in getItems:', err);
    throw err;
  }
};

export const getItemById = async (id: string): Promise<Item | null> => {
  try {
    const result = await query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error in getItemById:', err);
    throw err;
  }
};

export const createItem = async (item: Omit<Item, 'id'>): Promise<Item> => {
  try {
    const fields = Object.keys(item).join(', ');
    const placeholders = Object.keys(item).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(item);
    
    const sql = `
      INSERT INTO items (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in createItem:', err);
    throw err;
  }
};

export const updateItem = async (id: string, updates: Partial<Item>): Promise<Item> => {
  try {
    const fields = Object.keys(updates);
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = [...Object.values(updates), id];
    
    const sql = `
      UPDATE items 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in updateItem:', err);
    throw err;
  }
};

export const deleteItem = async (id: string): Promise<void> => {
  try {
    await query('DELETE FROM items WHERE id = $1', [id]);
  } catch (err) {
    console.error('Error in deleteItem:', err);
    throw err;
  }
};

// Inventory Operations
export const getInventory = async (itemId?: string): Promise<Inventory[]> => {
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
    
    const params: any[] = [];
    if (itemId) {
      params.push(itemId);
      sql += ' WHERE i.item_id = $1';
    }
    
    const rows = await safeQuery(sql, params, []);
    
    // Format the result to match the expected structure
    return rows.map((row: {
      id: string;
      item_id: string;
      item_name: string;
      category_id: string;
      unit: string;
      quantity: number;
      last_updated: string;
    }) => ({
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

export const getInventoryItemById = async (id: string): Promise<Inventory | null> => {
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
    console.error('Error in getInventoryItemById:', err);
    throw err;
  }
};

export const updateInventoryQuantity = async (
  itemId: string, 
  quantityChange: number
): Promise<Inventory> => {
  try {
    // First, get the current inventory item
    const currentInventoryResult = await query(
      'SELECT * FROM inventory WHERE item_id = $1',
      [itemId]
    );
    
    const currentInventory = currentInventoryResult.rows[0];
    
    // If inventory item exists, update it
    if (currentInventory) {
      const newQuantity = currentInventory.quantity + quantityChange;
      
      if (newQuantity < 0) {
        throw new Error('Insufficient inventory quantity');
      }
      
      const result = await query(
        'UPDATE inventory SET quantity = $1, last_updated = $2 WHERE id = $3 RETURNING *',
        [newQuantity, new Date().toISOString(), currentInventory.id]
      );
      
      return result.rows[0];
    } 
    // If inventory item does not exist, create it (only if adding quantity)
    else if (quantityChange > 0) {
      const result = await query(
        'INSERT INTO inventory (item_id, quantity, last_updated) VALUES ($1, $2, $3) RETURNING *',
        [itemId, quantityChange, new Date().toISOString()]
      );
      
      return result.rows[0];
    } else {
      throw new Error('Cannot reduce quantity of non-existent inventory item');
    }
  } catch (err) {
    console.error('Error in updateInventoryQuantity:', err);
    throw err;
  }
};

export const updateInventoryItem = async (
  id: string, 
  updates: Partial<Inventory>
): Promise<Inventory> => {
  try {
    const updateData = {
      ...updates,
      last_updated: new Date().toISOString()
    };
    
    const fields = Object.keys(updateData);
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = [...Object.values(updateData), id];
    
    const result = await query(
      `UPDATE inventory SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
      values
    );
    
    return result.rows[0];
  } catch (err) {
    console.error('Error in updateInventoryItem:', err);
    throw err;
  }
};

export const getLowStockItems = async (threshold: number = 10): Promise<{ id: string; item_id: string; quantity: number; last_updated: string; name: string; category: string; unit: string }[]> => {
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
    
    const rows = await safeQuery(sql, [threshold], []);
    
    // Format the result to match the expected structure
    return rows.map((row: { id: string; item_id: string; quantity: number; last_updated: string; name: string; category: string; unit: string }) => ({
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