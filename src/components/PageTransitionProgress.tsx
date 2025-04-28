"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';

// تكوين NProgress
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
  minimum: 0.15,
  easing: 'ease',
  speed: 300,
});

export default function PageTransitionProgress() {
  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // تتبع التغيرات في المسار وبدء/إيقاف مؤشر التقدم
  useEffect(() => {
    // إذا كان التنقل قيد التنفيذ، أوقف NProgress عند انتهاء التنقل
    if (isNavigating) {
      setIsNavigating(false);
      NProgress.done();
    }
  }, [pathname, searchParams]);

  // تعيين مستمعي الأحداث للتنقل
  useEffect(() => {
    // يبدأ عند بدء التنقل
    const handleRouteChangeStart = () => {
      setIsNavigating(true);
      NProgress.start();
    };

    // ينتهي عند اكتمال التنقل
    const handleRouteChangeComplete = () => {
      setIsNavigating(false);
      NProgress.done();
    };

    // ينتهي عند فشل التنقل
    const handleRouteChangeError = () => {
      setIsNavigating(false);
      NProgress.done();
    };
    
    // إضافة أنماط CSS لـ NProgress
    const nprogress = `
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: var(--primary-color, #3b82f6);
        position: fixed;
        z-index: 9999;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }
      #nprogress .peg {
        display: block;
        position: absolute;
        right: 0px;
        width: 100px;
        height: 100%;
        box-shadow: 0 0 10px var(--primary-color, #3b82f6), 0 0 5px var(--primary-color, #3b82f6);
        opacity: 1.0;
        transform: rotate(3deg) translate(0px, -4px);
      }
    `;

    // إضافة الأنماط إلى الصفحة
    const style = document.createElement('style');
    style.setAttribute('id', 'nprogress-styles');
    style.textContent = nprogress;
    document.head.appendChild(style);

    // استخدام window.navigation.addEventListener لتتبع التنقل بين الصفحات إذا كان مدعوماً
    if ('navigation' in window) {
      const navigation = (window as any).navigation;
      navigation.addEventListener('navigate', handleRouteChangeStart);
      navigation.addEventListener('navigatesuccess', handleRouteChangeComplete);
      navigation.addEventListener('navigateerror', handleRouteChangeError);
    }

    // تسجيل مستمع تحميل الصفحة لمعالجة حالات أخرى
    window.addEventListener('beforeunload', handleRouteChangeStart);

    // تنظيف عند تفكيك المكون
    return () => {
      if ('navigation' in window) {
        const navigation = (window as any).navigation;
        navigation.removeEventListener('navigate', handleRouteChangeStart);
        navigation.removeEventListener('navigatesuccess', handleRouteChangeComplete);
        navigation.removeEventListener('navigateerror', handleRouteChangeError);
      }
      
      window.removeEventListener('beforeunload', handleRouteChangeStart);

      // إزالة الأنماط
      const styleElement = document.getElementById('nprogress-styles');
      if (styleElement) {
        styleElement.remove();
      }
      
      // التأكد من إيقاف NProgress
      NProgress.done();
    };
  }, []);

  // المكون لا يعرض أي شيء مرئياً - فقط يتفاعل مع NProgress
  return null;
}