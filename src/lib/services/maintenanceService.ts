import { query, safeQuery } from '../neondb';
import { MaintenanceRequest, MaintenanceItem } from '@/models/types';

// Maintenance Request Operations
export const getMaintenanceRequests = async (
  complexId?: string, 
  buildingId?: string, 
  status?: MaintenanceRequest['status']
): Promise<MaintenanceRequest[]> => {
  try {
    let sql = 'SELECT * FROM maintenance_requests WHERE 1=1';
    const params: any[] = [];
    
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
    
    return await safeQuery(sql, params, []);
  } catch (err) {
    console.error('Error in getMaintenanceRequests:', err);
    return [];
  }
};

export const getMaintenanceRequestById = async (id: string): Promise<MaintenanceRequest | null> => {
  try {
    const result = await query('SELECT * FROM maintenance_requests WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error in getMaintenanceRequestById:', err);
    return null;
  }
};

export const createMaintenanceRequest = async (
  request: Omit<MaintenanceRequest, 'id' | 'reported_date'>
): Promise<MaintenanceRequest> => {
  try {
    const newRequest = {
      ...request,
      reported_date: new Date().toISOString(),
      status: request.status || 'pending'
    };
    
    const fields = Object.keys(newRequest).join(', ');
    const placeholders = Object.keys(newRequest).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(newRequest);
    
    const sql = `
      INSERT INTO maintenance_requests (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in createMaintenanceRequest:', err);
    throw err;
  }
};

export const updateMaintenanceRequest = async (
  id: string, 
  updates: Partial<MaintenanceRequest>
): Promise<MaintenanceRequest> => {
  try {
    const fields = Object.keys(updates);
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = [...Object.values(updates), id];
    
    const sql = `
      UPDATE maintenance_requests 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in updateMaintenanceRequest:', err);
    throw err;
  }
};

export const deleteMaintenanceRequest = async (id: string): Promise<void> => {
  try {
    await query('DELETE FROM maintenance_requests WHERE id = $1', [id]);
  } catch (err) {
    console.error('Error in deleteMaintenanceRequest:', err);
    throw err;
  }
};

// Maintenance Items Operations
export const getMaintenanceItems = async (
  maintenanceId: string
): Promise<MaintenanceItem[]> => {
  try {
    const result = await query('SELECT * FROM maintenance_items WHERE maintenance_id = $1', [maintenanceId]);
    return result.rows || [];
  } catch (err) {
    console.error('Error in getMaintenanceItems:', err);
    throw err;
  }
};

export const getMaintenanceItemById = async (id: string): Promise<MaintenanceItem | null> => {
  try {
    const result = await query('SELECT * FROM maintenance_items WHERE id = $1', [id]);
    return result.rows[0] || null;
  } catch (err) {
    console.error('Error in getMaintenanceItemById:', err);
    throw err;
  }
};

export const createMaintenanceItem = async (
  item: Omit<MaintenanceItem, 'id'>
): Promise<MaintenanceItem> => {
  try {
    const fields = Object.keys(item).join(', ');
    const placeholders = Object.keys(item).map((_, i) => `$${i + 1}`).join(', ');
    const values = Object.values(item);
    
    const sql = `
      INSERT INTO maintenance_items (${fields}) 
      VALUES (${placeholders})
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in createMaintenanceItem:', err);
    throw err;
  }
};

export const updateMaintenanceItem = async (
  id: string, 
  updates: Partial<MaintenanceItem>
): Promise<MaintenanceItem> => {
  try {
    const fields = Object.keys(updates);
    const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const values = [...Object.values(updates), id];
    
    const sql = `
      UPDATE maintenance_items 
      SET ${setClause} 
      WHERE id = $${fields.length + 1}
      RETURNING *
    `;
    
    const result = await query(sql, values);
    return result.rows[0];
  } catch (err) {
    console.error('Error in updateMaintenanceItem:', err);
    throw err;
  }
};

export const deleteMaintenanceItem = async (id: string): Promise<void> => {
  try {
    await query('DELETE FROM maintenance_items WHERE id = $1', [id]);
  } catch (err) {
    console.error('Error in deleteMaintenanceItem:', err);
    throw err;
  }
};

// Get maintenance requests for monthly summary
export const getMonthlyMaintenanceRequests = async (
  year: number,
  month: number
): Promise<MaintenanceRequest[]> => {
  try {
    // Create start and end date for the specified month
    const startDate = new Date(year, month - 1, 1).toISOString();
    const endDate = new Date(year, month, 0).toISOString();
    
    const sql = `
      SELECT * FROM maintenance_requests
      WHERE reported_date >= $1 AND reported_date <= $2
    `;
    
    return await safeQuery(sql, [startDate, endDate], []);
  } catch (err) {
    console.error('Error in getMonthlyMaintenanceRequests:', err);
    return [];
  }
};