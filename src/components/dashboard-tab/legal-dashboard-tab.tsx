// TabsHeader.tsx
import Link from "next/link";
import styles from "../../styles/pages/settings.module.scss";
import { useLanguage } from "@/localization/LocalContext";

interface Props {
    activeTab: string;
}

const LegalDashboardTabsHeader: React.FC<Props> = ({ activeTab }) => {

    const { t } = useLanguage();

    return (
        <div className={`${styles.tabContainer} mb-1 mt-2`}>
            <div className={styles.tabs}>
                <div className={`d-flex ${styles.tabsWrapper} pl-1 pr-1`}>

                    <Link href="/legalDashboard/1a" passHref>
                        <div className={activeTab === "tab1A" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("相続案件の受電推移")}
                        </div>
                    </Link>
                    <Link href="/legalDashboard/1" passHref>
                        <div className={activeTab === "tab1" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("相続案件の面談推移")}
                        </div>
                    </Link>
                    <Link href="/legalDashboard/2" passHref>
                        <div className={activeTab === "tab2" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("作業者別 請求・見込み案件")}
                        </div>
                    </Link>
                    <Link href="/legalDashboard/3" passHref>
                        <div className={activeTab === "tab3" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("売上集計表")}
                        </div>
                    </Link>
                    <Link href="/legalDashboard/4" passHref>
                        <div className={activeTab === "tab4" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("受注集計表")}
                        </div>
                    </Link>
                    <Link href="/legalDashboard/5" passHref>
                        <div className={activeTab === "tab5" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("遺言執行報酬")}
                        </div>
                    </Link>
                    <Link href="/legalDashboard/6" passHref>
                        <div className={activeTab === "tab6" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("紹介元毎の面談・受注数推移")}
                        </div>
                    </Link>

                    <Link href="/legalDashboard/7" passHref>
                        <div className={activeTab === "tab7" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("受注金額（担当者別）")} 
                        </div>
                    </Link> 
                    <Link href="/legalDashboard/8" passHref>
                        <div className={activeTab === "tab8" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("グループ貢献")}
                        </div>
                    </Link>


                    <Link href="/legalDashboard/9" passHref>
                        <div className={(activeTab === "tab9"  ) ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("売上・契約件数推移")}
                        </div>
                    </Link>
                    <Link href="/legalDashboard/10" passHref>
                        <div className={activeTab === "tab10" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("設計書作成件数")}
                        </div>
                    </Link>
                    <Link href="/legalDashboard/11" passHref>
                        <div className={activeTab === "tab11" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("顛末別売上推移")}
                        </div>
                    </Link>
                    {/* 
                    */}
                </div>
            </div>
        </div>
    );
};

export default LegalDashboardTabsHeader;
