import ClientSection from "@/components/client-section/client-section";
import React, { ReactNode, useState } from "react";
import styles from "@/styles/pages/cnChangePaymentMethod.module.scss";
import { useLanguage } from "@/localization/LocalContext";
import { useRouter, useSearchParams } from "next/navigation";
import { USER_TYPE } from "@/libs/constants";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const userRole = JSON.parse(localStorage.getItem("loggedInUser")!).userRole;
  const isClient = userRole === USER_TYPE.customer;

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

  // Get initial active contract from URL params, default to 1 if not present
  const contractIdFromUrl = searchParams?.get("contractid");
  const initialActiveContractId = contractIdFromUrl
    ? parseInt(contractIdFromUrl)
    : 1;
  const [activeContractId, setActiveContractId] = useState<number>(
    initialActiveContractId
  );

  // Handle contract change - update both state and URL
  const handleContractChange = (contractId: number) => {
    setActiveContractId(contractId);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("contractid", contractId.toString());
    router.push(`?${params.toString()}`);
  };

  // Get currently active contract object
  const activeContract = contracts.find(
    (contract) => contract.id === activeContractId
  )!;

  return (
    <>
      <h1 className={styles.topHeading}> {t("request")} </h1>

      <div className="d-flex flex-column gap-2">
        {isClient && (
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
                  onClick={() => handleContractChange(contract.id)}
                >
                  {contract.name}
                </button>
              ))}
            </div>
          </ClientSection>
        )}
        <main>{children}</main>
      </div>
    </>
  );
}
