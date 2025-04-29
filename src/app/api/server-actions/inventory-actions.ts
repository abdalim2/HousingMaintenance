'use server';

import { 
  getInventory,
  getLowStockItems,
  getCategories,
  getItems,
  getItemById,
  createItem,
  updateItem,
  updateInventoryQuantity
} from '@/lib/services/inventoryService';
import { Item, InventoryWithItem } from '@/models/types';

export async function getInventoryAction(itemId?: string) {
  try {
    const inventory = await getInventory(itemId);
    return { data: inventory, error: null };
  } catch (error: any) {
    console.error('خطأ في جلب بيانات المخزون:', error);
    return { data: [], error: `فشل في جلب بيانات المخزون: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function getLowStockItemsAction(threshold: number = 10) {
  try {
    const items = await getLowStockItems(threshold);
    return { data: items, error: null };
  } catch (error: any) {
    console.error('خطأ في جلب العناصر منخفضة المخزون:', error);
    return { data: [], error: `فشل في جلب العناصر منخفضة المخزون: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function getCategoriesAction() {
  try {
    const categories = await getCategories();
    return { data: categories, error: null };
  } catch (error: any) {
    console.error('خطأ في جلب الفئات:', error);
    return { data: [], error: `فشل في جلب الفئات: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function getItemsAction(categoryId?: string) {
  try {
    const items = await getItems(categoryId);
    return { data: items, error: null };
  } catch (error: any) {
    console.error('خطأ في جلب العناصر:', error);
    return { data: [], error: `فشل في جلب العناصر: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function getItemByIdAction(id: string) {
  try {
    const item = await getItemById(id);
    return { data: item, error: null };
  } catch (error: any) {
    console.error(`خطأ في جلب العنصر رقم ${id}:`, error);
    return { data: null, error: `فشل في جلب العنصر: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function createItemAction(item: Omit<Item, 'id'>) {
  try {
    const newItem = await createItem(item);
    return { data: newItem, error: null };
  } catch (error: any) {
    console.error('خطأ في إنشاء عنصر جديد:', error);
    return { data: null, error: `فشل في إنشاء العنصر: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function updateItemAction(id: string, updates: Partial<Item>) {
  try {
    const updatedItem = await updateItem(id, updates);
    return { data: updatedItem, error: null };
  } catch (error: any) {
    console.error(`خطأ في تحديث العنصر رقم ${id}:`, error);
    return { data: null, error: `فشل في تحديث العنصر: ${error.message || 'خطأ غير معروف'}` };
  }
}

export async function updateInventoryQuantityAction(itemId: string, quantityChange: number) {
  try {
    const updatedInventory = await updateInventoryQuantity(itemId, quantityChange);
    return { data: updatedInventory, error: null };
  } catch (error: any) {
    console.error(`خطأ في تحديث كمية المخزون للعنصر رقم ${itemId}:`, error);
    return { data: null, error: `فشل في تحديث كمية المخزون: ${error.message || 'خطأ غير معروف'}` };
  }
}