import styles from "../../styles/components/organisms/dashboard-layout.module.scss";
import Image from "next/image";
import { useLanguage } from "../../localization/LocalContext";
import Link from "next/link";
import {
  ReactNode,
  FC,
  JSXElementConstructor,
  Key,
  PromiseLikeOfReactNode,
  ReactElement,
  ReactPortal,
  useCallback,
} from "react";
import Button from "../button/button";
import { useState, useEffect } from "react";
import RightArrowIcon from "../../../public/assets/svg/right-arrow.svg";
import { useRef, MouseEvent } from "react";
import { formatDate, extractDay } from "../../libs/utils";
import { useRouter } from "next/router";
import { logout } from "../../app/features/auth/authSlice";
import { useDispatch } from "react-redux";

import { Url } from "next/dist/shared/lib/router/router";
import path from "path";
import SessionModal from "../session-modal/session-modal";
import {
  IoSearch,
  IoAdd,
  IoChevronForward,
  IoChevronDown,
  IoDocumentTextOutline,
  IoSettingsOutline,
} from "react-icons/io5";
import { MdKeyboardCommandKey } from "react-icons/md";
import { HiOutlineUsers } from "react-icons/hi";
import { LuUserRoundCheck } from "react-icons/lu";

// type
interface DashboardLayoutProps {
  children: ReactNode;
  title?: String;
}

interface DropdownItem {
  name: string;
  path: string;
  icon?: string;
  subItems?: DropdownItem[];
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

const DropdownIcon = ({
  type,
  size = "14",
}: {
  type: string;
  size?: string;
}) => {
  const iconSize = parseInt(size);

  if (type === "search") {
    return <IoSearch size={iconSize} className={styles.dropdownIcon} />;
  } else if (type === "plus") {
    return <IoAdd size={iconSize} className={styles.dropdownIcon} />;
  } else if (type === "arrow") {
    return (
      <IoChevronForward size={iconSize} className={styles.subDropdownArrow} />
    );
  }
  return null;
};

const DashboardLayout: FC<DashboardLayoutProps> = ({ children, title }) => {
  const { t } = useLanguage();
  const router = useRouter();
  const dispatch = useDispatch();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(
    null
  );

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [isDesktopSidebarVisible, setIsDesktopSidebarVisible] = useState(true);
  const [officeName, setOfficeName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const isActiveRoute = (route: string) => {
    return router.pathname === route;
  };
  const [dropdownOpen, setDropdownOpen] = useState(
    isActiveRoute("/employees") || isActiveRoute("/employees/create")
  );

  const getSidebarItems = useCallback(() => {
    const items = [
      {
        title: t("adDashboardSidebar.dashboard"),
        id: "dashboard",
        isDropdown: false,
        dropdownItems: [],
        path: "/",
      },
      {
        title: t("adDashboardSidebar.customerOperation"),
        id: "customerOperation",
        isDropdown: true,
        dropdownItems: [
          {
            name: t("adDashboardSidebar.inquiries"),
            path: "#",
            subItems: [
              {
                name: t("adDashboardSidebar.searchList"),
                path: "/inquiry",
                icon: "search",
              },
              {
                name: t("adDashboardSidebar.addNew"),
                path: "/inquiry/create",
                icon: "plus",
              },
            ],
          },
          {
            name: t("adDashboardSidebar.clients"),
            path: "#",
            subItems: [
              {
                name: t("adDashboardSidebar.searchList"),
                path: "/customer",
                icon: "search",
              },
              {
                name: t("adDashboardSidebar.addNew"),
                path: "/customer/create",
                icon: "plus",
              },
            ],
          },
          {
            name: t("adDashboardSidebar.partner"),
            path: "#",
            subItems: [
              {
                name: t("adDashboardSidebar.searchList"),
                path: "/partner",
                icon: "search",
              },
              {
                name: t("adDashboardSidebar.addNew"),
                path: "/partner/create",
                icon: "plus",
              },
            ],
          },
          {
            name: t("adDashboardSidebar.assignments"),
            path: "#",
            subItems: [
              {
                name: t("adDashboardSidebar.searchList"),
                path: "/assignments",
                icon: "search",
              },
              {
                name: t("adDashboardSidebar.addNew"),
                path: "/assignments/create",
                icon: "plus",
              },
            ],
          },
        ],
      },
      {
        title: t("adDashboardSidebar.talentOperation"),
        id: "talentOperation",
        isDropdown: false,
        dropdownItems: [],
        path: "/talent-operation",
      },
      {
        title: t("adDashboardSidebar.backOfficeOperation"),
        id: "backOfficeOperation",
        isDropdown: false,
        dropdownItems: [],
        path: "/back-office-operation",
      },
      {
        title: t("adDashboardSidebar.settings"),
        id: "settings",
        isDropdown: false,
        dropdownItems: [],
        path: "/settings",
      },
    ];

    return items;
  }, [t]);

  useEffect(() => {
    const route = router.pathname;

    if (
      route.startsWith("/dashboard") ||
      route.startsWith("/legalDashboard") ||
      route.startsWith("/insuranceDashboard")
    ) {
      setIsDesktopSidebarVisible(false);
    } else {
      setIsDesktopSidebarVisible(true);
    }

    // Reset dropdown states first
    setActiveDropdown(null);
    setActiveSubDropdown(null);

    // Get sidebar items and check for active routes
    const items = getSidebarItems();

    items.forEach((item) => {
      if (item.isDropdown) {
        // Check if any sub-item in this dropdown is active
        const hasActiveRoute = item.dropdownItems.some((dropdownItem: any) => {
          if (dropdownItem.subItems) {
            return dropdownItem.subItems.some(
              (subItem: any) => router.pathname === subItem.path
            );
          }
          return router.pathname === dropdownItem.path;
        });

        if (hasActiveRoute) {
          // Open the main dropdown
          setActiveDropdown(item.id);

          // Find and open the specific sub-dropdown
          item.dropdownItems.forEach((dropdownItem: any, index: number) => {
            if (dropdownItem.subItems) {
              const hasActiveSubItem = dropdownItem.subItems.some(
                (subItem: any) => router.pathname === subItem.path
              );
              if (hasActiveSubItem) {
                setActiveSubDropdown(`${item.id}-${index}`);
              }
            }
          });
        }
      }
    });
  }, [router.pathname, getSidebarItems]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = (dropdownId: any) => {
    // Don't open dropdowns when sidebar is collapsed
    if (!isDesktopSidebarVisible) {
      return;
    }
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const toggleSubDropdown = (subDropdownId: any) => {
    // Don't open sub-dropdowns when sidebar is collapsed
    if (!isDesktopSidebarVisible) {
      return;
    }
    setActiveSubDropdown(
      activeSubDropdown === subDropdownId ? null : subDropdownId
    );
  };

  const unifiedToggleSidebar = (event: React.MouseEvent) => {
    event.stopPropagation();
    // Check if we're on mobile by checking window width
    if (window.innerWidth <= 576) {
      // mobile breakpoint
      setSidebarVisible(!isSidebarVisible);
    } else {
      const newCollapsedState = !isDesktopSidebarVisible;
      setIsDesktopSidebarVisible(newCollapsedState);
      
      // Close all dropdowns when collapsing sidebar
      if (!newCollapsedState) {
        setActiveDropdown(null);
        setActiveSubDropdown(null);
      }
    }
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

  const { currentLanguage } = useLanguage();
  const currentDate = formatDate(new Date(), currentLanguage);
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser") || "{}");
    const userDepartment = JSON.parse(localStorage.getItem("userDepartment") || "{}");
    
    // Get company information
    const companyId = loggedInUser?.company_id || null;
    const companyDepartmentId = loggedInUser?.company_department_id || null;
    
    // Set company name - you might need to fetch this from an API or have it stored
    // For now, using a fallback approach
    const companyName = userDepartment?.company_name || `Company ${companyId}` || "Company";
    const departmentName = userDepartment?.department_name || (companyDepartmentId ? `Department ${companyDepartmentId}` : "Department");
    
    setOfficeName(companyName);
    setDepartmentId(departmentName);
  }, []);

  const currentDay = extractDay(new Date(), currentLanguage);

  const handleLogout = async () => {
    dispatch(logout());
    localStorage.removeItem("token");
    router.push("/login");
  };

  useEffect(() => {
    const name = currentLanguage === "jp" ? JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.first_name_kana + " " + JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.last_name_kana : JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.first_name + " " + JSON.parse(localStorage.getItem("loggedInUser") || "{}")?.last_name ;
    if (name) setUserName(name);
  }, [currentLanguage]);

  useEffect(() => {
    const userDepartment = JSON.parse(localStorage.getItem("userDepartment") || "{}");
    const deptId = userDepartment?.id;
    if (deptId === "1" || deptId === 1) {
      router.push("/projectConfirmed?project_category=1&limit=50&active_tab=2");
    } else if (deptId === "2" || deptId === 2) {
      router.push("/projectLegal/listing/1");
    }
  }, [router]);

  const sidebarItems = getSidebarItems();

  const isRouteActive = (
    currentPath: string,
    paths?: string[],
    mainPath?: string
  ) => {
    if (paths && paths.length > 0) {
      return paths.some((path) => currentPath === path);
    }
    if (mainPath) {
      return currentPath === mainPath;
    }
    return false;
  };

  const isDropdownActiveByRoute = (dropdownItems: any[]) => {
    return dropdownItems.some((dropdownItem) => {
      if (dropdownItem.subItems) {
        return dropdownItem.subItems.some(
          (subItem: any) => router.pathname === subItem.path
        );
      }
      return router.pathname === dropdownItem.path;
    });
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
    }, 6 * 60 * 60 * 1000);
  }, []);

  useEffect(() => {
    resetInactivityTimeout();

    const handleActivity = () => {
      if (!showModal) {
        resetInactivityTimeout();
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
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
      {/* Mobile backdrop */}
      {isSidebarVisible && (
        <div
          className={styles.backdrop}
          onClick={() => setSidebarVisible(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`${styles.sidebar} ${
          isDesktopSidebarVisible ? "" : styles.collapsed
        } ${isSidebarVisible ? styles.show : ""}`}
      >
        <nav className={styles.nav}>
          <p className={`mb-2 ${styles.menuBtnParent} ${styles.heading}`}>
            {t("adDashboardSidebar.menu")}
          </p>
          <ul className={styles.sidebarList}>
            {sidebarItems?.map((item: any) => (
              <li
                key={item.id}
                data-id={item.id}
                className={`${styles.sidebarItem} ${
                  item.isDropdown ? styles.dropdown : ""
                }  ${
                  isRouteActive(router.pathname, item.forActivePaths, item.path)
                    ? styles.active
                    : ""
                } ${
                  activeDropdown === item.id ||
                  (item.isDropdown &&
                    isDropdownActiveByRoute(item.dropdownItems))
                    ? styles.dropdownActive
                    : ""
                }`}
              >
                <div
                  className={styles.sidebarItemIconTextWrapper}
                  onClick={() => {
                    if (!item.isDropdown && item.path) {
                      router.push(item.path);
                      setSidebarVisible(false);
                    } else if (item.isDropdown) {
                      toggleDropdown(item.id);
                    }
                  }}
                >
                  {item.id == "dashboard" && (
                    <MdKeyboardCommandKey
                      className={styles.menuIcon}
                      focusable="false"
                    />
                  )}
                  {item.id == "customerOperation" && (
                    <HiOutlineUsers
                      className={styles.menuIcon}
                      focusable="false"
                    />
                  )}
                  {item.id == "talentOperation" && (
                    <LuUserRoundCheck
                      className={styles.menuIcon}
                      focusable="false"
                    />
                  )}
                  {item.id == "backOfficeOperation" && (
                    <IoDocumentTextOutline
                      className={styles.menuIcon}
                      focusable="false"
                    />
                  )}
                  {item.id == "settings" && (
                    <IoSettingsOutline
                      className={styles.menuIcon}
                      focusable="false"
                    />
                  )}
                  {!item.isDropdown && item.path ? (
                    <Link href={item.path}>
                      <span className={styles.menuLabel}>{item.title}</span>
                    </Link>
                  ) : (
                    <span className={styles.menuLabel}>{item.title}</span>
                  )}

                  {item.isDropdown &&
                    item.dropdownItems &&
                    item.dropdownItems.length > 0 && (
                      <IoChevronDown
                        size={14}
                        className={`${styles.menuArrowIcon} ${
                          activeDropdown === item.id ? styles.arrowRotated : ""
                        }`}
                      />
                    )}
                </div>
                {item.isDropdown && (
                  <ul
                    className={`${styles.dropdownMenu} ${
                      activeDropdown === item.id ? styles.open : ""
                    }`}
                  >
                    {item.dropdownItems.map(
                      (
                        dropdownItem: {
                          path: any;
                          name:
                            | string
                            | number
                            | boolean
                            | ReactElement<
                                any,
                                string | JSXElementConstructor<any>
                              >
                            | Iterable<ReactNode>
                            | ReactPortal
                            | PromiseLikeOfReactNode
                            | null
                            | undefined;
                          icon?: string;
                          subItems?: any[];
                        },
                        index: Key | null | undefined
                      ) => (
                        <li
                          key={index}
                          className={`
                          ${
                            isRouteActive(router.pathname, [dropdownItem.path])
                              ? styles.activeDropdownItem
                              : ""
                          } ${
                            activeSubDropdown === `${item.id}-${index}`
                              ? styles.subDropdownActive
                              : ""
                          } ${
                            dropdownItem.subItems &&
                            dropdownItem.subItems.some(
                              (subItem: any) => router.pathname === subItem.path
                            )
                              ? styles.parentActive
                              : ""
                          }`}
                        >
                          {dropdownItem.subItems ? (
                            <div
                              className={`${styles.subDropdownContainer} ${
                                activeSubDropdown === `${item.id}-${index}`
                                  ? styles.open
                                  : ""
                              }`}
                            >
                              <div
                                className={styles.dropdownItemContent}
                                onClick={() =>
                                  dropdownItem.subItems &&
                                  toggleSubDropdown(`${item.id}-${index}`)
                                }
                              >
                                {dropdownItem.icon && (
                                  <DropdownIcon
                                    type={dropdownItem.icon}
                                    size="14"
                                  />
                                )}
                                <span>{dropdownItem.name}</span>
                                {dropdownItem.subItems &&
                                  dropdownItem.subItems.length > 0 && (
                                    <DropdownIcon type="arrow" size="14" />
                                  )}
                              </div>
                              <ul
                                className={`${styles.subDropdownMenu} ${
                                  activeSubDropdown === `${item.id}-${index}`
                                    ? styles.open
                                    : ""
                                }`}
                              >
                                {dropdownItem.subItems.map(
                                  (subItem: any, subIndex: number) => (
                                    <li
                                      key={subIndex}
                                      className={
                                        isRouteActive(router.pathname, [
                                          subItem.path,
                                        ])
                                          ? styles.activeDropdownItem
                                          : ""
                                      }
                                    >
                                      <Link
                                        href={subItem.path}
                                        onClick={() => setSidebarVisible(false)}
                                      >
                                        <div
                                          className={styles.dropdownItemContent}
                                        >
                                          {subItem.icon && (
                                            <DropdownIcon
                                              type={subItem.icon}
                                              size="14"
                                            />
                                          )}
                                          <span>{subItem.name}</span>
                                        </div>
                                      </Link>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          ) : dropdownItem.path !== "#" ? (
                            <Link
                              href={dropdownItem.path}
                              onClick={() => setSidebarVisible(false)}
                            >
                              <div className={styles.dropdownItemContent}>
                                {dropdownItem.icon && (
                                  <DropdownIcon
                                    type={dropdownItem.icon}
                                    size="14"
                                  />
                                )}
                                <span>{dropdownItem.name}</span>
                              </div>
                            </Link>
                          ) : (
                            <div className={styles.dropdownItemContent}>
                              {dropdownItem.icon && (
                                <DropdownIcon
                                  type={dropdownItem.icon}
                                  size="14"
                                />
                              )}
                              <span>{dropdownItem.name}</span>
                            </div>
                          )}
                        </li>
                      )
                    )}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className={styles.main}>
        <header className={styles.header}>
          <div className="d-flex justify-content-center align-items-center">
            <div
              className={`d-flex gap-1 ${styles.menuBtnParent} ${styles.sideBarLogoParent}`}
              style={{ marginTop: "4px" }}
            >
              {/* Desktop Logo */}
              <Image
                className={`${styles.logo} ${styles.desktopLogo}`}
                src="/assets/images/client-dashboard-logo.svg"
                width={140}
                height={40}
                alt="Logo"
              />
              {/* Mobile Logo */}
              <Image
                className={`${styles.logo} ${styles.mobileLogo}`}
                src="/assets/svg/logo-mobile.svg"
                width={35}
                height={35}
                alt="Logo"
              />

              {/* Mobile Hamburger - next to logo */}
              <div
                ref={hamburgerRef}
                className={`${styles.mobileHamburger} ${
                  isSidebarVisible ? styles.rotated : ""
                }`}
                onClick={unifiedToggleSidebar}
              >
                <Image
                  src="/assets/svg/hamburger1.svg"
                  alt="hamburger"
                  width={22}
                  height={30}
                />
              </div>
            </div>
            {/* Desktop Hamburger */}
            <div
              onClick={unifiedToggleSidebar}
              className={styles.desktopHamburger}
            >
              <Image
                src="/assets/svg/hamburger1.svg"
                alt="hamburger"
                width={22}
                height={30}
                className={`${styles.hamburgerIcon} ${
                  !isDesktopSidebarVisible ? styles.rotated : ""
                }`}
              />
            </div>
          </div>
          <div
            ref={hamburgerRef}
            className={styles.hamburger}
            onClick={unifiedToggleSidebar}
          ></div>
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
              {officeName} {departmentId}
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
