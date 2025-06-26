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

  const tabs = [
    {
      id: "inquiry",
      label: t("adInquiryCreate.tabs.inquiry"),
      href: "/inquiry/create",
    },
    {
      id: "basic-info-1",
      label: t("adInquiryCreate.tabs.basicInfo1"),
      href: "/inquiry/create/basic-info-1",
    },
    {
      id: "basic-info-2",
      label: t("adInquiryCreate.tabs.basicInfo2"),
      href: "/inquiry/create/basic-info-2",
    },
    {
      id: "contract",
      label: t("adInquiryCreate.tabs.contract"),
      href: "/inquiry/create/contract",
    },
    {
      id: "quotation",
      label: t("adInquiryCreate.tabs.quotation"),
      href: "/inquiry/create/quotation",
    },
    {
      id: "invoice",
      label: t("adInquiryCreate.tabs.invoice"),
      href: "/inquiry/create/invoice",
    },
    {
      id: "history",
      label: t("adInquiryCreate.tabs.history"),
      href: "/inquiry/create/history",
    },
  ];

  const isActive = (href: string) => {
    const currentPath = router.asPath;
    // Remove query parameters for comparison
    const pathWithoutQuery = currentPath.split('?')[0];
    
    if (href === "/inquiry/create") {
      return pathWithoutQuery === "/inquiry/create";
    }
    
    // For nested routes, check if the current path starts with the tab href
    // This will make basic-info-2 active when on /inquiry/create/basic-info-2/hk etc.
    return pathWithoutQuery.startsWith(href);
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
              isActive(tab.href) ? styles.active : ""
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
