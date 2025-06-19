import CheckboxField from "@/components/checkbox-field/checkbox-field";
import { Form } from "@/components/form/form";
import Toast from "@/components/toast/toast";
import { useLanguage } from "@/localization/LocalContext";
import React, { useState } from "react";
import termsStyles from "@/styles/pages/cnTermsAndConditions.module.scss";
import ClientLayout from "@/components/dashboard-layout/client-layout";
import styleHeader from "@/styles/pages/cnChangePaymentMethod.module.scss";
import styleNav from "@/styles/components/organisms/client-layout.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { orderAcceptance } from "@/app/features/auth/authSlice";
import { AppDispatch, RootState } from "@/app/store";

export default function CnAbout() {
  const { t } = useLanguage();
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const { isLoading } = useSelector((state: RootState) => state.loading);
  
  // Extract auth properties with fallbacks
  const message = authState?.message || null;
  const success = authState?.success || null;

  const [errors, setErrors] = React.useState<Record<string, string | null>>({});
  const [termsAccepted, setTermsAccepted] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    message: string | string[];
    type: string;
  } | null>(null);

  const handleTermsAcceptanceChange = (selectedValues: string[]) => {
    console.log('Checkbox onChange called with:', selectedValues); // Debug log
    setTermsAccepted(selectedValues);
    
    // Clear any existing error for this field
    if (errors.termsAcceptance) {
      setErrors(prev => ({
        ...prev,
        termsAcceptance: null
      }));
    }
  };

  const handleTermsSubmit = async () => {
    // Check if terms are accepted
    if (termsAccepted.length === 0) {
      setToast({
        message: t("cnTermsAndConditions.termsRequired") || "Please accept the terms and conditions",
        type: "error",
      });
      return;
    }

    // Check if ID is available
    if (!id) {
      setToast({
        message: t("cnTermsAndConditions.invalidOrder") || "Invalid order ID",
        type: "error",
      });
      return;
    }

    try {
      const result = await dispatch(orderAcceptance({ id: id as string })).unwrap();
      
      if (result.success) {
        setToast({
          message: result.message || t("cnTermsAndConditions.successMessage"),
          type: "success",
        });
        
        // Redirect to dashboard or appropriate page after successful acceptance
        setTimeout(() => {
          router.push('/'); // Adjust the redirect path as needed
        }, 2000);
      }
    } catch (error: any) {
      console.error("Terms submission error:", error);
      setToast({
        message: error.message || t("cnTermsAndConditions.errorMessage"),
        type: "error",
      });
    }
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <header className={styleNav.clientHeader}>
        <div className="d-flex">
          <Image
            className={styleNav.logo}
            src="/assets/images/client-dashboard-logo.svg"
            width={40}
            height={40}
            alt="Logo"
          />
          <Image
            className={`${styleNav.logoMobile}`}
            src="/assets/svg/logo-mobile.svg"
            width={40}
            height={40}
            alt="Logo"
          />
        </div>
      </header>
      <ClientLayout header={false} nav={false}>
        <h1 className={styleHeader.topHeading}>
          {t("cnTermsAndConditions.title")}
        </h1>

        <Form
          onSubmit={handleTermsSubmit}
          isLoading={isLoading}
          errors={errors}
          setErrors={setErrors}
          showBottomSubmitBtn={true}
          registerBtnText={t("cnTermsAndConditions.submitButton")}
          showConfirmation={false}
        >
          <div className={termsStyles.termsContainer}>
            <div className={termsStyles.termsContent}>
              <p className={termsStyles.termsText}>
                {t("cnTermsAndConditions.introText")}
              </p>

              <div className={termsStyles.sectionHeading}>
                {t("cnTermsAndConditions.section1.title")}
              </div>
              <div className={termsStyles.separatorLine} />
              <div className={termsStyles.sectionContent}>
                <p className={termsStyles.termsText}>
                  {t("cnTermsAndConditions.section1.content1")}
                </p>
                <p className={termsStyles.termsText}>
                  {t("cnTermsAndConditions.section1.content2")}
                </p>
              </div>

              <div className={termsStyles.sectionHeading}>
                {t("cnTermsAndConditions.section2.title")}
              </div>
              <div className={termsStyles.separatorLine} />
              <div className={termsStyles.sectionContent}>
                <p className={termsStyles.termsText}>
                  {t("cnTermsAndConditions.section2.content1")}
                </p>
                <p className={termsStyles.termsText}>
                  {t("cnTermsAndConditions.section2.content2")}
                </p>
              </div>

              <div className={termsStyles.sectionHeading}>
                {t("cnTermsAndConditions.section3.title")}
              </div>
              <div className={termsStyles.separatorLine} />

              <div className={termsStyles.sectionContent}>
                <p className={termsStyles.termsText}>
                  {t("cnTermsAndConditions.section3.content1")}
                </p>
                <p className={termsStyles.termsText}>
                  {t("cnTermsAndConditions.section3.content2")}
                </p>
                <p className={termsStyles.termsText}>
                  {t("cnTermsAndConditions.section3.content3")}
                </p>
              </div>
            </div>
            <div className="my-4 d-flex justify-content-center align-items-center">
              <CheckboxField
                name="termsAcceptance"
                label=""
                options={[
                  {
                    value: "accepted",
                    label: t("cnTermsAndConditions.acceptLabel"),
                  },
                ]}
                selectedValues={termsAccepted}
                onChange={handleTermsAcceptanceChange}
                validations={[{ type: "required" }]}
              />
            </div>
          </div>
        </Form>
      </ClientLayout>
    </>
  );
}
