"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { generateMonthlyPurchaseOrder } from '@/lib/services/purchaseService';

export default function MonthlyPurchaseOrderPage() {
  const router = useRouter();
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [createdBy, setCreatedBy] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Years range (current year and 2 years back)
  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear - 1, currentYear - 2];

  // Month names in Arabic
  const months = [
    { value: 1, label: 'يناير' },
    { value: 2, label: 'فبراير' },
    { value: 3, label: 'مارس' },
    { value: 4, label: 'أبريل' },
    { value: 5, label: 'مايو' },
    { value: 6, label: 'يونيو' },
    { value: 7, label: 'يوليو' },
    { value: 8, label: 'أغسطس' },
    { value: 9, label: 'سبتمبر' },
    { value: 10, label: 'أكتوبر' },
    { value: 11, label: 'نوفمبر' },
    { value: 12, label: 'ديسمبر' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!createdBy.trim()) {
      setError("الرجاء إدخال اسم منشئ الطلب");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const purchaseOrder = await generateMonthlyPurchaseOrder(year, month, createdBy);
      
      // Redirect to the newly created purchase order
      router.push(`/purchase-orders/${purchaseOrder.id}`);
    } catch (err: any) {
      console.error('Error generating monthly purchase order:', err);
      setError(err.message || 'حدث خطأ أثناء إنشاء طلب الشراء الشهري');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إنشاء طلب شراء شهري</h1>
        <Link href="/purchase-orders" className="btn btn-secondary">
          العودة لقائمة طلبات الشراء
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="mb-6 text-gray-600">
          سيقوم النظام بإنشاء طلب شراء يتضمن جميع المواد المطلوبة لطلبات الصيانة المسجلة خلال الشهر المحدد.
        </p>

        {error && (
          <div className="bg-red-100 border-r-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 text-sm font-medium">السنة</label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="select w-full"
                disabled={loading}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">الشهر</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="select w-full"
                disabled={loading}
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">منشئ الطلب</label>
            <input
              type="text"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              className="input w-full"
              placeholder="أدخل اسمك هنا"
              disabled={loading}
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'جاري الإنشاء...' : 'إنشاء طلب الشراء الشهري'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}