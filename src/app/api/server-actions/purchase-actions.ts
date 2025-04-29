'use server';

import { 
  getPurchaseOrders,
  getPurchaseOrderById,
  createPurchaseOrder,
  updatePurchaseOrder,
  getPurchaseItems,
  generateMonthlyPurchaseOrder,
  processReceivedItems
} from '@/lib/services/purchaseService';
import { PurchaseOrder } from '@/models/types';

export async function getPurchaseOrdersAction(status?: PurchaseOrder['status']) {
  try {
    const orders = await getPurchaseOrders(status);
    return { data: orders, error: null };
  } catch (error: any) {
    console.error('خطأ في جلب طلبات الشراء:', error);
    return { data: [], error: `فشل في جلب طلبات الشراء: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function getPurchaseOrderByIdAction(id: string) {
  try {
    const order = await getPurchaseOrderById(id);
    return { data: order, error: null };
  } catch (error: any) {
    console.error(`خطأ في جلب طلب الشراء رقم ${id}:`, error);
    return { data: null, error: `فشل في جلب طلب الشراء: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function createPurchaseOrderAction(
  order: Omit<PurchaseOrder, 'id' | 'order_date'>
) {
  try {
    const newOrder = await createPurchaseOrder(order);
    return { data: newOrder, error: null };
  } catch (error: any) {
    console.error('خطأ في إنشاء طلب شراء جديد:', error);
    return { data: null, error: `فشل في إنشاء طلب الشراء: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function updatePurchaseOrderAction(
  id: string, 
  updates: Partial<PurchaseOrder>
) {
  try {
    const updatedOrder = await updatePurchaseOrder(id, updates);
    return { data: updatedOrder, error: null };
  } catch (error: any) {
    console.error(`خطأ في تحديث طلب الشراء رقم ${id}:`, error);
    return { data: null, error: `فشل في تحديث طلب الشراء: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function getPurchaseItemsAction(purchaseOrderId: string) {
  try {
    const items = await getPurchaseItems(purchaseOrderId);
    return { data: items, error: null };
  } catch (error: any) {
    console.error(`خطأ في جلب عناصر طلب الشراء رقم ${purchaseOrderId}:`, error);
    return { data: [], error: `فشل في جلب عناصر طلب الشراء: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function generateMonthlyPurchaseOrderAction(
  year: number,
  month: number,
  createdBy: string
) {
  try {
    const order = await generateMonthlyPurchaseOrder(year, month, createdBy);
    return { data: order, error: null };
  } catch (error: any) {
    console.error('خطأ في إنشاء طلب الشراء الشهري:', error);
    return { data: null, error: `فشل في إنشاء طلب الشراء الشهري: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function processReceivedItemsAction(
  purchaseOrderId: string, 
  receivedItems: Array<{ id: string, received_quantity: number }>
) {
  try {
    await processReceivedItems(purchaseOrderId, receivedItems);
    return { success: true, error: null };
  } catch (error: any) {
    console.error(`خطأ في معالجة العناصر المستلمة لطلب الشراء رقم ${purchaseOrderId}:`, error);
    return { success: false, error: `فشل في معالجة العناصر المستلمة: ${error.message || 'خطأ غير معروف'}` };
  }
}