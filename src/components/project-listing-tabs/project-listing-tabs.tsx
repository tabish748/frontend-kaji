import Link from "next/link";
import styles from "../../styles/pages/settings.module.scss";
import { useLanguage } from "@/localization/LocalContext";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { useEffect, useState } from "react";

interface Props {
    activeTab: string;
    // loading: boolean;
}

const ProjectListingTabsHeader: React.FC<Props> = ({ activeTab }) => {
    const { t } = useLanguage();
    const router = useRouter();
    const currentParams = router.query;
        

    
    const { loading } = useSelector((state: RootState) => state.projectConfirmedList);

    const makeHref = (basePath: string, tabNumber: string) => {
        const searchParams = new URLSearchParams(currentParams as Record<string, string>);
        searchParams.set('active_tab', tabNumber);
        return `${basePath}?${searchParams.toString()}`;
    };

    const tabData = [
        { path: "/projectConfirmed", tab: "listing1", label: "allEmployees" },
        { path: "/projectConfirmed/listing2", tab: "listing2", label: "workProjectInProgress" },
        { path: "/projectConfirmed/listing3", tab: "listing3", label: "unDividedProject" },
        { path: "/projectConfirmed/listing4", tab: "listing4", label: "interviewProjectIncharge" },
        { path: "/projectConfirmed/listing5", tab: "listing5", label: "itemsWaitingForPayment" },
        { path: "/projectConfirmed/listing6", tab: "listing6", label: "semiFinalTaxReturnProject" },
    ];

    return (
        <div className={`${styles.tabContainer} mb-2`}>
            <div className={styles.tabs}>
                <div className={`d-flex ${styles.tabsWrapper}`}>
                    {tabData.map(({ path, tab, label }) => (
                        <Link
                            key={tab}
                            href={loading && activeTab !== tab ? '#' : makeHref(path, tab.slice(-1))}
                            passHref
                            onClick={(e) => {
                                    loading && activeTab !== tab && e.preventDefault();
                            }}
                        >
                            <div 
                                className={`
                                    ${styles.tab} 
                                    ${activeTab === tab ? styles.active : ''} 
                                    ${loading && activeTab !== tab ? styles.disabled : ''}
                                `}
                                style={{ 
                                    cursor: loading && activeTab !== tab ? 'default' : 'pointer',
                                    pointerEvents: loading && activeTab !== tab ? 'none' : 'auto'
                                }}
                            >
                                {t(label)}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProjectListingTabsHeader;