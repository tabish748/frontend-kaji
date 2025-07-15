import ClientSection from "@/components/client-section/client-section";
import React, { ReactNode, useState, useEffect, useMemo } from "react";
import styles from "@/styles/pages/cnChangePaymentMethod.module.scss";
import { useLanguage } from "@/localization/LocalContext";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Request_layout, USER_TYPE } from "@/libs/constants";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerDropdowns } from "@/app/features/dropdowns/getCustomerDropdownsSlice";
import { fetchCustomerBasicInfo } from "@/app/customer/getCustomerBasicInfoSliceAbout";
import { RootState, AppDispatch } from "@/app/store";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { customerDropdowns } = useSelector((state: RootState) => state.customerDropdowns);
  const customer = useSelector((state: RootState) => state.customerBasicInfoAbout.customer);

  // Check if current path indicates client user using Request_layout array
  const isClient = pathname ? Request_layout.includes(pathname) : false;

  useEffect(() => {
    if (!customerDropdowns) {
      dispatch(fetchCustomerDropdowns());
    }
    if (!customer) dispatch(fetchCustomerBasicInfo());
  }, [dispatch, customerDropdowns, customer]);

  const contracts = useMemo(() => customer?.customer_contracts || [], [customer?.customer_contracts]);

  // Use array indices for contract and plan selection
  const contractIdxFromUrl = searchParams?.get("contractIdx");
  const planIdxFromUrl = searchParams?.get("planIdx");
  const initialActiveContractIdx = contractIdxFromUrl ? parseInt(contractIdxFromUrl) : 0;
  const [activeContractIdx, setActiveContractIdx] = useState<number>(initialActiveContractIdx);

  const activeContract = contracts[activeContractIdx];
  const plans = useMemo(() => activeContract?.customer_contract_plans || [], [activeContract?.customer_contract_plans]);
  const initialActivePlanIdx = planIdxFromUrl ? parseInt(planIdxFromUrl) : 0;
  const [activePlanIdx, setActivePlanIdx] = useState<number>(initialActivePlanIdx);

  // Keep contract and plan indices in sync with array length
  useEffect(() => {
    if (contracts.length > 0 && (activeContractIdx < 0 || activeContractIdx >= contracts.length)) {
      setActiveContractIdx(0);
    }
  }, [contracts, activeContractIdx]);

  useEffect(() => {
    if (plans.length > 0 && (activePlanIdx < 0 || activePlanIdx >= plans.length)) {
      setActivePlanIdx(0);
    }
  }, [plans, activePlanIdx]);

  // Handle contract change - update both state and URL
  const handleContractChange = (contractIdx: number) => {
    setActiveContractIdx(contractIdx);
    setActivePlanIdx(0); // Always select first plan on contract change
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("contractIdx", contractIdx.toString());
    params.set("planIdx", "0");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // Handle plan tab click - update state and URL
  const handlePlanTabClick = (planIdx: number) => {
    setActivePlanIdx(planIdx);
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("contractIdx", activeContractIdx.toString());
    params.set("planIdx", planIdx.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <h1 className={styles.topHeading}> {t("request")} </h1>

      <div className="d-flex flex-column gap-2">
        {!isClient && contracts.length > 0 && (
          <ClientSection heading={t("changePaymentMethodPage.contractInfo")}>
            {/* Contract Info Section */}
            <h3 className={styles.subHeading}>
              {t("changePaymentMethodPage.layoutSubHeading")}
            </h3>
            {/* Contract Tabs */}
            <div className={styles.tabContainer}>
              {contracts.map((contract, idx) => (
                <button
                  key={contract.id}
                  className={`${styles.tabButtonContract} ${activeContractIdx === idx ? styles.active : ""}`}
                  onClick={() => handleContractChange(idx)}
                >
                  {`Contract ${idx + 1}`}
                </button>
              ))}
            </div>
          </ClientSection>
        )}
        <main>
          {React.cloneElement(children as React.ReactElement, {
            activeContractIdx,
            activePlanIdx,
            onPlanTabClick: handlePlanTabClick,
          })}
        </main>
      </div>
    </>
  );
}
