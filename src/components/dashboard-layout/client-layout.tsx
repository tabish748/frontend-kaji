import React, { useState, useRef, useEffect } from "react";
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

interface ClientLayoutProps {
  children: React.ReactNode;
}

const userInfoItems = [
  {
    key: "affiliatedCorporation",
    label: "Affiliated Corporation",
    icon: "assets/svg/detail.svg",
  },
  {
    key: "userPhone",
    label: "Phone",
    icon: "assets/svg/phone.svg",
  },
  {
    key: "userEmail",
    label: "E-mail",
    icon: "assets/svg/email.svg",
  },
  {
    key: "userAddress",
    label: "Address",
    icon: "assets/svg/address.svg",
  },
  {
    key: "nearestTrainStation",
    label: "Train Station",
    icon: "assets/svg/train-station.svg",
  },
];

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  const { t, currentLanguage, setLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navLinks = [
    { name: t("top"), path: "/" },
    { name: t("about"), path: "/about" },
    { name: t("schedule"), path: "/schedule" },
    { name: t("invoice"), path: "/invoice" },
    { name: t("quotation"), path: "/quotation" },
    { name: t("announcement"), path: "/announcement" },
    { name: t("request"), path: "/request" },
    { name: t("changePassword"), path: "/change-password" },
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
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className={styles.langOption}
                  >
                    <Image
                      src={flags.en}
                      width={20}
                      height={15}
                      alt="English"
                      className={styles.flagIcon}
                    />
                    <span>EN</span>
                  </button>
                  <button
                    onClick={() => handleLanguageChange("jp")}
                    className={styles.langOption}
                  >
                    <Image
                      src={flags.jp}
                      width={20}
                      height={15}
                      alt="Japanese"
                      className={styles.flagIcon}
                    />
                    <span>JP</span>
                  </button>
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
            />
            <div>
              <p className={styles.userName}>Sonya Taylor</p>
              <p className={styles.userName}>提携法人</p>
            </div>
          </div>
        </div>

        {/* customer top view */}
      </header>
      <h1 className={styles.topHeading}> PROFILE </h1>
      <div className={styles.topProfileCardWrapper}>
        <div className={styles.topProfileCard}>
          <h1> Sonya Taylor </h1>
          <div className={styles.customerTopView}>
            {userInfoItems.map((item) => (
              <ImageLabel
                key={item.key}
                iconSrc={`/${item.icon}`}
                label={item.label}
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
      <main className={styles.clientContent}>{children}</main>
      <footer className={styles.clientFooter}>
        <ClientSection heading="Contact">
          <div className={styles.contactSection}>
            <h3>Contact with us</h3>
            <div className={styles.contactGrid}>
              <div className={styles.contactItem}>
                <div className={`${styles.contactIcon} ${styles.contact}`}>
                  <IoMdPhonePortrait size={16} />
                </div>
                <div>
                  <p>Contact</p>
                  <p>0120-699-100</p>
                  <p>info@chezvous.co.jp</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={`${styles.contactIcon} ${styles.address}`}>
                  <BiCurrentLocation size={16} />
                </div>
                <div>
                  <p>Address</p>
                  <p>〒160-0008</p>
                  <p>1st & 3rd Floor, 1-13 Saneicho, Yotsuya,</p>
                  <p>Shinjuku-ku, Tokyo, Japan</p>
                </div>
              </div>
              <div className={styles.contactItem}>
                <div className={`${styles.contactIcon} ${styles.link}`}>
                  <IoLinkSharp size={16} />
                </div>
                <div>
                  <p>Website</p>
                  <p>
                    <a
                      href="https://www.chezvous.co.jp/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      https://www.chezvous.co.jp/
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </ClientSection>

        <div className={styles.footerCopyright}>
          Copyright © {new Date().getFullYear()} Chez Vous All Rights Reserved
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
