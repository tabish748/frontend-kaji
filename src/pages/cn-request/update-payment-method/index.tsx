import React, { useState, ChangeEvent } from "react";
import ClientSection from "@/components/client-section/client-section";
import styles from "@/styles/pages/cnChangePaymentMethod.module.scss";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { Form } from "@/components/form/form";
import RadioField from "@/components/radio-field/radio-field";
import SubRouteLayout from "../layout";

interface PaymentFormValues {
  paymentMethod: string;
}

export default function UpdatePaymentMethod() {
  const { t } = useLanguage();

  // Static previous value (as if fetched from backend)
  const prevPaymentValues: PaymentFormValues = {
    paymentMethod: "credit",
  };

  // Editable current value
  const [formValues, setFormValues] = useState<PaymentFormValues>({
    paymentMethod: "credit",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string | null>>(
    {}
  );

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
    setFormErrors({});
  };

  const handleSubmit = () => {
    if (formValues.paymentMethod === prevPaymentValues.paymentMethod) {
      alert("Please select a different payment method than the previous one.");
      setFormErrors({
        paymentMethod:
          "New payment method must be different from the previous one.",
      });
      return;
    }

    alert(`Payment method updated to: ${formValues.paymentMethod}`);
    setFormErrors({});
  };

  return (
    <ClientSection heading={t("changePaymentMethodPage.heading")}>
      <h3 className={styles.subHeading}>{t("changePaymentMethodPage.subHeading")}</h3>
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
          <div className={styles.label}>
            {t("aboutPage.paymentMethodLabel")}
          </div>
          <RadioField
            name="paymentMethodReadOnly"
            options={[
              { label: t("aboutPage.bank"), value: "bank" },
              { label: t("aboutPage.credit"), value: "credit" },
              { label: t("aboutPage.invoice"), value: "invoice" },
              { label: t("aboutPage.convenience"), value: "convenience" },
            ]}
            selectedValue={prevPaymentValues.paymentMethod}
            onChange={() => {}}
            className={styles.radioGroup}
            columnsLg={4}
            columnsMd={2}
            columnsSm={1}
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
          <div className={styles.label}>
            {t("aboutPage.paymentMethodLabel")}
          </div>
          <RadioField
            name="paymentMethod"
            options={[
              { label: t("aboutPage.bank"), value: "bank" },
              { label: t("aboutPage.credit"), value: "credit" },
              { label: t("aboutPage.invoice"), value: "invoice" },
              { label: t("aboutPage.convenience"), value: "convenience" },
            ]}
            selectedValue={formValues.paymentMethod}
            onChange={handleChange}
            className={styles.radioGroup}
            columnsLg={4}
            columnsMd={2}
            columnsSm={1}
          />
        </div>

        <div className="mt-2 d-flex justify-content-center align-items-center">
          <Button
            className="px-10"
            htmlType="submit"
            type="primary"
            text={t("Submit")}
          />
        </div>
      </Form>
    </ClientSection>
  );
}

// ⬇ Layout integration
UpdatePaymentMethod.getLayout = function getLayout(page: React.ReactElement) {
  return <SubRouteLayout>{page}</SubRouteLayout>;
};
