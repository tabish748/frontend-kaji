import React, { useEffect, useState, useRef } from "react";
import Style from "../../styles/pages/settings.module.scss";
import InquiryStyle from "@/styles/pages/inquiry.module.scss";
import { useLanguage } from "../../localization/LocalContext";
import GenericForm, { FieldType } from "@/components/generic-form/generic-form";
import { useDispatch, useSelector } from "react-redux";
import Toast from "@/components/toast/toast";
import { AppDispatch, RootState } from "../../app/store";
import { useRouter } from "next/router";
import settingStyles from "../../styles/pages/settings.module.scss";
import HeadingRow from "@/components/heading-row/heading-row";
import TableBuddy from "@/components/table-buddy/table-buddy";
import {
  fetchCities,
  updateCity,
} from "@/app/features/settings/city/cityListingSlice";
import Image from "next/image";
import { createCity } from "@/app/features/settings/city/cityListingSlice";
import { resetTeamStatus } from "../../app/features/settings/teams/teamListSlice";

import { fetchCityById } from "@/app/features/settings/city/getCityByIdSlice";
import { getParamValue } from "@/libs/utils";
import Pagination from "../pagination/pagination";
import CheckboxField from "../checkbox-field/checkbox-field";
import { fetchFilterData } from "../../app/features/employees/employeeFilterDataSlice";
import {
  introduceByTypesOptions,
  statusValidInvalidOptions,
} from "@/libs/optionsHandling";
// import { fetchDropdownData } from "../../app/features/employees/departmentCityOfficeDropdownSlice";
import { fetchActiveOffices } from "../../app/features/settings/teams/activeOfficeDropdownSlice";
import {
  fetchTeamList,
  createTeam,
  updateTeam,
} from "../../app/features/settings/teams/teamListSlice"; // assuming you have this action in your slice
import { fetchTeamById } from "../../app/features/settings/teams/getTeamByIdSlice";

type ToastState = {
  message: string | string[];
  type: string;
};

export default function TeamSettingsTab() {
  const { t } = useLanguage();
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [sortColumn, setSortColumn] = useState("loginId");
  const [activeOfficeDropdown, setActiveOfficeDropdown] = useState([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">(
    "asc"
  );
  const [activeTab, setActiveTab] = useState(0);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [formState, setFormState] = useState({
    teamName: "",
    teamDepartment: "",
    teamOffice: "",
    teamStatus: "1",
  });

  useEffect(() => {
    dispatch(fetchTeamList({}));
    dispatch(fetchFilterData());
  }, [dispatch]);

  const {
    cities,
    offices,
    departments,
    teams,
    userRoles,
    userTypes,
    prefectures,
  } = useSelector((state: RootState) => state.employeeFilter);

  const {
    team: fetchedTeam,
    loading: fetchedTeamLoading,
    error: fetchedTeamError,
  } = useSelector((state: RootState) => state.teamDetail);

  const {
    creationLoading: teamCreationLoading,
    creationMessage: teamCreationSuccessMessage,
    creationSuccess,
  } = useSelector((state: RootState) => state.teamList);

  const activeOffices = useSelector(
    (state: RootState) => state.activeOfficeDropdown.offices
  );

  // For city listing
  const {
    teamList: teamListing,
    loading: teamListingLoading,
    message: teamListingMessage,
    currentPage,
    lastPage,
    perPage,
    total,
    fromPage,
    toPage,
  } = useSelector((state: RootState) => state.teamList);

  const fetchPage = (pageNumber: number) => {
    // if (sortColumn) {
    //   if (sortDirection === "asc") {
    //     params.sort_asc = sortColumn;
    //   } else {
    //     params.sort_desc = sortColumn;
    //   }
    // }
    const params = {
      page: pageNumber,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value != null && String(value) != ""
      )
    );

    dispatch(fetchTeamList(filteredParams as any)); // if needed, type assertion here
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name) {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    if (activeOffices) {
      setActiveOfficeDropdown(activeOffices as any);
    }
  }, [activeOffices]);

  const resetForm = () => {
    setFormState({
      teamName: "",
      teamDepartment: "",
      teamOffice: "",
      teamStatus: "1",
    });
  };

  useEffect(() => {
    if (fetchedTeam) {
      setFormState({
        teamName: fetchedTeam?.name,
        teamDepartment: String(fetchedTeam?.departmentId),
        teamOffice: String(fetchedTeam?.officeId),
        teamStatus: fetchedTeam?.status,
      });
    }
  }, [fetchedTeam]);

  useEffect(() => {
    if (showUpdateBtn === false) {
      resetForm();
    }
  }, [showUpdateBtn]);
  useEffect(() => {
    let toastMessage = "";
    let toastType = "";
    if (creationSuccess === true) {
      toastMessage = teamCreationSuccessMessage || "Created successfully!";
      toastType = "success";
      dispatch(fetchTeamList({}));
      setShowUpdateBtn(false);
      resetForm();
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetTeamStatus());
    } else if (creationSuccess === false) {
      toastMessage = teamCreationSuccessMessage || "Something went wrong!";
      toastType = "fail";
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetTeamStatus());
    }
  }, [creationSuccess]);


  const handleFetchDropdown = (departmentId: number) => {
    dispatch(fetchActiveOffices(departmentId));
  };

  useEffect(() => {
    if (formState.teamDepartment) {
      handleFetchDropdown(parseInt(formState.teamDepartment));
    }
  }, [formState.teamDepartment]);

  const fields = [
    {
      type: "input" as FieldType,
      name: "teamName",
      label: t("teamName"),
      value: formState.teamName,
      placeholder: t("teamName"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "select" as FieldType,
      name: "teamDepartment",
      label: t("department"),
      value: formState.teamDepartment,
      options: departments,
      placeholder: t("department"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "select" as FieldType,
      name: "teamOffice",
      label: t("teamOffice"),
      value: formState.teamOffice,
      options: activeOfficeDropdown,
      placeholder: t("teamOffice"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "radio" as FieldType,
      label: t("status"),
      name: "teamStatus",
      selectedValue: formState.teamStatus,
      options: statusValidInvalidOptions,
      onChange: handleInputChange,
      // className: Style.radioThirdRow,
    },
  ];

  const handleSubmit = () => {
    const data = {
      name: formState.teamName,
      department_id: formState.teamDepartment,
      office_id: formState.teamOffice,
      status: formState.teamStatus,
    };
    if (showUpdateBtn === false) {
      dispatch(createTeam(data));
    }
    if (showUpdateBtn === true) {
      const id = Number(getParamValue("id"));
      dispatch(updateTeam({ data, id }));
    }
  };

  const columns = [
    { header: `${t("teamName")}`, accessor: "name" },
    { header: `${t("department")}`, accessor: "departmentName" },
    { header: `${t("teamOffice")}`, accessor: "officeName" },
    { header: `${t("teamStatus")}`, accessor: "status" },
  ];

  const renderStatus = (status: string) => {
    return (<>
      {
        status == "有効" ? <>
          <span className="cust-tag active-tag">
            {status}
          </span>
        </> : <>
          <span className="cust-tag block-tag">
            {status}
          </span>
        </>
      }
    </>
    );
  };
  const handleLinkClick = (id: number) => {
    router.push(`/settings/team?id=${id}`);
    dispatch(fetchTeamById(id)).then(() => setShowUpdateBtn(true));
  };
  const renderLink = (baseName: string, id: number) => {
    return (
      <span onClick={() => handleLinkClick(id)} className="text-link">
        {baseName}
      </span>
    );
  };

  function getTypeBadgesDepartment(type: string, id: number) {
    const renderBadge = () => {
      switch (String(id)) {
        case "1":
          return (
            <span key={type} className="badge bg-tax">
              {type}
            </span>
          );
        case "2":
          return (
            <span key={type} className="badge bg-legal">
              {type}
            </span>
          );
        case "3":
          return (
            <span key={type} className="badge bg-insurance">
              {type}
            </span>
          );
        default:
          return null;
      }
    };

    return <div>{renderBadge()}</div>;
  }

  let updatedTeamListing = teamListing?.map((item: { status: any; name: any; id: any; departmentName: any; departmentId: any; }) => ({
    ...item,
    status: renderStatus(String(item?.status)),
    name: renderLink(String(item?.name), Number(item?.id)),
    departmentName: getTypeBadgesDepartment(
      String(item?.departmentName),
      Number(item?.departmentId)
    ),
  }));

  const handleSort = (columnAccessor: string) => {
    let direction = "asc";
    let sortParam: { sort_asc?: string; sort_desc?: string } = {}; // Explicit type

    if (sortColumn === columnAccessor) {
      direction = sortDirection === "asc" ? "desc" : "asc";
    } else {
      setSortColumn(columnAccessor);
    }

    setSortDirection(direction as any);

    if (direction === "asc") {
      sortParam = { sort_asc: columnAccessor };
    } else {
      sortParam = { sort_desc: columnAccessor };
    }

    const otherParams = {
      page: currentPage ?? undefined,
    };

    dispatch(fetchTeamList({ ...otherParams, ...sortParam }));
  };

  const handleRowLimitChange = (newLimit: string) => {
    const sortParam: { sort_asc?: string; sort_desc?: string } = sortDirection === "asc"
      ? { sort_asc: sortColumn }
      : { sort_desc: sortColumn };
    const otherParams = {
      page: currentPage ?? undefined,
      limit: Number(newLimit),
    };
    dispatch(fetchTeamList({ ...otherParams, ...sortParam }));
  };
  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetTeamStatus());
  };
  return (
    <>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
      {/* <HeadingRow headingTitle={t("teamSettings")}></HeadingRow> */}
      <div className={settingStyles.formContainer}>
        <GenericForm
          fields={fields}
          onSubmit={handleSubmit}
          isLoading={teamCreationLoading}
          submitButtonLabel={`${t("register")}`}
          showResetButton={true}
          showResetLabel={t("フォームをリセットする")}
          onReset={resetForm}
          parentClassName={Style.createFormWrapper}
          buttonClassName={settingStyles.formCreateBtn}
          disabledSubmitBtn={toast.message == 'チームが登録されました。' && toast.type == 'success' ? true :false}
        ></GenericForm>
      </div>
      <div className={settingStyles.tableWrapper}>
        <div className={`${InquiryStyle.paginationMargin} mb-1`}>
          <Pagination
            currentPage={currentPage ?? 1}
            lastPage={lastPage ?? 1}
            onFirst={() => fetchPage(1)}
            onLast={() => fetchPage(lastPage ?? 1)}
            onPrev={() => fetchPage((currentPage ?? 1) - 1)}
            onNext={() => fetchPage((currentPage ?? 1) + 1)}
            totalNumber={total}
            fromPage={fromPage ?? 1}
            toPage={toPage ?? 1}
            onPageClick={(page: number) => fetchPage(page)}
            onRowLimitChange={handleRowLimitChange}
          />
        </div>
        <TableBuddy
          columns={columns}
          data={updatedTeamListing}
          loading={teamListingLoading}
          onSort={handleSort}
          sortedColumn={sortColumn}
          sortDirection={sortDirection}
        />

        <Pagination
          currentPage={currentPage ?? 1}
          lastPage={lastPage ?? 1}
          onFirst={() => fetchPage(1)}
          onLast={() => fetchPage(lastPage ?? 1)}
          onPrev={() => fetchPage((currentPage ?? 1) - 1)}
          onNext={() => fetchPage((currentPage ?? 1) + 1)}
          totalNumber={total}
          fromPage={fromPage ?? 1}
          toPage={toPage ?? 1}
          onPageClick={(page: number) => fetchPage(page)}
          onRowLimitChange={handleRowLimitChange}
        />
      </div>
    </>
  );
}
