import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface InquiryTabLayoutProps {
  children: React.ReactNode;
}

const InquiryTabLayout: React.FC<InquiryTabLayoutProps> = ({ children }) => {
  const router = useRouter();

  const tabs = [
    {
      id: 'inquiry',
      label: 'INQUIRY',
      href: '/inquiry/create'
    },
    {
      id: 'basic-info-1',
      label: 'BASIC INFORMATION 1',
      href: '/inquiry/create/basic-info-1'
    },
    {
      id: 'basic-info-2',
      label: 'BASIC INFORMATION 2',
      href: '/inquiry/create/basic-info-2'
    },
    {
      id: 'contract',
      label: 'CONTRACT',
      href: '/inquiry/create/contract'
    },
    {
      id: 'quotation',
      label: 'QUOTATION',
      href: '/inquiry/create/quotation'
    },
    {
      id: 'invoice',
      label: 'INVOICE',
      href: '/inquiry/create/invoice'
    },
    {
      id: 'history',
      label: 'HISTORY',
      href: '/inquiry/create/history'
    }
  ];

  const isActive = (href: string) => {
    if (href === '/inquiry/create') {
      return router.pathname === '/inquiry/create';
    }
    return router.pathname === href;
  };

  return (
    <div className="inquiry-create-container">
      <div className="inquiry-tabs">
        {tabs.map((tab) => (
          <Link 
            key={tab.id} 
            href={tab.href}
            className={`tab-item ${isActive(tab.href) ? 'active' : ''}`}
          >
            <span className="tab-label">{tab.label}</span>
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
};

export default InquiryTabLayout; 