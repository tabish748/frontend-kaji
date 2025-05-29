import ClientSection from "@/components/client-section/client-section";
import React, { useState, ChangeEvent } from "react";
import styles from "../../../styles/pages/cnRequest.module.scss";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { Form } from "@/components/form/form";
import RadioField from "@/components/radio-field/radio-field";

interface PaymentFormValues {
  paymentMethod: string;
}

export default function updatePaymentMethod() {
  const { t } = useLanguage();
  const [paymentFormErrors, setPaymentFormErrors] = React.useState<
    Record<string, string | null>
  >({});
  const [paymentFormValues, setPaymentFormValues] = useState<PaymentFormValues>({
    paymentMethod: "credit",
  });
  const handlePaymentInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPaymentFormValues((prev: PaymentFormValues) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handlePaymentSubmit = () => {
    console.log("Billing form submitted with values:", paymentFormValues);
  };
  return (
    <ClientSection heading={"PAYMENT METHOD CHANGE REQUEST"}>
      <Form
        className={styles.customerForm}
        onSubmit={handlePaymentSubmit}
        errors={paymentFormErrors}
        setErrors={setPaymentFormErrors}
      >
        <div className={`${styles.formGrid}`}>
          {/* Payment Method Section */}
          <div className={styles.label}>
            {t("aboutPage.paymentMethodLabel")}
          </div>
          <RadioField
            name="paymentMethod"
            options={[
              { label: t("aboutPage.bank"), value: "bank" },
              { label: t("aboutPage.credit"), value: "credit" },
              { label: t("aboutPage.invoice"), value: "invoice" },
              {
                label: t("aboutPage.convenience"),
                value: "convenience",
              },
            ]}
            selectedValue={paymentFormValues.paymentMethod}
            onChange={handlePaymentInputChange}
            className={styles.radioGroup}
            disabled
          />
        </div>
        {/* <div style={{ marginTop: "2rem" }}>
                      <Button
                        htmlType="submit"
                        type="primary"
                        text={t("Submit")}
                      />
                    </div> */}
      </Form>
    </ClientSection>
  );
}
