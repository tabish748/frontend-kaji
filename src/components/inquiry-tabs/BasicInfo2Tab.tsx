import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useLanguage } from '../../localization/LocalContext';
import styles from "../../styles/components/molecules/basic-info2-tab.module.scss";

interface BasicInfo2TabProps {
  children?: React.ReactNode;
}

const getNestedTabs = (t: any) => [
  {
    id: 'hk',
    label: t('adInquiryCreate.nestedTabs.hk'),
    href: '/inquiry/create/basic-info-2/hk',
  },
  {
    id: 'bs',
    label: t('adInquiryCreate.nestedTabs.bs'),
    href: '/inquiry/create/basic-info-2/bs',
  },
  {
    id: 'hc',
    label: t('adInquiryCreate.nestedTabs.hc'),
    href: '/inquiry/create/basic-info-2/hc',
  },
  {
    id: 'introduced-talent',
    label: t('adInquiryCreate.nestedTabs.introducedTalent'),
    href: '/inquiry/create/basic-info-2/introduced-talent',
  },
  {
    id: 'hms',
    label: t('adInquiryCreate.nestedTabs.hms'),
    href: '/inquiry/create/basic-info-2/hms',
  },
];

const BasicInfo2Tab: React.FC<BasicInfo2TabProps> = ({ children }) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [activeNestedTab, setActiveNestedTab] = useState('hk');
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigatingToTab, setNavigatingToTab] = useState<string | null>(null);
  
  const nestedTabs = getNestedTabs(t);

  // Debug: Log styles to check if they're loaded
  useEffect(() => {
    console.log('BasicInfo2Tab styles loaded:', styles);
    console.log('Available nested tabs:', nestedTabs);
  }, [nestedTabs]);

  // Set active tab based on URL path
  useEffect(() => {
    const currentPath = router.asPath;
    console.log('Current path:', currentPath); // Debug log
    
    // Extract the last segment from the path, handle query parameters
    const pathWithoutQuery = currentPath.split('?')[0];
    const pathSegments = pathWithoutQuery.split('/').filter(segment => segment.length > 0);
    const lastSegment = pathSegments[pathSegments.length - 1];
    
    console.log('Last segment:', lastSegment); // Debug log
    
    // Map URL segments to tab IDs
    let tabId = lastSegment;
    if (lastSegment === 'introduced-talent') {
      tabId = 'introduced-talent';
    }
    
    // Check if the tab ID matches any of our nested tabs
    const matchingTab = nestedTabs.find(tab => tab.id === tabId);
    if (matchingTab) {
      console.log('Found matching tab:', matchingTab.id); // Debug log
      setActiveNestedTab(matchingTab.id);
    } else if (currentPath.includes('/inquiry/create/basic-info-2')) {
      // Default to 'hk' if we're on the basic-info-2 page but no specific tab
      console.log('Defaulting to hk tab'); // Debug log
      setActiveNestedTab('hk');
    }
  }, [router.asPath, router.pathname, nestedTabs]);

  const handleTabClick = async (tabId: string, href: string) => {
    console.log('Tab clicked:', tabId, href); // Debug log
    
    // Prevent multiple clicks during navigation
    if (isNavigating) return;
    
    try {
      setIsNavigating(true);
      setNavigatingToTab(tabId); // Track which tab we're navigating to
    
      // Preserve all existing query parameters when navigating
    const targetUrl = {
      pathname: href,
        query: router.query,
      };
      
      console.log('Navigating to:', targetUrl); // Debug log
      
      // Use push for better navigation experience
      await router.push(targetUrl);
      
      // Update active tab after successful navigation
      setActiveNestedTab(tabId);
      
    } catch (error) {
      console.error('Navigation error:', error);
      // Reset active tab on error
      const currentPath = router.asPath.split('?')[0];
      const currentSegment = currentPath.split('/').pop();
      const currentTab = nestedTabs.find(tab => tab.id === currentSegment);
      if (currentTab) {
        setActiveNestedTab(currentTab.id);
      }
    } finally {
      setIsNavigating(false);
      setNavigatingToTab(null); // Clear navigation target
    }
  };

  return (
    <div className="tab-content">
      <div className={styles.nestedTabsContainer || 'nested-tabs-container'}>
        {/* Nested Tab Navigation */}
        <div className={styles.nestedTabs || 'nested-tabs'}>
          {nestedTabs.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.nestedTabItem || 'nested-tab-item'} ${
                activeNestedTab === tab.id ? (styles.activeNested || 'active-nested') : ""
              }`}
              onClick={() => handleTabClick(tab.id, tab.href)}
              type="button"
              disabled={isNavigating}
              style={{
                // Add inline styles as fallback to ensure highlighting works
                color: activeNestedTab === tab.id ? '#4f46e5' : '#6b7280',
                borderBottomColor: activeNestedTab === tab.id ? '#4f46e5' : 'transparent',
                fontWeight: activeNestedTab === tab.id ? '600' : '500',
                opacity: isNavigating ? 0.6 : 1,
                cursor: isNavigating ? 'wait' : 'pointer',
              }}
            >
              <span className={styles.nestedTabLabel || 'nested-tab-label'}>
                {isNavigating && navigatingToTab === tab.id ? 'Loading...' : tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Nested Tab Content */}
        <div className={styles.nestedTabContent || 'nested-tab-content'}>
          {children || (
            <div className="nested-tab-content-inner">
              <h4>Select a tab to view content</h4>
              <p>Please select one of the tabs above to view the specific content.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfo2Tab; 