import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/components/molecules/inquiry-tabs.module.scss";
import { FiCrosshair } from "react-icons/fi";
import { useLanguage } from "../../localization/LocalContext";

interface InquiryTabLayoutProps {
  children: React.ReactNode;
}

const InquiryTabLayout: React.FC<InquiryTabLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { t } = useLanguage();

  // Detect if we're in edit mode
  const isEditMode = router.pathname.includes('/edit/');
  const editId = router.query.id as string;

  // Base tabs configuration
  const baseTabsConfig = [
    {
      id: "inquiry",
      label: t("adInquiryCreate.tabs.inquiry"),
      createHref: "/inquiry/create",
      editHref: `/inquiry/edit/${editId}`,
    },
    {
      id: "basic-info-1",
      label: t("adInquiryCreate.tabs.basicInfo1"),
      createHref: "/inquiry/create/basic-info-1",
      editHref: `/inquiry/edit/basic-info-1/${editId}`,
    },
    {
      id: "basic-info-2",
      label: t("adInquiryCreate.tabs.basicInfo2"),
      createHref: "/inquiry/create/basic-info-2",
      editHref: `/inquiry/edit/basic-info-2/${editId}`,
    },
    {
      id: "contract",
      label: t("adInquiryCreate.tabs.contract"),
      createHref: "/inquiry/create/contract",
      editHref: `/inquiry/edit/contract/${editId}`,
    },
    {
      id: "quotation",
      label: t("adInquiryCreate.tabs.quotation"),
      createHref: "/inquiry/create/quotation",
      editHref: `/inquiry/edit/quotation/${editId}`,
    },
    {
      id: "invoice",
      label: t("adInquiryCreate.tabs.invoice"),
      createHref: "/inquiry/create/invoice",
      editHref: `/inquiry/edit/invoice/${editId}`,
    },
    {
      id: "history",
      label: t("adInquiryCreate.tabs.history"),
      createHref: "/inquiry/create/history",
      editHref: `/inquiry/edit/history/${editId}`,
    },
  ];

  // Generate tabs with appropriate hrefs
  const tabs = baseTabsConfig.map(tab => ({
    id: tab.id,
    label: tab.label,
    href: isEditMode ? tab.editHref : tab.createHref,
  }));

  const isActive = (href: string, tabId: string) => {
    const currentPath = router.asPath;
    // Remove query parameters for comparison
    const pathWithoutQuery = currentPath.split('?')[0];
    
    if (isEditMode) {
      // For edit mode, check if current path contains the tab identifier
      if (tabId === "inquiry" && pathWithoutQuery.includes('/edit/') && !pathWithoutQuery.includes('/basic-info-') && !pathWithoutQuery.includes('/contract') && !pathWithoutQuery.includes('/quotation') && !pathWithoutQuery.includes('/invoice') && !pathWithoutQuery.includes('/history')) {
        return true;
      }
      return pathWithoutQuery.includes(`/edit/${tabId}/`) || pathWithoutQuery.includes(`/edit/${tabId}/${editId}`);
    } else {
      // Original create mode logic
      if (href === "/inquiry/create") {
        return pathWithoutQuery === "/inquiry/create";
      }
      return pathWithoutQuery.startsWith(href);
    }
  };

  return (
    <div className={styles.inquiryCreateContainer}>
      <div className={`d-flex justify-content-start align-items-center ${styles.header}`}>
        <FiCrosshair className={styles.addNewTitleIcon} />
        <h1 className={styles.addNewTitle}>{t("adInquiryCreate.addNew")}</h1>
      </div>
      <div className={styles.inquiryTabs}>
        {tabs.map((tab) => (
          <Link
            key={tab.id}
            href={{
              pathname: tab.href,
              query: router.query.lang ? { lang: router.query.lang } : {}, // Only preserve lang parameter
            }}
            className={`${styles.tabItem} ${
              isActive(tab.href, tab.id) ? styles.active : ""
            }`}
          >
            <span className={styles.tabLabel}>{tab.label}</span>
          </Link>
        ))}
      </div>

      <div className={styles.tabContent}>{children}</div>
    </div>
  );
};

export default InquiryTabLayout;
