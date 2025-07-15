import React, { useState, ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/app/store";
import { reactivateRequest, resetReactivateRequest } from "@/app/customer/reactivateRequestSlice";
import ClientSection from "@/components/client-section/client-section";
import styles from "@/styles/pages/cnChangePaymentMethod.module.scss";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { Form } from "@/components/form/form";
import RadioField from "@/components/radio-field/radio-field";
import Toast from "@/components/toast/toast";
import SubRouteLayout from "../layout";

interface ReactivateFormValues {
  contractStatus: string;
}

interface ReactivateRequestProps {
  activeContractIdx: number;
  activePlanIdx: number;
  onPlanTabClick: (planIdx: number) => void;
}

export default function ReactivateRequest({ activeContractIdx, activePlanIdx, onPlanTabClick }: ReactivateRequestProps) {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const customer = useSelector((state: RootState) => state.customerBasicInfoAbout.customer);
  const reactivateState = useSelector((state: RootState) => state.reactivateRequest);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  // Get active contract by index
  const contracts = customer?.customer_contracts || [];
  const activeContract = contracts[activeContractIdx];

  // Contract status options
  const statusOptions = [
    { label: t("reactivateRequestPage.active"), value: "1" },
    { label: t("reactivateRequestPage.suspended"), value: "2" },
  ];

  // Previous contract status from current contract data
  const prevContractStatus = activeContract?.status?.toString() || "1";

  // Editable form values
  const [formValues, setFormValues] = useState<ReactivateFormValues>({
    contractStatus: "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});

  // Reset state on mount and cleanup
  useEffect(() => {
    // Reset the reactivate request state when component mounts
    dispatch(resetReactivateRequest());
  }, [dispatch]);

  // Cleanup effect to reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetReactivateRequest());
    };
  }, [dispatch]);

  // Handle success/error states from reactivateRequest
  useEffect(() => {
    if (reactivateState.success === true) {
      setToastMessage(reactivateState.message || t('Contract status updated successfully.'));
      setToastType("success");
      setShowToast(true);
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        const langParam = router.query.lang ? `?lang=${router.query.lang}` : '';
        router.replace(`/cn-request${langParam}`);
      }, 2000);
    } else if (reactivateState.success === false && reactivateState.error) {
      setToastMessage(reactivateState.error);
      setToastType("error");
      setShowToast(true);
    }
  }, [reactivateState.success, reactivateState.error, reactivateState.message, router, t]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    setFormErrors((prev) => ({ ...prev, [name]: null }));
    // Reset toast and state when user makes changes
    setShowToast(false);
    if (reactivateState.success !== null || reactivateState.error) {
      dispatch(resetReactivateRequest());
    }
  };

  const handleSubmit = () => {
    if (!activeContract) {
      setToastMessage("Contract data is missing.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Validate required fields
    const errors: Record<string, string> = {};
    
    if (!formValues.contractStatus) {
      errors.contractStatus = "Contract status is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setToastMessage("Please fix the validation errors.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Check if the new status is different from current status
    if (formValues.contractStatus === prevContractStatus) {
      setFormErrors({
        contractStatus: "New contract status must be different from the current one.",
      });
      setToastMessage("Please select a different contract status than the current one.");
      setToastType("error");
      setShowToast(true);
      return;
    }

    // Submit the reactivate request
    dispatch(reactivateRequest({
      customer_contract_id: activeContract.id,
      contract_status: Number(formValues.contractStatus),
    }));
    setFormErrors({});
  };

  const handleToastClose = () => {
    setShowToast(false);
    if (reactivateState.success !== null || reactivateState.error) {
      dispatch(resetReactivateRequest());
    }
  };



  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={handleToastClose}
          duration={5000}
        />
      )}

    <ClientSection heading={t("reactivateRequestPage.heading")}>
      <h3 className={styles.subHeading}>
        {t("reactivateRequestPage.subHeading")}
      </h3>

        {/* Show success message */}
        {reactivateState.success && (
          <div className="alert alert-success mb-3">
            <p>{reactivateState.message || t('Contract status updated successfully.')}</p>
            <p className="mb-0">{t('Redirecting back to requests...')}</p>
          </div>
        )}

        {/* Show loading, error from reactivateRequest slice */}
        {reactivateState.loading && <div className="alert alert-info">{t('Loading...')}</div>}
        {reactivateState.error && <div className="alert alert-danger">{reactivateState.error}</div>}

        {/* Only show form if not successful */}
        {!reactivateState.success && (
          <>
      {/* Previous Info */}
      <h1 className="cn-seperator-heading primary">
        {t("changePaymentMethodPage.prev")}
      </h1>
      <Form
        className={styles.customerForm}
        onSubmit={() => {}}
        errors={{}}
        setErrors={() => {}}
      >
        <div className={styles.formGrid}>
          <div className={styles.label}>{t("reactivateRequestPage.label")}</div>
          <RadioField
                  name="prev_contractStatus"
                  options={statusOptions}
                  selectedValue={prevContractStatus}
            onChange={() => {}}
            className={styles.radioGroup}
            disabled
          />
        </div>
      </Form>

      {/* Updated Info */}
      <h1 className="cn-seperator-heading danger mt-3">
        {t("changePaymentMethodPage.update")}
      </h1>
      <Form
        className={styles.customerForm}
        onSubmit={handleSubmit}
        errors={formErrors}
        setErrors={setFormErrors}
      >
        <div className={styles.formGrid}>
          <div className={styles.label}>{t("reactivateRequestPage.label")}</div>
          <RadioField
                  name="contractStatus"
                  options={statusOptions}
                  selectedValue={formValues.contractStatus}
            onChange={handleChange}
            className={styles.radioGroup}
                  disabled={reactivateState.loading}
                  validations={[{ type: "required" }]}
                  errorText={formErrors["contractStatus"] || undefined}
          />
        </div>

        <div className="mt-2 d-flex justify-content-center align-items-center">
          <Button
            className="px-10"
            htmlType="submit"
            type="primary"
                  text={reactivateState.loading ? t("Loading...") : t("Submit")}
                  disabled={reactivateState.loading}
          />
        </div>
      </Form>
          </>
        )}
    </ClientSection>
    </>
  );
}

// ⬇ Layout integration
ReactivateRequest.getLayout = function getLayout(page: React.ReactElement) {
  return <SubRouteLayout>{page}</SubRouteLayout>;
};
