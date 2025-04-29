'use server';

import { 
  getMaintenanceRequests, 
  getMaintenanceRequestById,
  createMaintenanceRequest,
  updateMaintenanceRequest,
  getMaintenanceItems
} from '@/lib/services/maintenanceService';
import { MaintenanceRequest, MaintenanceItem } from '@/models/types';

export async function getMaintenanceRequestsAction(
  complexId?: string, 
  buildingId?: string, 
  status?: MaintenanceRequest['status']
) {
  try {
    const requests = await getMaintenanceRequests(complexId, buildingId, status);
    return { data: requests, error: null };
  } catch (error: any) {
    console.error('خطأ في جلب طلبات الصيانة:', error);
    return { data: [], error: `فشل في جلب طلبات الصيانة: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function getMaintenanceRequestByIdAction(id: string) {
  try {
    const request = await getMaintenanceRequestById(id);
    return { data: request, error: null };
  } catch (error: any) {
    console.error(`خطأ في جلب طلب الصيانة رقم ${id}:`, error);
    return { data: null, error: `فشل في جلب طلب الصيانة: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function createMaintenanceRequestAction(
  request: Omit<MaintenanceRequest, 'id' | 'reported_date'>
) {
  try {
    const newRequest = await createMaintenanceRequest(request);
    return { data: newRequest, error: null };
  } catch (error: any) {
    console.error('خطأ في إنشاء طلب صيانة جديد:', error);
    return { data: null, error: `فشل في إنشاء طلب الصيانة: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function updateMaintenanceRequestAction(
  id: string, 
  updates: Partial<MaintenanceRequest>
) {
  try {
    const updatedRequest = await updateMaintenanceRequest(id, updates);
    return { data: updatedRequest, error: null };
  } catch (error: any) {
    console.error(`خطأ في تحديث طلب الصيانة رقم ${id}:`, error);
    return { data: null, error: `فشل في تحديث طلب الصيانة: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function getMaintenanceItemsAction(maintenanceId: string) {
  try {
    const items = await getMaintenanceItems(maintenanceId);
    return { data: items, error: null };
  } catch (error: any) {
    console.error(`خطأ في جلب عناصر طلب الصيانة رقم ${maintenanceId}:`, error);
    return { data: [], error: `فشل في جلب عناصر طلب الصيانة: ${error.message || 'خطأ غير معروف'}` };
  }
}