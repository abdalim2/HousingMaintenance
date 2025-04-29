"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCategories, createCategory, updateCategory, deleteCategory, getItems } from '@/lib/services/inventoryService';
import { Category, Item } from '@/models/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});

  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Load categories
  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      
      // Get item counts per category
      const counts: Record<string, number> = {};
      for (const category of categoriesData) {
        const items = await getItems(category.id);
        counts[category.id] = items.length;
      }
      setItemCounts(counts);
    } catch (err) {
      console.error('Error fetching categories:', err);
      setError('حدث خطأ أثناء تحميل التصنيفات. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setCategoryId(null);
    setName('');
    setDescription('');
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('اسم التصنيف مطلوب');
      return;
    }

    setError(null);
    setSuccess(null);
    
    try {
      if (isEditing && categoryId) {
        // Update existing category
        await updateCategory(categoryId, { 
          name, 
          description: description || undefined 
        });
        setSuccess('تم تحديث التصنيف بنجاح');
      } else {
        // Create new category
        await createCategory({ 
          name, 
          description: description || undefined 
        });
        setSuccess('تم إنشاء التصنيف بنجاح');
      }
      
      // Reload categories and reset form
      resetForm();
      await loadCategories();
    } catch (err) {
      console.error('Error saving category:', err);
      setError('حدث خطأ أثناء حفظ التصنيف. الرجاء المحاولة مرة أخرى.');
    }
  };

  // Edit category
  const handleEdit = (category: Category) => {
    setIsEditing(true);
    setCategoryId(category.id);
    setName(category.name);
    setDescription(category.description || '');
  };

  // Delete category
  const handleDelete = async (categoryId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا التصنيف؟ سيتم حذف جميع الأصناف المرتبطة به.')) {
      return;
    }

    setError(null);
    setSuccess(null);
    
    try {
      await deleteCategory(categoryId);
      setSuccess('تم حذف التصنيف بنجاح');
      resetForm();
      await loadCategories();
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('حدث خطأ أثناء حذف التصنيف. الرجاء المحاولة مرة أخرى.');
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة الأصناف</h1>
        <Link href="/inventory" className="btn btn-secondary">
          العودة للمخزون
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border-r-4 border-green-500 text-green-700 p-4 mb-6 rounded-md">
          <p>{success}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category Form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">
              {isEditing ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">اسم التصنيف</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input w-full"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium">الوصف (اختياري)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input w-full h-24"
                  placeholder="وصف اختياري للتصنيف..."
                />
              </div>
              
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {isEditing ? 'تحديث' : 'إضافة'}
                </button>
                
                {isEditing && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                  >
                    إلغاء
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Categories List */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 bg-gray-50 border-b">
              <h2 className="font-semibold text-lg">قائمة التصنيفات</h2>
            </div>
            
            {loading ? (
              <div className="text-center py-10">
                <p className="text-lg">جاري تحميل البيانات...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-lg text-gray-500">لا توجد تصنيفات بعد. قم بإنشاء تصنيف جديد.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        التصنيف
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        الوصف
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        عدد الأصناف
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        إجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {categories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap font-medium">
                          {category.name}
                        </td>
                        <td className="px-4 py-4">
                          {category.description || 'لا يوجد وصف'}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          {itemCounts[category.id] || 0}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleEdit(category)}
                            className="text-blue-600 hover:text-blue-900 ml-3"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-900"
                            disabled={itemCounts[category.id] > 0}
                            title={itemCounts[category.id] > 0 ? 'لا يمكن حذف تصنيف يحتوي على أصناف' : 'حذف التصنيف'}
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}