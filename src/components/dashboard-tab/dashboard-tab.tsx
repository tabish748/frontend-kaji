// TabsHeader.tsx
import Link from "next/link";
import styles from "../../styles/pages/settings.module.scss";
import { useLanguage } from "@/localization/LocalContext";

interface Props {
    activeTab: string;
}

const DashboardTabsHeader: React.FC<Props> = ({ activeTab }) => {

    const { t } = useLanguage();

    return (
        <div className={`${styles.tabContainer} mb-1 mt-2`}>
            <div className={styles.tabs}>
                <div className={`d-flex ${styles.tabsWrapper} pl-1 pr-1`}>

                    <Link href="/dashboard/inquiry" passHref>
                        <div className={activeTab === "tab1A" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("相続案件の受電推移")}
                        </div>
                    </Link>
                    <Link href="/dashboard/10" passHref>
                        <div className={activeTab === "tab10" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("紹介元毎の受電推移")}
                        </div>
                    </Link>
                    <Link href="/dashboard" passHref>
                        <div className={activeTab === "tab1" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("相続案件の面談推移")}
                        </div>
                    </Link>
                   
                    <Link href="/dashboard/2" passHref>
                        <div className={activeTab === "tab2" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("紹介元毎の面談・受注数推移")}
                        </div>
                    </Link>
                   
                    <Link href="/dashboard/3" passHref>
                        <div className={activeTab === "tab3" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("作業者別申告件数")}
                        </div>
                    </Link>

                    <Link href="/dashboard/4" passHref>
                        <div className={activeTab === "tab4" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("作業者別検算")}
                        </div>
                    </Link>

                    <Link href="/dashboard/5" passHref>
                        <div className={activeTab === "tab5" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("管理表")}
                        </div>
                    </Link>
                    <Link href="/dashboard/6" passHref>
                        <div className={activeTab === "tab6" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("グループ貢献")}
                        </div>
                    </Link>

                    <Link href="/insuranceDashboard/1?reference=taxDashboard" passHref>
                        <div className={(activeTab === "insuranceTab1"  ) ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("売上・契約件数推移")}
                        </div>
                    </Link>
                    <Link href="/insuranceDashboard/2?reference=taxDashboard" passHref>
                        <div className={activeTab === "insuranceTab2" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("設計書作成件数")}
                        </div>
                    </Link>
                    <Link href="/insuranceDashboard/3?reference=taxDashboard" passHref>
                        <div className={activeTab === "insuranceTab3" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("顛末別売上推移")}
                        </div>
                    </Link>

                 
                </div>
            </div>
        </div>
    );
};

export default DashboardTabsHeader;
