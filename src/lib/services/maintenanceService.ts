import { supabase } from '../supabase';
import { MaintenanceRequest, MaintenanceItem } from '@/models/types';

// Maintenance Request Operations
export const getMaintenanceRequests = async (
  complexId?: string, 
  buildingId?: string, 
  status?: MaintenanceRequest['status']
): Promise<MaintenanceRequest[]> => {
  let query = supabase.from('maintenance_requests').select('*');
  
  if (complexId) {
    query = query.eq('complex_id', complexId);
  }
  
  if (buildingId) {
    query = query.eq('building_id', buildingId);
  }
  
  if (status) {
    query = query.eq('status', status);
  }
  
  const { data, error } = await query.order('reported_date', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

export const getMaintenanceRequestById = async (id: string): Promise<MaintenanceRequest | null> => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createMaintenanceRequest = async (
  request: Omit<MaintenanceRequest, 'id' | 'reported_date'>
): Promise<MaintenanceRequest> => {
  const newRequest = {
    ...request,
    reported_date: new Date().toISOString(),
    status: request.status || 'pending'
  };

  const { data, error } = await supabase
    .from('maintenance_requests')
    .insert([newRequest])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateMaintenanceRequest = async (
  id: string, 
  updates: Partial<MaintenanceRequest>
): Promise<MaintenanceRequest> => {
  const { data, error } = await supabase
    .from('maintenance_requests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteMaintenanceRequest = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('maintenance_requests')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Maintenance Items Operations
export const getMaintenanceItems = async (
  maintenanceId: string
): Promise<MaintenanceItem[]> => {
  const { data, error } = await supabase
    .from('maintenance_items')
    .select('*')
    .eq('maintenance_id', maintenanceId);
  
  if (error) throw error;
  return data || [];
};

export const getMaintenanceItemById = async (id: string): Promise<MaintenanceItem | null> => {
  const { data, error } = await supabase
    .from('maintenance_items')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createMaintenanceItem = async (
  item: Omit<MaintenanceItem, 'id'>
): Promise<MaintenanceItem> => {
  const { data, error } = await supabase
    .from('maintenance_items')
    .insert([item])
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateMaintenanceItem = async (
  id: string, 
  updates: Partial<MaintenanceItem>
): Promise<MaintenanceItem> => {
  const { data, error } = await supabase
    .from('maintenance_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteMaintenanceItem = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('maintenance_items')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Get maintenance requests for monthly summary
export const getMonthlyMaintenanceRequests = async (
  year: number,
  month: number
): Promise<MaintenanceRequest[]> => {
  // Create start and end date for the specified month
  const startDate = new Date(year, month - 1, 1).toISOString();
  const endDate = new Date(year, month, 0).toISOString();
  
  const { data, error } = await supabase
    .from('maintenance_requests')
    .select('*')
    .gte('reported_date', startDate)
    .lte('reported_date', endDate);
  
  if (error) throw error;
  return data || [];
};