// TabsHeader.tsx
import Link from "next/link";
import styles from "../../styles/pages/settings.module.scss"; // Update the path accordingly
import { useLanguage } from "@/localization/LocalContext";
interface Props {
    activeTab: string;
}

const SettingTabsHeader: React.FC<Props> = ({ activeTab }) => {
    const { t } = useLanguage();

    return (
        <div className={`${styles.tabContainer} mb-2`}>
            <div className={styles.tabs}>
                <div className={`d-flex ${styles.tabsWrapper}`}>
                    <Link href="/settings" passHref>
                        <div className={activeTab === "base" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("baseSettings")}
                        </div>
                    </Link>

                    <Link href="/settings/office" passHref>
                        <div className={activeTab === "office" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("officeSettings")}
                        </div>
                    </Link>

                    <Link href="/settings/team" passHref>
                        <div className={activeTab === "team" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("teamSettings")}
                        </div>
                    </Link>

                    <Link href="/settings/interview" passHref>
                        <div className={activeTab === "interview" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("interviewSettings")}
                        </div>
                    </Link>

                    <Link href="/settings/introduceBy" passHref>
                        <div className={activeTab === "introduceBy" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("introduceBySettings")}
                        </div>
                    </Link>

                    <Link href="/settings/insuranceTarget" passHref>
                        <div className={activeTab === "insuranceTarget" ? `${styles.tab} ${styles.active}` : styles.tab}>
                            {t("目標設定")}
                        </div>
                    </Link>


                </div>
            </div>
        </div>
    );
};

export default SettingTabsHeader;
