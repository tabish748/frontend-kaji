// TabsHeader.tsx
import Link from "next/link";
import styles from "../../styles/pages/settings.module.scss";
import { useLanguage } from "@/localization/LocalContext";

interface Props {
    activeTab: string;
}

const InsuranceDashboardTabsHeader: React.FC<Props> = ({ activeTab }) => {

    const { t } = useLanguage();

    return (
        <div className={`${styles.tabContainer} mb-1 mt-2`}>
            <div className={styles.tabs}>
                <div className={`d-flex ${styles.tabsWrapper} pl-1 pr-1`}>


                    <Link href="/insuranceDashboard/1" passHref>
                        <div className={activeTab === "insuranceTab1" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("売上・契約件数推移")}
                        </div>
                    </Link>
                    <Link href="/insuranceDashboard/2" passHref>
                        <div className={activeTab === "insuranceTab2" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("設計書作成件数")}
                        </div>
                    </Link>
                    <Link href="/insuranceDashboard/3" passHref>
                        <div className={activeTab === "insuranceTab3" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("顛末別売上推移")}
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default InsuranceDashboardTabsHeader;
