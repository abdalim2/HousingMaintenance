"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Icons for the navigation menu (using heroicons style)
const DashboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
  </svg>
);

const BuildingIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const HousingComplexIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
);

const ToolsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BoxIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ReportIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const navItems = [
  {
    name: 'لوحة التحكم',
    href: '/',
    icon: <DashboardIcon />,
    description: 'نظرة عامة على النظام',
  },
  {
    name: 'السكنات',
    href: '/housing',
    icon: <BuildingIcon />,
    description: 'إدارة مباني السكن',
  },
  {
    name: 'إدارة المجمعات',
    href: '/housing/management',
    icon: <HousingComplexIcon />,
    description: 'هيكلة المجمعات السكنية',
  },
  {
    name: 'طلبات الصيانة',
    href: '/maintenance',
    icon: <ToolsIcon />,
    description: 'إدارة طلبات صيانة المرافق',
  },
  {
    name: 'المخزون',
    href: '/inventory',
    icon: <BoxIcon />,
    description: 'إدارة المخزون والأصناف',
  },
  {
    name: 'طلبات الشراء',
    href: '/purchase-orders',
    icon: <CartIcon />,
    description: 'إدارة عمليات الشراء',
  },
  {
    name: 'التقارير',
    href: '/reports',
    icon: <ReportIcon />,
    description: 'تقارير وإحصائيات النظام',
  },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const pathname = usePathname();

  // Handle dark mode preference
  useEffect(() => {
    // Check for user preference in local storage
    const storedDarkMode = localStorage.getItem('darkMode') === 'true';
    // Check for system preference
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    setIsDarkMode(storedDarkMode ?? systemPrefersDark);
    
    if (storedDarkMode || (!storedDarkMode && systemPrefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Mobile Menu Button - Right side fixed */}
      <button
        type="button"
        className="lg:hidden fixed top-4 right-4 z-40 p-2 rounded-md bg-primary-600 text-white shadow-md"
        onClick={toggleMenu}
        aria-label={isOpen ? "أغلق القائمة" : "افتح القائمة"}
      >
        {isOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Dark Mode Toggle Button - Left side fixed */}
      <button
        type="button"
        className="fixed top-4 left-4 z-40 p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-md transition-colors duration-200"
        onClick={toggleDarkMode}
        aria-label={isDarkMode ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
      >
        {isDarkMode ? <SunIcon /> : <MoonIcon />}
      </button>

      {/* Sidebar Navigation */}
      <aside
        className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''} ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } shadow-nav z-30 fixed inset-y-0 right-0 transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Header/Logo Section */}
          <div className="p-4 border-b border-gray-800">
            <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
              {!isCollapsed && (
                <h1 className="text-lg font-bold">نظام إدارة المجمعات</h1>
              )}
              <button
                onClick={toggleCollapse}
                className="p-2 rounded-md hover:bg-gray-800 lg:flex hidden items-center justify-center"
                aria-label={isCollapsed ? "توسيع القائمة" : "طي القائمة"}
              >
                {isCollapsed ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-grow py-5 overflow-y-auto">
            <ul className="space-y-1.5 px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={`nav-link ${isActive ? 'nav-link-active' : ''} ${isCollapsed ? 'justify-center' : ''}`}
                      title={isCollapsed ? item.name : ''}
                    >
                      <span className={`${isCollapsed ? '' : 'ml-3'}`}>{item.icon}</span>
                      {!isCollapsed && (
                        <>
                          <span>{item.name}</span>
                          {isActive && (
                            <span className="absolute inset-y-0 right-0 w-1 bg-primary-500 rounded-tr-md rounded-br-md" aria-hidden="true"></span>
                          )}
                        </>
                      )}
                    </Link>
                    {/* Tooltip for collapsed mode */}
                    {isCollapsed && isActive && (
                      <span className="absolute inset-y-0 right-0 w-1 bg-primary-500 rounded-tr-md rounded-br-md" aria-hidden="true"></span>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Footer Section */}
          <div className={`mt-auto p-4 border-t border-gray-800 ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed && (
              <p className="text-xs text-gray-400">© {new Date().getFullYear()} نظام إدارة المجمعات السكنية</p>
            )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-20 backdrop-blur-sm"
          onClick={toggleMenu} 
          aria-hidden="true"
        />
      )}

      {/* Spacer for fixed sidebar on desktop */}
      <div className={`hidden lg:block ${isCollapsed ? 'w-16' : 'w-64'} transition-all duration-300`} />
    </>
  );
}