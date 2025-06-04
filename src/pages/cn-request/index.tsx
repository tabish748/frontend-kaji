import ClientSection from "@/components/client-section/client-section";
import React from "react";
import styles from "../../styles/pages/cnRequest.module.scss";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import Link from "next/link";

const requestData = [
  {
    requestKey: "addressChange",
    route: "/cn-request/update-address",
  },
  {
    requestKey: "planChange",
    route: "/cn-request/update-plan",
  },
  {
    requestKey: "planAddition",
    route: "/cn-request/add-plan",
  },
  {
    requestKey: "paymentMethodChange",
    route: "/cn-request/update-payment-method",
  },
  {
    requestKey: "serviceStatus",
    route: "/cn-request/reactivate-request",
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
              {t(`requestPage.types.${row.requestKey}`)}
            </div>
            <div className={styles.cell} data-label="Detail">
              {t("requestPage.detail")}
            </div>
            <div className={styles.cell} data-label="Action">
              <Link href={row.route}>
                <Button text={t("requestPage.action")} type="primary" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </ClientSection>
  );
}
