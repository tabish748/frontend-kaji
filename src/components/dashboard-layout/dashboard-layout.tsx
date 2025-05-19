import styles from "../../styles/components/organisms/dashboard-layout.module.scss";
import Image from "next/image";
import { useLanguage } from "../../localization/LocalContext";
import Link from "next/link";
import { ReactNode, FC, JSXElementConstructor, Key, PromiseLikeOfReactNode, ReactElement, ReactPortal, useCallback } from "react";
import Button from "../button/button";
import { useState, useEffect } from "react";
import RightArrowIcon from "../../../public/assets/svg/right-arrow.svg";
import { useRef, MouseEvent } from "react";
import { formatDate, extractDay } from "../../libs/utils";
import { useRouter } from "next/router";
import { logout } from "../../app/features/auth/authSlice";
import { useDispatch } from "react-redux";
import {
  FullSearchIcon,
  CustomerManagementIcon,
  InquiryManagementIcon,
  InterviewManagementIcon,
  BusinessManagementIcon,
  InsuranceManagementIcon,
  UserIcon,
  AnalysisIcon,
  SettingIcon,
  ArrowIcon,
} from "@/libs/svgIcons";
import { Url } from "next/dist/shared/lib/router/router";
import path from "path";
import SessionModal from "../session-modal/session-modal";

// type
interface DashboardLayoutProps {
  children: ReactNode;
  title?: String;
}

interface DropdownItem {
  name: string;
  path: string;
}

interface SidebarItem {
  title: string;
  id: string;
  isDropdown: boolean;
  dropdownItems: DropdownItem[];
  path?: string; // Optional path for non-dropdown items
}

const SidebarButton = ({ text, src, onClick }: any) => {
  const { t } = useLanguage();

  return (
    <div className={styles.menuBtnParent}>
      <Image
        src={src}
        alt={text}
        width={18}
        height={18}
        className={styles.menuIcon}
      />
      <Button
        text={t(text)}
        type="tertiary"
        size="small"
        fullWidth={true}
        onClick={onClick}
        className={styles.menuButton}
      />
    </div>
  );
};
const DashboardLayout: FC<DashboardLayoutProps> = ({ children, title }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeDropdown, setActiveDropdown] = useState(null);

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDesktopSidebarVisible, setIsDesktopSidebarVisible] = useState(true);
  const [officeName, setOfficeName] = useState(false);
  const [departmentId, setDepartmentId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const isActiveRoute = (route: string) => {
    return router.pathname === route;
  };
  const [dropdownOpen, setDropdownOpen] = useState(
    isActiveRoute("/employees") || isActiveRoute("/employees/create")
  );

  useEffect(() => {
    const route = router.pathname;

    if (route.startsWith('/dashboard') || route.startsWith('/legalDashboard') || route.startsWith('/insuranceDashboard')) {
      setIsDesktopSidebarVisible(false);
    } else {
      setIsDesktopSidebarVisible(true);
    }
  }, [router.pathname]);


  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (dropdownId: any) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const toggleSidebar = (event: React.MouseEvent) => {
    event.stopPropagation(); // Stop event propagation
    setSidebarVisible(!isSidebarVisible);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        isSidebarVisible &&
        sidebarRef.current?.contains(e.target as Node) === false &&
        hamburgerRef.current?.contains(e.target as Node) === false
      ) {
        setSidebarVisible(false);
      }
    };

    document.addEventListener("click", handleClickOutside as any);

    return () => {
      document.removeEventListener("click", handleClickOutside as any);
    };
  }, [isSidebarVisible]);

  const currentDate = formatDate(new Date());
  useEffect(() => {
    const name =
      JSON.parse(localStorage.getItem("userOffice") || "{}")?.name || null;
    const deptId =
      JSON.parse(localStorage.getItem("userDepartment") || "{}")?.id || null;
    setDepartmentId(String(deptId));
    setOfficeName(name);
  }, []);

  const currentDay = extractDay(new Date());

  const handleLogout = async () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const name = localStorage.getItem("loggedInUserName");
    if (name) setUserName(name);
  }, []);

  const desktopToggleSidebar = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsDesktopSidebarVisible(!isDesktopSidebarVisible);
  };



  useEffect(() => {
    const deptId = localStorage.getItem("userDepartment");
    if (deptId === "1") {
      router.push("/projectConfirmed?project_category=1&limit=50&active_tab=2");
    } else if (deptId === "2") {
      router.push("/projectLegal/listing/1");
    }
  }, []);


  const getSidebarItems = () => {
    let businessManagementDropdownItems = [];
    let insuranceDropdownItems = [];
    if (departmentId === "1" || departmentId === "2" ) {

      insuranceDropdownItems.push(
        { name: `${t("search/list")}`, path: "/insurance" }
      );
      insuranceDropdownItems.push(
        { name: `${t("新規登録")}`, path: "/insurance/create" }
      );
    }
    if (departmentId === "1") {

      businessManagementDropdownItems.push(
        { name: `${t("search/list")}`, path: "/projectConfirmed/listing2?project_category=1&limit=50&active_tab=2" }
      );
    } else if (departmentId === "2") {

      businessManagementDropdownItems.push(
        { name: `${t("search/list")}`, path: "/projectLegal/listing/1" }
      );
    }
    if (departmentId === "3") {
      businessManagementDropdownItems.push(
        {
          name: `${t("search/list")}`,
          path: "/insurance",
        },
        {
          name: `${t("signUp")}`,
          path: "/insurance/create",
        },

      )
        ;
    }
    let items = [
      {
        title: "fullSearch",
        id: "fullSearch",
        isDropdown: false,
        name: `${t("fullSearch")}`,
        path: "/fullSearch",
      },

      {
        title: "customerManagement",
        id: "customerManagement",
        isDropdown: true,
        dropdownItems: [{ name: `${t("search/list")}`, path: "/customer" }],
      },
      null,
      null,
      {
        title: "inquiryManagement",
        id: "inquiryManagement",
        isDropdown: true,
        dropdownItems: [
          { name: `${t("search/list")}`, path: "/inquiry" },
          { name: `${t("signUp")}`, path: "/inquiry/create" },
        ],
      },
      {
        title: "interviewManagement",
        id: "interviewManagement",
        isDropdown: true,
        dropdownItems: [
          { name: `${t("search/list")}`, path: "/interview" },
          { name: `${t("signUp")}`, path: "/interview/create" },
        ],
      },
      {
        title: departmentId == "3" ? "設計書管理" : "案件管理",
        id: "businessManagement",
        isDropdown: true,
        dropdownItems: businessManagementDropdownItems
      },
      (departmentId === '1'  || departmentId === '2' )? {
        title: "設計書管理",
        id: "insuranceListing",
        isDropdown: true,
        dropdownItems: insuranceDropdownItems,
      } : null,
      {
        title: "employeeManagement",
        id: "employeeManagement",
        isDropdown: true,
        dropdownItems: [
          { name: `${t("search/list")}`, path: "/employees" },
          { name: `${t("signUp")}`, path: "/employees/create" },
        ],
      },
      {
        title: "tabulation/analysis",
        id: "tabulationAnalysis",
        isDropdown: false,
        path: departmentId === '1'
          ? `/dashboard/inquiry`
          : departmentId === '3'
            ? `/insuranceDashboard/1`
            : '/legalDashboard/1a',
        forActivePaths: ["/dashboard/inquiry", "/dashboard", "/dashboard/2", "/dashboard/3", "/dashboard/4", "/dashboard/5", "/dashboard/6", "/insuranceDashboard/1", "/insuranceDashboard/2", "/insuranceDashboard/3", "/legalDashboard/1", "/legalDashboard/1a", "/legalDashboard/2", "/legalDashboard/3", "/legalDashboard/4", "/legalDashboard/5", "/legalDashboard/6", "/legalDashboard/7"]


        // path: {departmentId == '1' ? `/dashboard/inquiry` : '/legalDashboard/1' },
      },
    ];


    if (departmentId === '3') {
      items = items.filter(item => item?.title === "tabulation/analysis" || item?.id === "businessManagement");
    }

    return items.filter(item => item !== null);

  };
  const sidebarItems = getSidebarItems();

  // const sidebarItems: SidebarItem[] = [
  //   {
  //     title: "home",
  //     id: "home",
  //     isDropdown: false,
  //     dropdownItems: [],
  //     // path: "",
  //   },
  //   {
  //     title: "customerManagement",
  //     id: "customerManagement",
  //     isDropdown: true,
  //     dropdownItems: [
  //       { name: `${t("search/list")}`, path: "/customer" },
  //       // { name: `${t("signUp")}`, path: "/customer/create" },
  //     ],
  //   },
  //   {
  //     title: "inquiryManagement",
  //     id: "inquiryManagement",
  //     isDropdown: true,
  //     dropdownItems: [
  //       { name: `${t("search/list")}`, path: "/inquiry" },
  //       { name: `${t("signUp")}`, path: "/inquiry/create" },
  //     ],
  //   },
  //   {
  //     title: "interviewManagement",
  //     id: "interviewManagement",
  //     isDropdown: true,
  //     dropdownItems: [
  //       { name: `${t("search/list")}`, path: "/interview" },
  //       { name: `${t("signUp")}`, path: "/interview/create" },
  //     ],
  //   },
  //   {
  //     title: "businessManagement",
  //     id: "businessManagement",
  //     isDropdown: true,
  //     dropdownItems: [
  //       { name: `${t("search/list")}`,   path: departmentId === '1' ? "/projectConfirmed/listing2" : departmentId === '2' ? "/projectLegal/listing/3" : "/insurance",},
  //       { name: `${t("signUp")}`, path: "/insurance/create" },
  //     ],
  //   },

  //   {
  //     title: "employeeManagement",
  //     id: "employeeManagement",
  //     isDropdown: true,
  //     dropdownItems: [
  //       { name: `${t("search/list")}`, path: "/employees" },
  //       { name: `${t("signUp")}`, path: "/employees/create" },
  //     ],
  //   },
  //   {
  //     title: "tabulation/analysis",
  //     id: "tabulationAnalysis",
  //     isDropdown: false,
  //     dropdownItems: [],
  //     // path: "",
  //   },
  //   // Add additional items if needed
  // ];
  // const isRouteActive = (route: string, currentPath: string) => {
  //   return currentPath.startsWith(route);
  // };
  const isRouteActive = (
    currentPath: string,
    paths?: string[],
    mainPath?: string
  ) => {

    if (paths && paths.length > 0) {
      return paths.some((path) => currentPath == path);
    }
    if (mainPath) {
      return currentPath === mainPath;
    }
    return false;
  };

  useEffect(() => {
    const id = localStorage.getItem("loggedInUserRoleId");
    if (id == "1" || id == "99" || id == "2") {
      setIsAuthenticated(true);
    }
  }, []);



  const [showModal, setShowModal] = useState(false);

  const inactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetInactivityTimeout = useCallback(() => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }

    inactivityTimeoutRef.current = setTimeout(() => {
      setShowModal(true);
    },  6 * 60 * 60 * 1000);  
  }, []);

  useEffect(() => {
    resetInactivityTimeout();

    const handleActivity = () => {
      if (!showModal) {
        resetInactivityTimeout();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [resetInactivityTimeout, showModal]);

  const closeModal = () => {
    setShowModal(false);
    resetInactivityTimeout();
  };

  return (
    <div className={styles.dashboardLayout}>
      <aside
        ref={sidebarRef}
        className={`${styles.sidebar} ${isDesktopSidebarVisible ? "" : styles.collapsed
          }`}
      >
        <nav className={styles.nav}>
          <p className={`mb-2 ${styles.menuBtnParent} ${styles.heading}`}>
            {t("mainMenu")}
          </p>
          <ul className={styles.sidebarList}>
            {sidebarItems?.map((item: any) => (
              <li
                key={item.id}
                className={`${styles.sidebarItem} ${item.isDropdown ? styles.dropdown : ""
                  }  ${isRouteActive(router.pathname, item.forActivePaths, item.path)
                    ? styles.active
                    : ""
                  }`}
              >
                <div
                  className={styles.sidebarItemIconTextWrapper}
                  onClick={() => {
                    if (!item.isDropdown && item.path) {
                      router.push(item.path);
                    } else if (item.isDropdown) {
                      toggleDropdown(item.id);
                    }
                  }}
                >

                  {item.id == "fullSearch" && (
                    <FullSearchIcon className={styles.menuIcon} focusable="false" />
                  )}
                  {item.id == "customerManagement" && (
                    <CustomerManagementIcon
                      className={styles.menuIcon}
                      focusable="false"
                    />
                  )}
                  {item.id == "inquiryManagement" && (
                    <InquiryManagementIcon
                      className={styles.menuIcon}
                      focusable="false"
                    />
                  )}
                  {item.id == "interviewManagement" && (
                    <InterviewManagementIcon
                      className={styles.menuIcon}
                      focusable="false"
                    />
                  )}
                  {item.id == "businessManagement" && (
                    <BusinessManagementIcon
                      className={styles.menuIcon}
                      focusable="false"
                    />
                  )}
                  {item.id == "insuranceListing" && (
                    <InsuranceManagementIcon
                      className={styles.menuIcon}
                      focusable="false"
                    />
                  )}
                  {item.id == "employeeManagement" && (
                    <UserIcon className={styles.menuIcon} focusable="false" />
                  )}
                  {item.id == "tabulationAnalysis" && (
                    <AnalysisIcon
                      className={styles.menuIcon}
                      focusable="false"
                    />
                  )}
                  {
                    !item.isDropdown && item.path ? <Link href={item.path}>{t(item.title)}</Link> : <a>{t(item.title)}</a>
                  }

                  {item.isDropdown && (
                    <ArrowIcon
                      className={`${styles.menuArrowIcon} ${activeDropdown === item.id ? styles.arrowRotated : ""
                        }`}
                    />
                  )}
                </div>
                {item.isDropdown && (
                  <ul
                    className={`${styles.dropdownMenu} ${activeDropdown === item.id ? styles.open : ""
                      }`}
                  >
                    {item.dropdownItems.map((dropdownItem: { path: any; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | PromiseLikeOfReactNode | null | undefined; }, index: Key | null | undefined) => (
                      <li
                        key={index}
                        className={
                          isRouteActive(
                            router.pathname,
                            [dropdownItem.path]
                          )
                            ? styles.activeDropdownItem
                            : ""
                        }
                      // onClick={() => router.push(dropdownItem.path)}
                      >
                        <Link href={dropdownItem.path}>{dropdownItem.name}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}

            {(isAuthenticated) && (
              <>
                <p
                  className={`mb-2 mt-2 ${styles.menuBtnParent} ${styles.heading}`}
                >
                  {t("setting")}
                </p>
                <li
                  className={`${styles.sidebarItem} ${router.pathname.includes("/settings") ? styles.active : ""
                    }`}
                >
                  <div className={styles.sidebarItemIconTextWrapper}>
                    <SettingIcon
                      className={styles.menuIcon}
                      focusable="false"
                    />
                    <Link href="/settings">{t("settings")}</Link>
                  </div>
                </li>
              </>
            )}


          </ul>
        </nav>
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          <div className="d-flex">
            <div
              className={`d-flex gap-1 ${styles.menuBtnParent} ${styles.sideBarLogoParent}`}
              style={{ marginTop: "4px" }}
            >

              <Image
                className={styles.logo}
                src="/assets/images/dashboard-logo.svg"
                width={40}
                height={40}
                alt="Logo"
              />
              <h5 className={styles.dashboardSidebarTitle}>
                VENTURE - <br /> SUPPORT
              </h5>
            </div>
            <div onClick={desktopToggleSidebar}>
              <Image
                src="/assets/svg/hamburger1.svg"
                alt="hamburger"
                width={22}
                height={30}
                className={styles.hamburgerIcon}
              />
            </div>
          </div>
          <div
            ref={hamburgerRef}
            className={styles.hamburger}
            onClick={toggleSidebar}
          >
            ☰
          </div>

          <div className={styles.headerInfo}>
            <span className={`${styles.currentDate} blue-border`}>
              <Image
                src="/assets/svg/calendar.svg"
                alt="calendar"
                width={16}
                height={15}
                className={styles.iconMargin}
              />
              {currentDate} <span> {currentDay} </span>
            </span>
            <span className={`${styles.currentDate}`}>
              <Image
                src="/assets/svg/building.svg"
                alt="building"
                width={16}
                height={15}
                className={styles.iconMargin}
              />
              {officeName}
            </span>
            <span className={`${styles.currentDate}`}>
              <Image
                src="/assets/svg/avatar.svg"
                alt="user"
                width={16}
                height={15}
                className={styles.iconMargin}
              />
              {userName}
            </span>
            <button className={styles.logoutButton} onClick={handleLogout}>
              <Image
                src="/assets/images/logout-icon.svg"
                alt="logout icon"
                width={25}
                height={25}
              />
            </button>
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
          {showModal && <SessionModal onClose={closeModal} />}

    </div>
  );
};

export default DashboardLayout;
