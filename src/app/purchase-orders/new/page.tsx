'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createPurchaseOrder, createPurchaseItem } from '@/lib/services/purchaseService';
import { getCategories, getItems } from '@/lib/services/inventoryService';
import { PurchaseOrder, PurchaseItem, Category, Item } from '@/models/types';

interface OrderItem {
  item_id: string;
  quantity: number;
  unit_price?: number;
  notes?: string;
  itemName?: string; // للعرض فقط
  unit?: string; // للعرض فقط
}

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  
  // حالة النموذج
  const [formData, setFormData] = useState<{
    vendor: string;
    notes: string;
    created_by: string;
  }>({
    vendor: '',
    notes: '',
    created_by: '',
  });

  // حالة العناصر
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [newItem, setNewItem] = useState<OrderItem>({
    item_id: '',
    quantity: 1,
  });
  
  // حالة البيانات المرجعية
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  
  // حالة التحميل
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);

  // تحميل التصنيفات عند تحميل الصفحة
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message || 'فشل في تحميل التصنيفات');
      }
    };

    fetchCategories();
  }, []);

  // تحميل الأصناف عند تغيير التصنيف المحدد
  useEffect(() => {
    if (!selectedCategoryId) {
      setItems([]);
      return;
    }

    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        const data = await getItems(selectedCategoryId);
        setItems(data);
      } catch (err: any) {
        console.error('Error fetching items:', err);
        setError(err.message || 'فشل في تحميل الأصناف');
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, [selectedCategoryId]);

  // تحديث بيانات النموذج
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // تحديث بيانات الصنف الجديد
  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'item_id' && value) {
      const selectedItem = items.find(item => item.id === value);
      setNewItem(prev => ({
        ...prev,
        [name]: value,
        itemName: selectedItem?.name,
        unit: selectedItem?.unit
      }));
    } else {
      setNewItem(prev => ({ ...prev, [name]: value }));
    }
  };

  // إضافة صنف إلى قائمة الأصناف المطلوبة
  const addItemToOrder = () => {
    if (!newItem.item_id) {
      setError('الرجاء اختيار صنف');
      return;
    }

    if (newItem.quantity <= 0) {
      setError('الكمية يجب أن تكون أكبر من صفر');
      return;
    }

    const selectedItem = items.find(item => item.id === newItem.item_id);
    
    if (!selectedItem) {
      setError('الصنف غير موجود');
      return;
    }

    // التحقق من وجود الصنف مسبقًا في القائمة
    const existingItemIndex = orderItems.findIndex(item => item.item_id === newItem.item_id);
    
    if (existingItemIndex >= 0) {
      // تحديث الكمية إذا كان الصنف موجود
      const updatedItems = [...orderItems];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      if (newItem.unit_price) {
        updatedItems[existingItemIndex].unit_price = newItem.unit_price;
      }
      if (newItem.notes) {
        updatedItems[existingItemIndex].notes = newItem.notes;
      }
      setOrderItems(updatedItems);
    } else {
      // إضافة صنف جديد
      setOrderItems([...orderItems, {
        ...newItem,
        itemName: selectedItem.name,
        unit: selectedItem.unit
      }]);
    }

    // إعادة تعيين حقول الصنف الجديد
    setNewItem({
      item_id: '',
      quantity: 1,
    });
    
    setError(null);
  };

  // إزالة صنف من القائمة
  const removeItem = (index: number) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };

  // حساب المبلغ الإجمالي للطلب
  const calculateTotal = (): number => {
    return orderItems.reduce((total, item) => {
      return total + (item.quantity * (item.unit_price || 0));
    }, 0);
  };

  // إرسال نموذج طلب الشراء
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (orderItems.length === 0) {
      setError('الرجاء إضافة صنف واحد على الأقل');
      return;
    }

    if (!formData.created_by.trim()) {
      setError('الرجاء إدخال اسم منشئ الطلب');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // إنشاء طلب الشراء
      const orderData: Omit<PurchaseOrder, 'id' | 'order_date'> = {
        status: 'draft',
        total_amount: calculateTotal(),
        vendor: formData.vendor.trim() || undefined,
        notes: formData.notes.trim() || undefined,
        created_by: formData.created_by.trim()
      };

      const createdOrder = await createPurchaseOrder(orderData);

      // إضافة عناصر الطلب
      for (const item of orderItems) {
        const purchaseItem: Omit<PurchaseItem, 'id'> = {
          purchase_order_id: createdOrder.id,
          item_id: item.item_id,
          quantity: item.quantity,
          unit_price: item.unit_price,
          notes: item.notes
        };

        await createPurchaseItem(purchaseItem);
      }

      setSuccess('تم إنشاء طلب الشراء بنجاح');
      
      // الانتقال إلى صفحة طلب الشراء بعد 2 ثانية
      setTimeout(() => {
        router.push(`/purchase-orders/${createdOrder.id}`);
      }, 2000);
      
    } catch (err: any) {
      console.error('Error creating purchase order:', err);
      setError(err.message || 'فشل في إنشاء طلب الشراء');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-white">إنشاء طلب شراء جديد</h1>
        <Link
          href="/purchase-orders"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          العودة لقائمة طلبات الشراء
        </Link>
      </div>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 border-r-4 border-red-500 text-red-700 rounded-md dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-100 border-r-4 border-green-500 text-green-700 rounded-md dark:bg-green-900/30 dark:border-green-800 dark:text-green-400">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">بيانات الطلب</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                المورد (اختياري)
              </label>
              <input
                type="text"
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="اسم المورد"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                منشئ الطلب *
              </label>
              <input
                type="text"
                name="created_by"
                value={formData.created_by}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="اسم منشئ الطلب"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                ملاحظات (اختياري)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="أي ملاحظات إضافية حول الطلب"
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 dark:bg-gray-800">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">إضافة أصناف للطلب</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                التصنيف
              </label>
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">اختر التصنيف</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                الصنف
              </label>
              <select
                name="item_id"
                value={newItem.item_id}
                onChange={handleNewItemChange}
                disabled={!selectedCategoryId || loadingItems}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">اختر الصنف</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.unit})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                الكمية
              </label>
              <input
                type="number"
                name="quantity"
                value={newItem.quantity}
                onChange={handleNewItemChange}
                min="1"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                سعر الوحدة (اختياري)
              </label>
              <input
                type="number"
                name="unit_price"
                value={newItem.unit_price || ''}
                onChange={handleNewItemChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="سعر الوحدة"
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium dark:text-gray-300">
                ملاحظات (اختياري)
              </label>
              <input
                type="text"
                name="notes"
                value={newItem.notes || ''}
                onChange={handleNewItemChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="أي ملاحظات حول الصنف"
              />
            </div>
            
            <div className="flex items-end">
              <button
                type="button"
                onClick={addItemToOrder}
                disabled={!newItem.item_id || newItem.quantity <= 0}
                className={`w-full px-4 py-2 text-white font-medium rounded-md
                  ${!newItem.item_id || newItem.quantity <= 0
                      ? 'bg-blue-300 cursor-not-allowed dark:bg-blue-800'
                      : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'}
                `}
              >
                إضافة للطلب
              </button>
            </div>
          </div>
          
          {orderItems.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3 dark:text-white">قائمة الأصناف المطلوبة</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">#</th>
                      <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">الصنف</th>
                      <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">الكمية</th>
                      <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">سعر الوحدة</th>
                      <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">الإجمالي</th>
                      <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">ملاحظات</th>
                      <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">إجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                    {orderItems.map((item, index) => (
                      <tr key={index} className="dark:bg-gray-800">
                        <td className="px-4 py-3 dark:text-gray-300">{index + 1}</td>
                        <td className="px-4 py-3 dark:text-gray-300">
                          {item.itemName} {item.unit ? `(${item.unit})` : ''}
                        </td>
                        <td className="px-4 py-3 dark:text-gray-300">{item.quantity}</td>
                        <td className="px-4 py-3 dark:text-gray-300">
                          {item.unit_price ? `${item.unit_price} ريال` : '-'}
                        </td>
                        <td className="px-4 py-3 dark:text-gray-300">
                          {item.unit_price ? `${(item.quantity * item.unit_price).toFixed(2)} ريال` : '-'}
                        </td>
                        <td className="px-4 py-3 dark:text-gray-300">{item.notes || '-'}</td>
                        <td className="px-4 py-3">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-gray-50 dark:bg-gray-700">
                      <td className="px-4 py-3 dark:text-gray-300" colSpan={4}>
                        الإجمالي
                      </td>
                      <td className="px-4 py-3 dark:text-gray-300">
                        {calculateTotal().toFixed(2)} ريال
                      </td>
                      <td className="px-4 py-3" colSpan={2}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 text-center text-gray-500 bg-gray-50 rounded-md dark:bg-gray-700 dark:text-gray-400">
              لم تتم إضافة أي أصناف بعد
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={orderItems.length === 0 || loading}
            className={`px-6 py-3 text-white font-medium rounded-md
              ${orderItems.length === 0 || loading
                  ? 'bg-green-300 cursor-not-allowed dark:bg-green-800'
                  : 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600'}
            `}
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء طلب الشراء'}
          </button>
        </div>
      </form>
    </div>
  );
}