import React, { ChangeEvent, useState } from "react";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { MdOutlineAlternateEmail } from "react-icons/md";
import styles from "@/styles/pages/cnforgotpassword.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import ApiHandler from "@/app/api-handler";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [formValues, setFormValues] = useState({
    email: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await ApiHandler.request(
        '/api/customer/forgot-password',
        'POST',
        formValues,
        undefined,
        undefined,
        false
      );
      // Show success message or redirect
      router.push("/cn-login");
    } catch (error: any) {
      if (error.errors) {
        setErrors(error.errors);
      } else {
        setErrors({
          email: error.message || "Failed to process request",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      <div className={styles.formContainer}>
        <Image
          src="/assets/svg/logo-mobile.svg"
          alt="Logo"
          width={60}
          height={60}
          className={styles.logo}
        />
        <div className={styles.welcomeText}>
          <h1>{t("cnForgotPasswordPage.title")}</h1>
          <p>{t("cnForgotPasswordPage.pleaseEnterEmail")}</p>
        </div>

        <Form onSubmit={handleSubmit} setErrors={setErrors} errors={errors}>
          <div className={styles.formGrid}>
            <InputField
              labelClassName="text-normal mb-1"
              label="Email"
              name="email"
              placeholder={t("cnForgotPasswordPage.emailPlaceholder")}
              type="email"
              value={formValues.email}
              onChange={handleInputChange}
              validations={[{ type: "required" }, { type: "email" }]}
              errorText={errors["email"] || undefined}
              icon={<MdOutlineAlternateEmail size={16} />}
              disabled={loading}
            />

            <Button
              htmlType="submit"
              type="primary"
              text={t("cnForgotPasswordPage.submit")}
              className={styles.submitButton}
              isLoading={loading}
            />
            
            <div className={styles.backToLogin}>
              <span>{t("cnForgotPasswordPage.forgetIt")} </span>
              <a href="/cn-login">{t("cnForgotPasswordPage.sendMeBack")}</a>
              <span> {t("cnForgotPasswordPage.toTheSignInScreen")}</span>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
} 