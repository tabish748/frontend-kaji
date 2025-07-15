import React, { ChangeEvent, useState } from "react";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { MdOutlineAlternateEmail } from "react-icons/md";
import styles from "@/styles/pages/cnforgotpassword.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import ApiHandler from "@/app/api-handler";
import { useDispatch } from "react-redux";
import { forgotPassword } from "@/app/features/auth/authSlice";
import Toast from "@/components/toast/toast";
import type { AppDispatch } from "@/app/store";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    msg: string[];
    type: string;
  }>();
  const [formValues, setFormValues] = useState({
    email: "",
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Reset toast when user starts typing
    setShowToast(false);
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
      const formData = new FormData();
      formData.append("email", formValues.email);
      await dispatch(forgotPassword(formData)).unwrap();
      
      // Show success message before redirect
      setToastMessage({
        msg: ["Password reset link sent successfully"],
        type: "success",
      });
      setShowToast(true);
      
      // Redirect after a short delay to show the success message
      setTimeout(() => {
        router.push("/cn-login");
      }, 2000);
    } catch (error: any) {
      console.log("Forgot password error:", error);
      let errorMessage = "Failed to process request";
      
      // Handle error object with message property
      if (typeof error === 'object' && error !== null) {
        if (error.message) {
          errorMessage = error.message;
        }
      }
      
      setToastMessage({
        msg: [errorMessage],
        type: "fail"
      });
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.forgotPasswordContainer}>
      {showToast && toastMessage && (
        <Toast
          message={toastMessage.msg}
          type={toastMessage.type || "success"}
          duration={3000}
        />
      )}
      
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
              <Link href="/cn-login">{t("cnForgotPasswordPage.sendMeBack")}</Link>
              <span> {t("cnForgotPasswordPage.toTheSignInScreen")}</span>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
} 