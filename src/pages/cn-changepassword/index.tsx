import React, { useState, ChangeEvent } from "react";
import ClientSection from "@/components/client-section/client-section";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import { useLanguage } from "@/localization/LocalContext";
import { FaLock } from "react-icons/fa";
import styles from "@/styles/pages/cnChangepassword.module.scss";
import Button from "@/components/button/button";

export default function CnChangePassword() {
  const { t } = useLanguage();
  const [formValues, setFormValues] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    // Add validation and API call here
    // Example validation
    const newErrors: Record<string, string> = {};
    if (!formValues.currentPassword) newErrors.currentPassword = t("changePasswordPage.currentRequired") || "Current password is required";
    if (!formValues.newPassword) newErrors.newPassword = t("changePasswordPage.newRequired") || "New password is required";
    if (formValues.newPassword !== formValues.confirmPassword) newErrors.confirmPassword = t("changePasswordPage.notMatch") || "Passwords do not match";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      // Submit logic here
      // e.g. call API
    }
  };

  return (
    <div className="d-flex flex-column gap-2">
      <ClientSection heading={t("changePasswordPage.title")}> {/* Use translation key for heading */}
        <Form
          onSubmit={handleSubmit}
          setErrors={setErrors}
          errors={errors}
          className={styles.customerForm}
        >
          <div className={styles.formGrid}>
            {/* Current Password */}
            <div className={styles.label}>{t("changePasswordPage.current") || t("Current Password")}</div>
            <div className={styles.fieldGroup}>
              <InputField
                name="currentPassword"
                type="password"
                placeholder={t("changePasswordPage.current") || t("Current Password")}
                value={formValues.currentPassword}
                onChange={handleInputChange}
                validations={[{ type: "required" }]}
                errorText={errors["currentPassword"] || undefined}
                icon={<FaLock size={12} />}
              />
            </div>
            {/* New Password */}
            <div className={styles.label}>{t("changePasswordPage.new") || t("New Password")}</div>
            <div className={styles.fieldGroup}>
              <InputField
                name="newPassword"
                type="password"
                placeholder={t("changePasswordPage.new") || t("New Password")}
                value={formValues.newPassword}
                onChange={handleInputChange}
                validations={[{ type: "required" }]}
                errorText={errors["newPassword"] || undefined}
                icon={<FaLock size={12} />}
              />
            </div>
            {/* Confirm New Password */}
            <div className={styles.label}>{t("changePasswordPage.confirm") || t("Confirm New Password")}</div>
            <div className={styles.fieldGroup}>
              <InputField
                name="confirmPassword"
                type="password"
                placeholder={t("changePasswordPage.confirm") || t("Confirm New Password")}
                value={formValues.confirmPassword}
                onChange={handleInputChange}
                validations={[{ type: "required" }]}
                errorText={errors["confirmPassword"] || undefined}
                icon={<FaLock size={12} />}
              />
            </div>
          </div>
          <div className={"d-flex justify-content-end pt-3"}>
            <Button htmlType="submit" type="primary" text={t("buttons.submit")} />
          </div>
        </Form>
      </ClientSection>
    </div>
  );
}
