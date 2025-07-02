import React, { useEffect, useState, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { fetchDropdowns } from "@/app/features/dropdowns/getDropdownsSlice";
import ClientSection from "@/components/client-section/client-section";
import styles from "@/styles/pages/cnChangePaymentMethod.module.scss";
import aboutStyles from "@/styles/pages/cnabout.module.scss";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { Form } from "@/components/form/form";
import RadioField from "@/components/radio-field/radio-field";
import ApiLoadingWrapper from "@/components/api-loading-wrapper/api-loading-wrapper";
import SubRouteLayout from "../layout";
import { changePaymentMethod, resetChangePaymentMethod } from '@/app/customer/changePaymentMethodSlice';

interface UpdatePaymentMethodProps {
  activeContractIdx: number;
  activePlanIdx: number;
  onPlanTabClick: (planIdx: number) => void;
}

export default function UpdatePaymentMethod({ activeContractIdx, activePlanIdx, onPlanTabClick }: UpdatePaymentMethodProps) {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { dropdowns, loading: dropdownsLoading, error: dropdownsError } = useSelector((state: RootState) => state.dropdowns);
  const customer = useSelector((state: RootState) => state.customerBasicInfo.customer);
  const changePayMethodState = useSelector((state: RootState) => state.changePaymentMethod);

  // Fetch dropdowns on mount
  useEffect(() => {
    if (!dropdowns) {
      dispatch(fetchDropdowns());
    }
  }, [dispatch, dropdowns]);

  // Get active contract and plans by index
  const contracts = customer?.customer_contracts || [];
  const activeContract = contracts[activeContractIdx];
  const plans = activeContract?.customer_contract_plans || [];
  const [selectedPlanIdx, setSelectedPlanIdx] = useState(activePlanIdx);
  const activePlan = plans[selectedPlanIdx];

  // Keep local selectedPlanIdx in sync with prop
  useEffect(() => {
    setSelectedPlanIdx(activePlanIdx);
  }, [activePlanIdx]);

  // Form state
  const [formValues, setFormValues] = useState({
    paymentMethod: activePlan?.payment_method?.toString() || "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});

  // Update form when plan changes
  useEffect(() => {
    if (activePlan) {
      setFormValues({ paymentMethod: activePlan.payment_method?.toString() || "" });
    }
  }, [activePlan]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({});
  };

  const handleSubmit = async () => {
    if (formValues.paymentMethod === (activePlan?.payment_method?.toString() || "")) {
      alert("Please select a different payment method than the previous one.");
      setFormErrors({
        paymentMethod: "New payment method must be different from the previous one.",
      });
      return;
    }
    if (!activeContract || !activePlan) return;
    dispatch(changePaymentMethod({
      customer_contract_id: activeContract.id,
      customer_contract_plan_id: activePlan.id,
      payment_method: Number(formValues.paymentMethod),
    }));
    setFormErrors({});
  };

  return (
    <ApiLoadingWrapper
      loading={dropdownsLoading}
      error={dropdownsError}
      onRetry={() => dispatch(fetchDropdowns())}
      errorTitle="Error loading payment data"
    >
      <ClientSection heading={t("changePaymentMethodPage.heading")}> 
        <h3 className={styles.subHeading}>{t("changePaymentMethodPage.subHeading")}</h3>
        {/* Show loading, error, or success from changePaymentMethod slice */}
        {changePayMethodState.loading && <div className="alert alert-info">{t('Loading...')}</div>}
        {changePayMethodState.error && <div className="alert alert-danger">{changePayMethodState.error}</div>}
        {changePayMethodState.success && <div className="alert alert-success">{changePayMethodState.message || t('Payment method updated successfully.')}</div>}
        {/* Plan Tabs */}
        {plans.length > 0 && (
          <div className={`${aboutStyles.tabContainer} mb-2`}>
            {plans.map((plan, idx) => (
              <button
                key={plan.id}
                className={`${aboutStyles.tabButtonPlan} ${selectedPlanIdx === idx ? aboutStyles.active : ""}`}
                onClick={() => {
                  setSelectedPlanIdx(idx);
                  onPlanTabClick(idx);
                }}
              >
                {`Plan ${idx + 1}`}
              </button>
            ))}
          </div>
        )}
        {/* Previous Info */}
        <h1 className="cn-seperator-heading primary">{t("changePaymentMethodPage.prev")}</h1>
        <Form className={styles.customerForm} onSubmit={() => {}} errors={{}} setErrors={() => {}}>
          <div className={styles.formGrid}>
            <div className={styles.label}>{t("aboutPage.paymentMethodLabel")}</div>
            <RadioField
              name="paymentMethodReadOnly"
              options={dropdowns?.payment_method?.map(option => ({
                label: option.label,
                value: option.value.toString(),
              })) || []}
              selectedValue={activePlan?.payment_method?.toString() || ""}
              onChange={() => {}}
              className={styles.radioGroup}
              disabled
            />
          </div>
        </Form>
        {/* Updated Info */}
        <h1 className="cn-seperator-heading danger mt-3">{t("changePaymentMethodPage.update")}</h1>
        <Form
          className={styles.customerForm}
          onSubmit={handleSubmit}
          errors={formErrors}
          setErrors={setFormErrors}
        >
          <div className={styles.formGrid}>
            <div className={styles.label}>{t("aboutPage.paymentMethodLabel")}</div>
            <RadioField
              name="paymentMethod"
              options={dropdowns?.payment_method?.map(option => ({
                label: option.label,
                value: option.value.toString(),
              })) || []}
              selectedValue={formValues.paymentMethod}
              onChange={handleChange}
              className={styles.radioGroup}
            />
          </div>
          <div className="mt-2 d-flex justify-content-center align-items-center">
            <Button className="px-10" htmlType="submit" type="primary" text={t("Submit")} />
          </div>
        </Form>
      </ClientSection>
    </ApiLoadingWrapper>
  );
}

// ⬇ Layout integration
UpdatePaymentMethod.getLayout = function getLayout(page: React.ReactElement) {
  return <SubRouteLayout>{page}</SubRouteLayout>;
};
