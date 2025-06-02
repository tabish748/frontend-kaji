import ClientSection from "@/components/client-section/client-section";
import React, { ReactNode, useState } from "react";
import styles from "@/styles/pages/cnChangePaymentMethod.module.scss";
import { useLanguage } from "@/localization/LocalContext";

interface PaymentFormValues {
  paymentMethod: string;
}

interface Contract {
  id: number;
  name: string;
  prevPaymentValues: PaymentFormValues;
  updatedPaymentValues: PaymentFormValues;
}

export default function SubRouteLayout({ children }: { children: ReactNode }) {
  const { t } = useLanguage();
  // Contracts data including previous & updated payment methods for each contract
  const initialContracts: Contract[] = [
    {
      id: 1,
      name: "Contract 1",
      prevPaymentValues: { paymentMethod: "credit" },
      updatedPaymentValues: { paymentMethod: "credit" },
    },
    {
      id: 2,
      name: "Contract 2",
      prevPaymentValues: { paymentMethod: "bank" },
      updatedPaymentValues: { paymentMethod: "bank" },
    },
    {
      id: 3,
      name: "Contract 3",
      prevPaymentValues: { paymentMethod: "invoice" },
      updatedPaymentValues: { paymentMethod: "invoice" },
    },
  ];

  const [contracts, setContracts] = useState<Contract[]>(initialContracts);
  const [activeContractId, setActiveContractId] = useState<number>(1);

  // Get currently active contract object
  const activeContract = contracts.find(
    (contract) => contract.id === activeContractId
  )!;

  return (
    <>
      <h1 className={styles.topHeading}> {t("request")} </h1>

      <div className="d-flex flex-column gap-2">
        <ClientSection heading={t("changePaymentMethodPage.contractInfo")}>
          {/* Contract Info Section */}
          <h3 className={styles.subHeading}>
            {t("changePaymentMethodPage.layoutSubHeading")}
          </h3>
          {/* Contract Tabs */}
          <div className={styles.tabContainer}>
            {contracts.map((contract) => (
              <button
                key={contract.id}
                className={`${styles.tabButtonContract} ${
                  activeContractId === contract.id ? styles.active : ""
                }`}
                onClick={() => setActiveContractId(contract.id)}
              >
                {contract.name}
              </button>
            ))}
          </div>
        </ClientSection>
        <main>{children}</main>
      </div>
    </>
  );
}
