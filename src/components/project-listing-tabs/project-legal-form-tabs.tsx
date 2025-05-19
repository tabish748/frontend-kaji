// TabsHeader.tsx
import Link from "next/link";
import styles from "../../styles/pages/settings.module.scss"; // Update the path accordingly
import { useLanguage } from "@/localization/LocalContext";
import { useEffect, useState } from "react";
import { getParamValue } from "@/libs/utils";
interface Props {
  activeTab: string;
}

const ProjectLegalFormTabsHeader: React.FC<Props> = ({ activeTab }) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { t } = useLanguage();
  const [id, setId] = useState('');
  useEffect(() => {
    const id = getParamValue('id');
    if(id != null)
    setId(id);
  },[])
  return (
    <div className={`${styles.tabContainer} mb-2`}>
      <div className={styles.tabs}>
        <div className={`d-flex ${styles.tabsWrapper}`}>
          <Link href={`/projectLegal/customerInformation?id=${id}`} passHref>
            <div
              className={
                activeTab === "1"
                  ? `${styles.tab} ${styles.active}`
                  : styles.tab
              }
            >
              {t("customerInfo")}
            </div>
          </Link>

          <Link href={`/projectLegal/projectDetails?id=${id}`} passHref>
            <div
              className={
                activeTab === "2"
                  ? `${styles.tab} ${styles.active}`
                  : styles.tab
              }
            >
              {t("projectDetails")}
            </div>
          </Link>

          <Link href={`/projectLegal/workInvolvementLog?id=${id}`} passHref>
            <div
              className={
                activeTab === "3"
                  ? `${styles.tab} ${styles.active}`
                  : styles.tab
              }
            >
              {t("workInvolvementLog")}
            </div>
          </Link>

          

          <Link href={`/projectLegal/finance?id=${id}`} passHref>
            <div
              className={
                activeTab === "4"
                  ? `${styles.tab} ${styles.active}`
                  : styles.tab
              }
            >
              {t("finance")}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectLegalFormTabsHeader;
