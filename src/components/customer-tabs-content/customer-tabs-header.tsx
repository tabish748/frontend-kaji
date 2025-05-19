import Link from "next/link";
import styles from "../../styles/pages/settings.module.scss"; // Update the path accordingly
import { useLanguage } from "@/localization/LocalContext";
import { getParamValue } from "@/libs/utils";
import { useEffect, useState } from "react";

interface Props {
  activeTab: string;
}

const CustomerTabsHeader: React.FC<Props> = ({ activeTab }) => {
  const { t } = useLanguage();
  const [id, setId] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [familyMemberId, setFamilyMemberId] = useState("");

  useEffect(() => {
    const id = getParamValue("id");
    if (id != null) setId(id);
    const fc = getParamValue("familyCode");
    if (fc != null) setFamilyCode(fc);
    const familyMemId = getParamValue("familyMemberId");
    if (familyMemId != null) setFamilyMemberId(familyMemId);
  }, []);

  const buildQueryParams = () => {
    let queryParams = `id=${id}&familyCode=${familyCode}`;
    if (familyMemberId) {
      queryParams += `&familyMemberId=${familyMemberId}`;
    }
    return queryParams;
  };

  return (
    <div className={`${styles.customerTabContainer} mt-2`}>
      <div className={styles.customerTab}>
        <div className={`d-flex ${styles.tabsWrapper}`}>
          <Link href={`/customer/update?${buildQueryParams()}`} passHref>
            <div
              className={
                activeTab === "basicInformation"
                  ? `${styles.tab} ${styles.active}`
                  : styles.tab
              }
            >
              {t("basicInformation")}
            </div>
          </Link>

          <Link href={`/customer/family?${buildQueryParams()}`} passHref>
            <div
              className={
                activeTab === "familyInformation"
                  ? `${styles.tab} ${styles.active}`
                  : styles.tab
              }
            >
              {t("familyInformation")}
            </div>
          </Link>

          <Link href={`/customer/order?${buildQueryParams()}`} passHref>
            <div
              className={
                activeTab === "orderInformation"
                  ? `${styles.tab} ${styles.active}`
                  : styles.tab
              }
            >
              {t("orderInformation")}
            </div>
          </Link>

          <Link href={`/customer/asset?${buildQueryParams()}`} passHref>
            <div
              className={
                activeTab === "assetInformation"
                  ? `${styles.tab} ${styles.active}`
                  : styles.tab
              }
            >
              {t("assetInformation")}
            </div>
          </Link>
          <Link href={`/customer/engagement?${buildQueryParams()}`} passHref>
            <div
              className={
                activeTab === "engagementInformation"
                  ? `${styles.tab} ${styles.active}`
                  : styles.tab
              }
            >
              {t("engagementInformation")}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerTabsHeader;
