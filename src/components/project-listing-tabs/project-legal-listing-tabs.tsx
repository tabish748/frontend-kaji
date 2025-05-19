import Link from "next/link";
import styles from "../../styles/pages/settings.module.scss";
import { useLanguage } from "@/localization/LocalContext";
import { useRouter } from 'next/router';
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";

interface Props {
    activeTab: string;
}

const ProjectLegalListingTabsHeader: React.FC<Props> = ({ activeTab }) => {
    const { t } = useLanguage();
    const router = useRouter();
    const currentParams = router.query;
    
    const { loading } = useSelector((state: RootState) => state.projectLegalListing);

    const makeHref = (basePath: string, tabNumber: string) => {
        const searchParams = new URLSearchParams(currentParams as Record<string, string>);
        searchParams.set('active_tab', tabNumber);
        return `${basePath}?${searchParams.toString()}`;
    };

    const tabData = [
        { path: "/projectLegal/listing/1", tab: "listing1", label: "allEmployees" },
        { path: "/projectLegal/listing/2", tab: "listing2", label: "interviewingCaseCurrentlyOperation" },
        { path: "/projectLegal/listing/3", tab: "listing3", label: "projectChargeOfWorkInProgress" },
        { path: "/projectLegal/listing/4", tab: "listing4", label: "financeProjectInProgress" },
        { path: "/projectLegal/listing/5", tab: "listing5", label: "followUpProject" },
        { path: "/projectLegal/listing/6", tab: "listing6", label: "longTermPendingCase" },
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
                            onClick={(e) => loading && activeTab !== tab && e.preventDefault()}
                        >
                            <div 
                                className={`
                                    ${styles.tab} 
                                    ${activeTab === tab ? styles.active : ''} 
                                    ${loading && activeTab !== tab ? styles.disabled : ''}
                                `}
                                style={{ 
                                    cursor: loading && activeTab !== tab ? 'not-allowed !important' : 'pointer !important',
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

export default ProjectLegalListingTabsHeader;