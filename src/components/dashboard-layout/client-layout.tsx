import React, { useState, useRef, useEffect, ReactNode } from "react";
import styles from "../../styles/components/organisms/client-layout.module.scss";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/localization/LocalContext";
import ImageLabel from "../image-lable/image-lable";
import { useRouter } from "next/router";
import { IoMdPhonePortrait } from "react-icons/io";
import { BiCurrentLocation } from "react-icons/bi";
import { IoLinkSharp } from "react-icons/io5";
import ClientSection from "../client-section/client-section";
import { BsPersonVcard } from "react-icons/bs";
import { FaPhoneAlt, FaRegAddressCard, FaTaxi } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { CiFlag1 } from "react-icons/ci";
import { LANG } from "@/libs/constants";
import { useDispatch } from "react-redux";
import { logout } from "@/app/features/auth/authSlice";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const userInfoItems = [
  {
    key: "affiliatedCorporation",
    label: "user.affiliatedCorporation",
    icon: <FaRegAddressCard />,
  },
  {
    key: "userPhone",
    label: "user.phone",
    icon: <FaPhoneAlt />,
  },
  {
    key: "userEmail",
    label: "user.email",
    icon: <MdEmail />,
  },
  {
    key: "userAddress",
    label: "user.address",
    icon: <CiFlag1 />,
  },
  {
    key: "nearestTrainStation",
    label: "user.trainStation",
    icon: <FaTaxi />,
  },
];

interface ClientLayoutProps {
  header?: boolean;
  footer?: boolean;
  children: ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({
  header = true,
  footer = true,
  children,
}) => {
  const dispatch = useDispatch();
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navLinks = [
    { name: t("top"), path: "/" },
    { name: t("about"), path: "/cn-about" },
    { name: t("schedule"), path: "/cn-schedule" },
    { name: t("invoice"), path: "/cn-invoice" },
    { name: t("quotation"), path: "/cn-quotation" },
    { name: t("announcement"), path: "/cn-announcement" },
    { name: t("request"), path: "/cn-request" },
    { name: t("changePassword"), path: "/cn-change-password" },
  ];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(e.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [sidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isLangDropdownOpen &&
        langDropdownRef.current &&
        !langDropdownRef.current.contains(e.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLangDropdownOpen]);

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    setIsLangDropdownOpen(false);
  };
  type Language = "en" | "jp";

  const flags: Record<Language, string> = {
    en: "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/us.svg",
    jp: "https://raw.githubusercontent.com/lipis/flag-icons/main/flags/4x3/jp.svg",
  };

  const user = localStorage.getItem("loggedInUser")
    ? JSON.parse(localStorage.getItem("loggedInUser")!)
    : null;

  return (
    <div className={styles.clientLayout}>
      {/* Sidebar for mobile only */}
      <nav
        ref={sidebarRef}
        className={
          sidebarOpen
            ? `${styles.clientSidebar} ${styles.open}`
            : styles.clientSidebar
        }
        aria-label={t("mainMenu")}
      >
        <ul>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                href={link.path}
                className={router.pathname === link.path ? styles.active : ""}
                onClick={() => setSidebarOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div
        className={
          sidebarOpen
            ? `${styles.clientOverlay} ${styles.open}`
            : styles.clientOverlay
        }
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />
      <header className={styles.clientHeader}>
        <div className="d-flex">
          <Image
            className={styles.logo}
            src="/assets/images/client-dashboard-logo.svg"
            width={40}
            height={40}
            alt="Logo"
          />
          <Image
            className={`${styles.logoMobile}`}
            src="/assets/svg/logo-mobile.svg"
            width={40}
            height={40}
            alt="Logo"
          />
          {/* Hamburger for mobile */}
          <button
            ref={hamburgerButtonRef}
            className={styles.clientHamburger}
            onClick={() => setSidebarOpen((open) => !open)}
            aria-label={t("mainMenu")}
          >
            <Image
              src="/assets/svg/hamburger1.svg"
              alt={t("mainMenu")}
              width={30}
              height={30}
            />
          </button>
        </div>

        <div className={styles.headerControls}>
          <div className={styles.langWrapper}>
            <div className={styles.langDropdownWrapper} ref={langDropdownRef}>
              <div
                className={styles.langSelect}
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              >
                <div className={styles.selectedLang}>
                  <Image
                    src={flags[(currentLanguage as Language) || "en"]}
                    width={20}
                    height={15}
                    alt={currentLanguage === "en" ? "English" : "Japanese"}
                    className={styles.flagIcon}
                  />
                  <span>{(currentLanguage || "en").toUpperCase()}</span>
                </div>
              </div>
              {isLangDropdownOpen && (
                <div className={styles.langDropdown}>
                  {LANG.map((lang) => {
                    const langLower = lang.toLowerCase() as Language; // convert to lowercase and assert type
                    return (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(langLower)}
                        className={styles.langOption}
                      >
                        <Image
                          src={flags[langLower]}
                          width={20}
                          height={15}
                          alt={langLower === "en" ? "English" : "Japanese"}
                          className={styles.flagIcon}
                        />
                        <span>{lang}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className={styles.notificationWrapper}>
            <Image
              src="/assets/svg/notification-icon.svg"
              width={24}
              height={24}
              alt={t("notifications")}
            />
            <span className={styles.notificationBadge}>3</span>
          </div>
          <div className={styles.profileSection}>
            <Image
              src="/assets/images/test.jpg"
              width={40}
              height={40}
              alt="Profile"
              className={styles.profileImage}
              onClick={() => {
                dispatch(logout());
                router.push("/cn-login");
              }}
            />
            <div>
              <p className={styles.userName}>{user?.name}</p>
              <p className={styles.userNameJp}>{user?.name_kana}</p>
            </div>
          </div>
        </div>

        {/* customer top view */}
      </header>
      {header && (
        <>
          <h1 className={styles.topHeading}> {t("profile")} </h1>
          <div className={styles.topProfileCardWrapper}>
            <div className={styles.topProfileCard}>
              <h1> {user?.username} </h1>
              <div className={styles.customerTopView}>
                {userInfoItems.map((item) => (
                  <ImageLabel
                    key={item.key}
                    icon={item.icon}
                    label={t(item.label)}
                  />
                ))}
              </div>
              {/* Desktop Nav Bar */}
              <nav className={styles.desktopNav}>
                <ul>
                  {navLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        href={link.path}
                        className={
                          router.pathname === link.path ? styles.active : ""
                        }
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
      <main className={styles.clientContent}>{children}</main>
      {footer && (
        <>
          <footer className={styles.clientFooter}>
            <ClientSection heading={t("contact.title")}>
              <div className={styles.contactSection}>
                <h2 className={styles.contactHeading}>
                  {t("contact.heading")}
                </h2>
                <div className={`${styles.contactGrid}`}>
                  <div className={styles.contactItem}>
                    <div className={`${styles.contactIcon} ${styles.contact}`}>
                      <IoMdPhonePortrait size={16} />
                    </div>
                    <div>
                      <p>{t("contact.title")}</p>
                      <p>{t("contact.phoneNumber")}</p>
                      <p>{t("contact.email")}</p>
                    </div>
                  </div>
                  <div className={styles.contactItem}>
                    <div className={`${styles.contactIcon} ${styles.address}`}>
                      <BiCurrentLocation size={16} />
                    </div>
                    <div>
                      <p>{t("contact.address.title")}</p>
                      <p>{t("contact.address.postalCode")}</p>
                      <p>{t("contact.address.line1")}</p>
                      <p>{t("contact.address.line2")}</p>
                    </div>
                  </div>
                  <div className={styles.contactItem}>
                    <div className={`${styles.contactIcon} ${styles.link}`}>
                      <IoLinkSharp size={16} />
                    </div>
                    <div>
                      <p>{t("contact.website.title")}</p>
                      <p>
                        <a
                          href={t("contact.website.url")}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t("contact.website.url")}
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ClientSection>
          </footer>
          <div className={styles.footerCopyright}>
            Copyright © {new Date().getFullYear()} Chez Vous All Rights Reserved
          </div>
        </>
      )}
    </div>
  );
};

export default ClientLayout;
