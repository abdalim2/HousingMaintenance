"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getItems, updateInventoryQuantity } from '@/lib/services/inventoryService';
import { Category, Item } from '@/models/types';

export default function AddInventoryPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form state
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitPrice, setUnitPrice] = useState<number | undefined>(undefined);

  // Load categories and items
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('حدث خطأ أثناء تحميل التصنيفات. الرجاء المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Load items when category changes
  useEffect(() => {
    if (!selectedCategoryId) {
      setItems([]);
      return;
    }

    const fetchItems = async () => {
      try {
        const itemsData = await getItems(selectedCategoryId);
        setItems(itemsData);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('حدث خطأ أثناء تحميل الأصناف. الرجاء المحاولة مرة أخرى.');
      }
    };

    fetchItems();
  }, [selectedCategoryId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedItemId) {
      setError('الرجاء اختيار الصنف');
      return;
    }

    if (quantity <= 0) {
      setError('الرجاء إدخال كمية صحيحة');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      await updateInventoryQuantity(selectedItemId, quantity);
      
      const selectedItem = items.find(item => item.id === selectedItemId);
      
      // Update unit price if provided
      if (selectedItem && unitPrice && unitPrice > 0) {
        // Note: This is a simplified update - in a real implementation, 
        // you would add price history tracking and maintain price consistency
        await fetch(`/api/inventory/update-price`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            itemId: selectedItemId,
            unitPrice: unitPrice
          }),
        });
      }
      
      setSuccess('تمت إضافة المخزون بنجاح');
      
      // Reset form
      setSelectedItemId('');
      setQuantity(1);
      setUnitPrice(undefined);
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/inventory');
      }, 2000);
    } catch (err) {
      console.error('Error updating inventory:', err);
      setError('حدث خطأ أثناء إضافة المخزون. الرجاء المحاولة مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إضافة مخزون</h1>
        <Link href="/inventory" className="btn btn-secondary">
          العودة للمخزون
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
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

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium">التصنيف</label>
              <select
                value={selectedCategoryId}
                onChange={(e) => {
                  setSelectedCategoryId(e.target.value);
                  setSelectedItemId(''); // Reset selected item when category changes
                }}
                className="select w-full"
                disabled={loading || submitting}
                required
              >
                <option value="">اختر التصنيف</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">الصنف</label>
              <select
                value={selectedItemId}
                onChange={(e) => setSelectedItemId(e.target.value)}
                className="select w-full"
                disabled={!selectedCategoryId || loading || submitting}
                required
              >
                <option value="">اختر الصنف</option>
                {items.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.unit})
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">الكمية</label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="1"
                className="input w-full"
                disabled={submitting}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">سعر الوحدة (اختياري)</label>
              <input
                type="number"
                value={unitPrice === undefined ? '' : unitPrice}
                onChange={(e) => {
                  const value = e.target.value === '' ? undefined : Number(e.target.value);
                  setUnitPrice(value);
                }}
                min="0"
                step="0.01"
                className="input w-full"
                disabled={submitting}
                placeholder="أدخل سعر الوحدة بالريال"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting || !selectedItemId}
            >
              {submitting ? 'جاري الإضافة...' : 'إضافة للمخزون'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}