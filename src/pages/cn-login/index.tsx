import React, { ChangeEvent, useState, useEffect } from "react";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import styles from "@/styles/pages/cnlogin.module.scss";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/app/features/auth/authSlice";
import { useRouter } from "next/router";
import type { AppDispatch, RootState } from "@/app/store";
import ApiHandler from "@/app/api-handler";

export default function Login() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const { loading, isAuthenticated, message } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    // Test API connectivity on component mount
    const pingAPI = async () => {
      try {
        await ApiHandler.request('/ping', 'GET', undefined, undefined, undefined, false);
        console.log('API connection successful');
      } catch (error) {
        console.error('API connection failed:', error);
        setErrors({ email: 'Unable to connect to server' });
      }
    };
    pingAPI();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

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
      await dispatch(login(formValues)).unwrap();
    } catch (error: any) {
      // Handle different types of errors
      if (error.errors) {
        // API returned field-specific errors
        setErrors(error.errors);
      } else {
        // General error
        setErrors({
          email: error.message || "Login failed",
        });
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formContainer}>
        <Image
          src="/assets/svg/logo-mobile.svg"
          alt="Logo"
          width={60}
          height={60}
          className={styles.logo}
        />
        <div className={styles.welcomeText}>
          <h1>{t("cnLoginPage.welcomeBack")}</h1>
          <p>{t("cnLoginPage.pleaseSignIn")}</p>
        </div>

        <Form onSubmit={handleSubmit} setErrors={setErrors} errors={errors}>
          <div className={styles.formGrid}>
            <InputField
              labelClassName="text-normal mb-1"
              label="Email"
              name="email"
              placeholder={t("cnLoginPage.emailPlaceholder")}
              type="email"
              value={formValues.email}
              onChange={handleInputChange}
              validations={[{ type: "required" }, { type: "email" }]}
              errorText={errors["email"] || undefined}
              icon={<MdOutlineAlternateEmail size={16} />}
              disabled={loading}
            />

            <InputField
              labelClassName="text-normal mb-1"
              label="Password"
              name="password"
              placeholder={t("cnLoginPage.passwordPlaceholder")}
              type="password"
              value={formValues.password}
              onChange={handleInputChange}
              validations={[{ type: "required" }]}
              errorText={errors["password"] || undefined}
              icon={<RiLockPasswordLine size={16} />}
              disabled={loading}
            />

            <Button
              htmlType="submit"
              type="primary"
              text={t("cnLoginPage.signIn")}
              className={styles.submitButton}
              isLoading={loading}
            />
            <div className={styles.forgotPassword}>
              <a href="/cn-forgotpassword">{t("cnLoginPage.forgotPassword")}</a>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
