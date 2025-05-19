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
import { resetIntroduceByStatus } from "../../app/features/settings/introduceBy/introduceByListingSlice";
import { fetchCityById } from "@/app/features/settings/city/getCityByIdSlice";
import { getParamValue } from "@/libs/utils";
import Pagination from "../pagination/pagination";
import CheckboxField from "../checkbox-field/checkbox-field";
import { fetchFilterData } from "../../app/features/employees/employeeFilterDataSlice";
import { introduceByTypesOptions, statusValidInvalidOptions } from "@/libs/optionsHandling";
import { fetchIntroducedByList, createIntroduceBy, updateIntroduceBy } from '../../app/features/settings/introduceBy/introduceByListingSlice';  // adjust the import path accordingly
import { fetchIntroduceById, resetIntroduceByDetail } from '../../app/features/settings/introduceBy/getIntroduceByIdSlice';

type ToastState = {
  message: string | string[];
  type: string;
};

export default function IntroduceBySettingsTab() {
  const { t } = useLanguage();
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [sortColumn, setSortColumn] = useState("loginId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">(
    "asc"
  );
  const [activeTab, setActiveTab] = useState(0);
  const [showUpdateBtn, setShowUpdateBtn] = useState(false);
  const [formState, setFormState] = useState({
    introduceByName: "",
    introduceByType: "tax",
    introduceByStatus: "1",
  });

  useEffect(() => {
    dispatch(fetchIntroducedByList({}));
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
    introduceBy: fetchedIntroduceBy,
    loading: fetchedIntroduceByLoading,
    error: fetchedIntroduceByError,
  } = useSelector((state: RootState) => state.introduceByDetail);

  const {
    creationLoading,
    creationError: cityCreationError,
    creationMessage: CreationSuccessMessage,
    creationStatus,
  } = useSelector((state: RootState) => state.introduceByListing);

  // For city listing
  const {
    introducedByList: introducedByListListing,
    loading: introducedByListLoading,
    currentPage,
    lastPage,
    perPage,
    total,
    fromPage,
    toPage,

  } = useSelector((state: RootState) => state.introduceByListing);

  const fetchPage = (pageNumber: number) => {
    const params = {
      page: pageNumber,
    };
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value != null && String(value) != ""
      )
    );
    dispatch(fetchIntroducedByList(filteredParams as any)); // if needed, type assertion here
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

  const resetForm = () => {
    setFormState({
      introduceByName: '',
      introduceByType: 'tax',
      introduceByStatus: '1',
    });
  };

  useEffect(() => {
    if (fetchedIntroduceBy) {
      setFormState({
        introduceByName: String(fetchedIntroduceBy?.name),
        introduceByType: fetchedIntroduceBy?.type,
        introduceByStatus: String(fetchedIntroduceBy?.status),
      });
    }
  }, [fetchedIntroduceBy]);

  useEffect(() => {
    if (showUpdateBtn === false) {
      resetForm();
    }
  }, [showUpdateBtn]);
  useEffect(() => {
    let toastMessage = "";
    let toastType = "";
  
    if (creationStatus) {
      toastMessage = CreationSuccessMessage || "Created successfully!";
      toastType = "success";
      dispatch(fetchIntroducedByList({}));
      setShowUpdateBtn(false);
      resetForm();
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetIntroduceByStatus());
    } else if (creationStatus === false) {
      toastMessage = CreationSuccessMessage || "Something went wrong!";
      toastType = "fail";
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetIntroduceByStatus());
    }
  
  
  }, [creationStatus]);
  

  const fields = [
    {
      type: "input" as FieldType,
      name: "introduceByName",
      label: t("introduceBy"),
      value: formState.introduceByName,
      placeholder: t("introduceBy"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "radio" as FieldType,
      label: t("dpt"),
      name: "introduceByType",
      selectedValue: formState.introduceByType,
      options: introduceByTypesOptions,
      onChange: handleInputChange,
      // className: Style.radioFirstRow,
    },
    {
      type: "radio" as FieldType,
      label: t("status"),
      name: "introduceByStatus",
      selectedValue: formState.introduceByStatus,
      options: statusValidInvalidOptions,
      onChange: handleInputChange,
      // className: Style.radioSecondRow,
    },
  ];

  const handleSubmit = () => {
    const data = {
      type: formState.introduceByType,
      name: formState.introduceByName,
      status: formState.introduceByStatus,
    };
    if (showUpdateBtn === false) {
      dispatch(createIntroduceBy(data));
    }
    if (showUpdateBtn === true) {
      const id = Number(getParamValue("id"));
      dispatch(updateIntroduceBy({ data, id }));
    }
  };

  const columns = [
    { header: `${t("introduceBy")}`, accessor: "name" },
    { header: `${t("dpt")}`, accessor: "department" },
    { header: `${t("status")}`, accessor: "status" },
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
    router.push(`/settings/introduceBy?id=${id}`);
    dispatch(fetchIntroduceById(id)).then(() => setShowUpdateBtn(true));
  };
  const renderLink = (name: string, id: number) => {
    return (
      <span onClick={() => handleLinkClick(id)} className="text-link">
        {name}
      </span>
    );
  };


  function getTypeBadgesDepartment(type: string) {
    
    const renderBadge = () => {
      switch (String(type)) {
        case "税務部":
          return (
            <span key={type} className="badge bg-tax">
              {type}
            </span>
          );
        case "法務部":
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
  
  let updatedIntroduceByListing = introducedByListListing?.map((item) => ({
    ...item,
    status: renderStatus(String(item?.status)),
    name: renderLink(String(item?.name), Number(item?.id)),
    department: getTypeBadgesDepartment(String(item?.department)),
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
    dispatch(fetchIntroducedByList({ ...otherParams, ...sortParam }));
  };
  
  
  const handleRowLimitChange = (newLimit: string) => {
    const sortParam: { sort_asc?: string; sort_desc?: string } = sortDirection === "asc"
      ? { sort_asc: sortColumn }
      : { sort_desc: sortColumn };
      const otherParams = {
        page: currentPage ?? undefined,
        limit: Number(newLimit),
      };
      dispatch(fetchIntroducedByList({ ...otherParams, ...sortParam }));
  };

  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetIntroduceByStatus());
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
      {/* <HeadingRow headingTitle={t("introduceBySettings")}></HeadingRow> */}
      <div className={settingStyles.formContainer}>
        <GenericForm
          fields={fields}
          onSubmit={handleSubmit}
          isLoading={creationLoading}
          submitButtonLabel={`${t("register")}`}
          showResetButton={true}
          showResetLabel={t("フォームをリセットする")}
          onReset={resetForm}
          parentClassName={Style.createFormWrapper}
          buttonClassName={settingStyles.formCreateBtn}
          disabledSubmitBtn={toast.message == '紹介元が登録されました。' && toast.type == 'success' ? true :false}
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
          data={updatedIntroduceByListing}
          loading={introducedByListLoading}
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
