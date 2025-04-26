"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getInventory, getCategories } from '@/lib/services/inventoryService';
import { Inventory, Category, Item } from '@/models/types';

// Extended type for inventory display with joined item info
type InventoryWithItem = Inventory & {
  items: Item;
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryWithItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showLowStock, setShowLowStock] = useState<boolean>(false);
  
  // Load inventory and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const [inventoryData, categoriesData] = await Promise.all([
          getInventory(),
          getCategories()
        ]);
        
        setInventory(inventoryData as InventoryWithItem[]);
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching inventory data:', err);
        setError('حدث خطأ أثناء تحميل بيانات المخزون. الرجاء المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter inventory based on selected filters
  const filteredInventory = inventory.filter(item => {
    const matchesCategory = selectedCategory ? item.items.category_id === selectedCategory : true;
    const matchesSearch = searchTerm 
      ? item.items.name.toLowerCase().includes(searchTerm.toLowerCase()) 
      : true;
    const matchesLowStock = showLowStock ? item.quantity <= 5 : true;
    
    return matchesCategory && matchesSearch && matchesLowStock;
  });

  // Group by category for display
  const inventoryByCategory = filteredInventory.reduce((acc, item) => {
    const categoryId = item.items.category_id;
    if (!acc[categoryId]) {
      acc[categoryId] = [];
    }
    acc[categoryId].push(item);
    return acc;
  }, {} as Record<string, InventoryWithItem[]>);

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">المخزون</h1>
        <div className="flex gap-3">
          <Link href="/inventory/categories" className="btn btn-secondary">
            إدارة الأصناف
          </Link>
          <Link href="/inventory/add" className="btn btn-primary">
            إضافة مخزون
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">تصفية المخزون</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">البحث بالاسم</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="ادخل اسم الصنف..."
              className="input w-full"
            />
          </div>
          
          <div>
            <label className="block mb-2 text-sm font-medium">التصنيف</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="select w-full"
            >
              <option value="">جميع التصنيفات</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-end">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showLowStock}
                onChange={(e) => setShowLowStock(e.target.checked)}
                className="w-5 h-5 ml-2"
              />
              <span>عرض المخزون المنخفض فقط (أقل من 5)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Inventory List */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-lg">جاري تحميل البيانات...</p>
        </div>
      ) : filteredInventory.length === 0 ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <p className="text-lg text-gray-500">لا توجد أصناف مطابقة للمعايير المحددة.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.keys(inventoryByCategory).map(categoryId => {
            const categoryName = categories.find(c => c.id === categoryId)?.name || 'تصنيف غير معروف';
            const items = inventoryByCategory[categoryId];
            
            return (
              <div key={categoryId} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="bg-gray-50 p-4 border-b">
                  <h3 className="text-lg font-semibold">{categoryName}</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الصنف
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الكمية المتوفرة
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          الوحدة
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          سعر الوحدة
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          آخر تحديث
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          إجراءات
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {items.map((item) => (
                        <tr key={item.id} className={`hover:bg-gray-50 ${item.quantity <= 5 ? 'bg-red-50' : ''}`}>
                          <td className="px-4 py-4">
                            {item.items.name}
                          </td>
                          <td className="px-4 py-4">
                            <span className={item.quantity <= 5 ? 'font-bold text-red-600' : ''}>
                              {item.quantity}
                            </span>
                          </td>
                          <td className="px-4 py-4">
                            {item.items.unit}
                          </td>
                          <td className="px-4 py-4">
                            {item.unit_price ? `${item.unit_price} ريال` : 'غير محدد'}
                          </td>
                          <td className="px-4 py-4" dir="ltr">
                            {new Date(item.last_updated).toLocaleDateString('ar-SA')}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <Link 
                              href={`/inventory/adjust/${item.id}`}
                              className="text-primary hover:underline ml-2"
                            >
                              تعديل الكمية
                            </Link>
                            <Link 
                              href={`/inventory/history/${item.items.id}`}
                              className="text-secondary hover:underline"
                            >
                              سجل الحركة
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="card bg-white">
          <h3 className="text-lg font-medium text-gray-700">إجمالي الأصناف</h3>
          <p className="mt-2 text-3xl font-bold">{inventory.length}</p>
        </div>
        
        <div className="card bg-white">
          <h3 className="text-lg font-medium text-gray-700">الأصناف منخفضة المخزون</h3>
          <p className="mt-2 text-3xl font-bold">
            {inventory.filter(item => item.quantity <= 5).length}
          </p>
        </div>
        
        <div className="card bg-white">
          <h3 className="text-lg font-medium text-gray-700">التصنيفات</h3>
          <p className="mt-2 text-3xl font-bold">{categories.length}</p>
        </div>
      </div>
    </div>
  );
}