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

export default function CnAbout() {
  const { t } = useLanguage();

  const [errors, setErrors] = React.useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState<string[]>([]);
  const [toast, setToast] = useState<{
    message: string | string[];
    type: string;
  } | null>(null);

  const handleTermsAcceptanceChange = (selectedValues: string[]) => {
    setTermsAccepted(selectedValues);
  };

  const handleTermsSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Handle terms acceptance submission logic here
      setToast({
        message: t("cnTermsAndConditions.successMessage"),
        type: "success",
      });
    } catch (error: any) {
      console.error("Terms submission error:", error);
      setToast({
        message: error.message || t("cnTermsAndConditions.errorMessage"),
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
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
          isLoading={isSubmitting}
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
                columnsLg={1}
                columnsMd={1}
                columnsSm={1}
              />
            </div>
          </div>
        </Form>
      </ClientLayout>
    </>
  );
}
