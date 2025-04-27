'use client';

import { useState, useEffect } from 'react';
import { Category } from '@/models/types';
import { getCategories } from '@/lib/services/inventoryService';
import Image from 'next/image';

interface ProcessedItem {
  arabicName: string;
  englishName: string;
  category: string;
  unit: string;
  imageUrl: string;
}

export default function InventoryFileProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [processedItems, setProcessedItems] = useState<ProcessedItem[]>([]);
  const [processing, setProcessing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'edit'>('upload');
  const [editingItem, setEditingItem] = useState<ProcessedItem | null>(null);
  const [editIndex, setEditIndex] = useState<number>(-1);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        setError('Failed to load categories');
      }
    };

    loadCategories();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      
      // Read file content as text
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setFileContent(event.target.result as string);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const processFile = async () => {
    if (!fileContent) {
      setError('يرجى تحميل ملف أولاً');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const response = await fetch('/api/inventory/process-file', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: fileContent }),
      });

      if (!response.ok) {
        throw new Error('فشل في معالجة الملف');
      }

      const data = await response.json();
      setProcessedItems(data.items);
      setActiveTab('edit');
    } catch (error) {
      console.error('Error processing file:', error);
      setError('حدث خطأ أثناء معالجة الملف');
    } finally {
      setProcessing(false);
    }
  };

  const downloadProcessedItems = () => {
    if (processedItems.length === 0) {
      setError('لا توجد أصناف معالجة للتحميل');
      return;
    }

    const csvContent = [
      'الاسم العربي,الاسم الإنجليزي,التصنيف,الوحدة,رابط الصورة',
      ...processedItems.map(item => 
        `"${item.arabicName}","${item.englishName}","${item.category}","${item.unit}","${item.imageUrl}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'processed_items.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const startEditItem = (item: ProcessedItem, index: number) => {
    setEditingItem({ ...item });
    setEditIndex(index);
  };

  const saveEditedItem = () => {
    if (!editingItem || editIndex === -1) return;
    
    const updatedItems = [...processedItems];
    updatedItems[editIndex] = editingItem;
    setProcessedItems(updatedItems);
    setEditingItem(null);
    setEditIndex(-1);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditIndex(-1);
  };

  const removeItem = (index: number) => {
    const updatedItems = [...processedItems];
    updatedItems.splice(index, 1);
    setProcessedItems(updatedItems);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold mb-8 text-center dark:text-white">معالج ملفات الأصناف</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 max-w-7xl mx-auto mb-8 dark:bg-gray-800">
        <div className="flex mb-6 border-b dark:border-gray-700">
          <button
            className={`px-4 py-2 ${activeTab === 'upload' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveTab('upload')}
          >
            تحميل الملف
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}
            onClick={() => setActiveTab('edit')}
            disabled={processedItems.length === 0}
          >
            تعديل الأصناف
          </button>
        </div>

        {activeTab === 'upload' && (
          <div>
            <div className="mb-6">
              <label htmlFor="file-upload" className="block text-lg font-medium mb-2 dark:text-white">
                اختر ملف نصي يحتوي على الأصناف:
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600 focus:outline-none p-2.5"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                يجب أن يحتوي الملف على اسم صنف واحد في كل سطر
              </p>
            </div>

            {fileContent && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2 dark:text-white">محتوى الملف:</h3>
                <div className="border rounded-md p-3 bg-gray-50 max-h-40 overflow-y-auto dark:bg-gray-700 dark:border-gray-600">
                  <pre className="whitespace-pre-wrap dark:text-gray-300">{fileContent}</pre>
                </div>
              </div>
            )}

            <div className="mb-6">
              <button
                onClick={processFile}
                disabled={!fileContent || processing}
                className={`w-full py-2.5 px-5 rounded-lg text-white font-medium 
                  ${!fileContent || processing 
                    ? 'bg-blue-300 dark:bg-blue-800' 
                    : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600'}`}
              >
                {processing ? 'جاري المعالجة...' : 'معالجة الملف بالذكاء الاصطناعي'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'edit' && processedItems.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 dark:text-white">قائمة الأصناف المثالية</h2>
            
            {editingItem && (
              <div className="mb-6 p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/30 dark:border-blue-800">
                <h3 className="text-lg font-medium mb-4 dark:text-white">تعديل الصنف</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">الاسم بالعربية</label>
                    <input
                      type="text"
                      value={editingItem.arabicName}
                      onChange={(e) => setEditingItem({...editingItem, arabicName: e.target.value})}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">الاسم بالإنجليزية</label>
                    <input
                      type="text"
                      value={editingItem.englishName}
                      onChange={(e) => setEditingItem({...editingItem, englishName: e.target.value})}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">التصنيف</label>
                    <input
                      type="text"
                      value={editingItem.category}
                      onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">الوحدة</label>
                    <input
                      type="text"
                      value={editingItem.unit}
                      onChange={(e) => setEditingItem({...editingItem, unit: e.target.value})}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      dir="rtl"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 dark:text-gray-200">رابط الصورة</label>
                    <input
                      type="text"
                      value={editingItem.imageUrl}
                      onChange={(e) => setEditingItem({...editingItem, imageUrl: e.target.value})}
                      className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <div className="h-24 w-24 relative bg-gray-100 dark:bg-gray-700 rounded">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={editingItem.imageUrl} 
                        alt={editingItem.arabicName} 
                        className="object-contain h-full w-full rounded"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={saveEditedItem}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
                  >
                    حفظ التغييرات
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right text-gray-700 dark:text-gray-300">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  <tr>
                    <th className="px-4 py-3">الصورة</th>
                    <th className="px-4 py-3">الاسم العربي</th>
                    <th className="px-4 py-3">الاسم الإنجليزي</th>
                    <th className="px-4 py-3">التصنيف</th>
                    <th className="px-4 py-3">الوحدة</th>
                    <th className="px-4 py-3">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {processedItems.map((item, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                      <td className="px-4 py-3">
                        <div className="h-16 w-16 relative bg-gray-100 dark:bg-gray-700 rounded">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img 
                            src={item.imageUrl} 
                            alt={item.arabicName} 
                            className="object-contain h-full w-full rounded"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">{item.arabicName}</td>
                      <td className="px-4 py-3">{item.englishName}</td>
                      <td className="px-4 py-3">{item.category}</td>
                      <td className="px-4 py-3">{item.unit}</td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => startEditItem(item, index)}
                            className="p-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800"
                          >
                            تعديل
                          </button>
                          <button
                            onClick={() => removeItem(index)}
                            className="p-1 bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
                          >
                            حذف
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6">
              <button
                onClick={downloadProcessedItems}
                className="w-full py-2.5 px-5 rounded-lg text-white font-medium bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
              >
                تحميل قائمة الأصناف المثالية (CSV)
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-6 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}