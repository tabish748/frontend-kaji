import React, { ChangeEvent, useState, useEffect } from "react";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import styles from "@/styles/pages/cnlogin.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { login } from "@/app/features/auth/authSlice";
import { useRouter } from "next/router";
import type { AppDispatch, RootState } from "@/app/store";
import ApiHandler from "@/app/api-handler";
import Toast from "@/components/toast/toast";
import { USER_TYPE } from "@/libs/constants";

export default function Login() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [showToast, setShowToast] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    msg: string[];
    type: string;
  }>();
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
  });

  const { loading, isAuthenticated, message } = useSelector(
    (state: RootState) => state.auth
  ) || { loading: false, isAuthenticated: false, message: null };

  const userRole = localStorage.getItem("loggedInUser")
    ? JSON.parse(localStorage.getItem("loggedInUser")!).userRole
    : null;

  // Redirect if user is already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("loggedInUser");
    if (isLoggedIn) {
      router.push("/");
    }
  }, [router]);

  // Handle navigation after successful authentication
  useEffect(() => {
    if (isAuthenticated && isNavigating) {
      router.push("/");
    }
  }, [isAuthenticated, isNavigating, router]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear errors when user starts typing
    // if (errors[name]) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     [name]: null,
    //   }));
    // }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("input_type", formValues.email);
    formData.append("password", formValues.password);
    try {
      await dispatch(login({ formData, loginType: USER_TYPE.customer })).unwrap();
      setToastMessage({
        msg: ["Login successful"],
        type: "success",
      });
      setShowToast(true);
      setIsNavigating(true);
    } catch (error: any) {
      console.log("Login error:", error);
      if (error.errors && error.errors["email/password"]) {
        setToastMessage({
          msg: error.errors["email/password"],
          type: "fail",
        });
      } else {
        setToastMessage({
          msg: [error.message || "Login failed"],
          type: "fail",
        });
      }
      setShowToast(true);
    }
  };

  return (
    <div className={styles.loginContainer}>
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
              <Link href="/cn-forgot-password">
                {t("cnLoginPage.forgotPassword")}
              </Link>
            </div>
            <div className={`${styles.forgotPassword}`}>
              <Link href="/cn-contact-form">
                New Request Form
              </Link>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
