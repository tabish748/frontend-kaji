import ClientSection from "@/components/client-section/client-section";
import React from "react";
import styles from "../../styles/pages/cnRequest.module.scss";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";

const requestData = [
  {
    request: "Address Change Request",
    detail: "説明",
    action: "Request",
  },
  {
    request: "Plan Change Request",
    detail: "説明",
    action: "Request",
  },
  {
    request: "Plan Addition Request",
    detail: "説明",
    action: "Request",
  },
  {
    request: "Payment Method Change Request",
    detail: "説明",
    action: "Request",
  },
  {
    request: "Service Suspension / Reactivation Request",
    detail: "説明",
    action: "Request",
  },
];

export default function CnRequest() {
  const { t } = useLanguage();
  return (
    <ClientSection heading={t("requestPage.title")}>
      <div className={styles.gridTable}>
        <div className={styles.header}>{t("requestPage.title")}</div>
        <div className={styles.header}>{t("requestPage.detail")}</div>
        <div className={styles.header}>{t("requestPage.action")}</div>
        {requestData.map((row, idx) => (
          <div key={idx} className={styles.row}>
            <div className={styles.cell} data-label="Request">
              {row.request}
            </div>
            <div className={styles.cell} data-label="Detail">
              {row.detail}
            </div>
            <div className={styles.cell} data-label="Action">
              <Button text={row.action} type="primary" size="small" />
            </div>
          </div>
        ))}
      </div>
    </ClientSection>
  );
}
