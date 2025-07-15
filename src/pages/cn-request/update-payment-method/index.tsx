import React, { useEffect, useState, ChangeEvent } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/app/store";
import { fetchCustomerDropdowns } from "@/app/features/dropdowns/getCustomerDropdownsSlice";
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
import Toast from "@/components/toast/toast";

interface UpdatePaymentMethodProps {
  activeContractIdx: number;
  activePlanIdx: number;
  onPlanTabClick: (planIdx: number) => void;
}

export default function UpdatePaymentMethod({ activeContractIdx, activePlanIdx, onPlanTabClick }: UpdatePaymentMethodProps) {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { customerDropdowns, loading: dropdownsLoading, error: dropdownsError } = useSelector((state: RootState) => state.customerDropdowns);
  const customer = useSelector((state: RootState) => state.customerBasicInfoAbout.customer);
  const changePayMethodState = useSelector((state: RootState) => state.changePaymentMethod);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  // Fetch dropdowns on mount and reset state
  useEffect(() => {
    if (!customerDropdowns) {
      dispatch(fetchCustomerDropdowns());
    }
    // Reset the change payment method state when component mounts
    dispatch(resetChangePaymentMethod());
  }, [dispatch, customerDropdowns]);

  // Cleanup effect to reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetChangePaymentMethod());
    };
  }, [dispatch]);

  // Handle success/error states from changePaymentMethod
  useEffect(() => {
    if (changePayMethodState.success === true) {
      setToastMessage(changePayMethodState.message || t('Payment method updated successfully.'));
      setToastType("success");
      setShowToast(true);
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        const langParam = router.query.lang ? `?lang=${router.query.lang}` : '';
        router.replace(`/cn-request${langParam}`);
      }, 2000);
    } else if (changePayMethodState.success === false && changePayMethodState.error) {
      setToastMessage(changePayMethodState.error);
      setToastType("error");
      setShowToast(true);
    }
  }, [changePayMethodState.success, changePayMethodState.error, changePayMethodState.message, router, t]);

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
    // Reset toast and change payment method state when user makes changes
    setShowToast(false);
    if (changePayMethodState.success !== null || changePayMethodState.error) {
      dispatch(resetChangePaymentMethod());
    }
  };

  const handleSubmit = async () => {
    if (formValues.paymentMethod === (activePlan?.payment_method?.toString() || "")) {
      setFormErrors({
        paymentMethod: "New payment method must be different from the previous one.",
      });
      setToastMessage("Please select a different payment method than the previous one.");
      setToastType("error");
      setShowToast(true);
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

  const handleToastClose = () => {
    setShowToast(false);
    if (changePayMethodState.success !== null || changePayMethodState.error) {
      dispatch(resetChangePaymentMethod());
    }
  };



  return (
    <ApiLoadingWrapper
      loading={dropdownsLoading}
      error={dropdownsError}
      onRetry={() => dispatch(fetchCustomerDropdowns())}
      errorTitle="Error loading payment data"
    >
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={handleToastClose}
          duration={5000}
        />
      )}
      
    <ClientSection heading={t("changePaymentMethodPage.heading")}>
      <h3 className={styles.subHeading}>{t("changePaymentMethodPage.subHeading")}</h3>
        
        {/* Show success message */}
        {changePayMethodState.success && (
          <div className="alert alert-success mb-3">
            <p>{changePayMethodState.message || t('Payment method updated successfully.')}</p>
            <p className="mb-0">{t('Redirecting back to requests...')}</p>
          </div>
        )}
        
        {/* Show loading, error from changePaymentMethod slice */}
        {changePayMethodState.loading && <div className="alert alert-info">{t('Loading...')}</div>}
        {changePayMethodState.error && <div className="alert alert-danger">{changePayMethodState.error}</div>}
        
        {/* Only show form if not successful */}
        {!changePayMethodState.success && (
          <>
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
                  options={customerDropdowns?.payment_method?.map(option => ({
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
                  options={customerDropdowns?.payment_method?.map(option => ({
                    label: option.label,
                    value: option.value.toString(),
                  })) || []}
            selectedValue={formValues.paymentMethod}
            onChange={handleChange}
            className={styles.radioGroup}
                  disabled={changePayMethodState.loading}
          />
        </div>
        <div className="mt-2 d-flex justify-content-center align-items-center">
          <Button
            className="px-10"
            htmlType="submit"
            type="primary"
                  text={changePayMethodState.loading ? t("Loading...") : t("Submit")}
                  disabled={changePayMethodState.loading}
          />
        </div>
      </Form>
          </>
        )}
    </ClientSection>
    </ApiLoadingWrapper>
  );
}

// ⬇ Layout integration
UpdatePaymentMethod.getLayout = function getLayout(page: React.ReactElement) {
  return <SubRouteLayout>{page}</SubRouteLayout>;
};
