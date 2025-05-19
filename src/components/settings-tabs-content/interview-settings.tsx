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
import { resetInterviewStatus } from "../../app/features/settings/interview/interviewListSlice";
import { fetchCityById } from "@/app/features/settings/city/getCityByIdSlice";
import { getParamValue } from "@/libs/utils";
import Pagination from "../pagination/pagination";
import CheckboxField from "../checkbox-field/checkbox-field";
import { fetchFilterData } from "../../app/features/employees/employeeFilterDataSlice";
import { fetchInterviewLocations } from "../../app/features/settings/interview/interviewListSlice"; // Adjust the path if needed
import {
  createInterviewLocation,
  updateInterviewLocation,
} from "../../app/features/settings/interview/interviewListSlice"; // Adjust the path if needed
import {
  fetchInterviewById,
  resetInterviewDetail,
} from "../../app/features/settings/interview/getInterviewByIdSlice";

type ToastState = {
  message: string | string[];
  type: string;
};

export default function InterviewSettingsTab() {
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
    interviewLocation: "",
    interviewLocationStatus: "1",
  });

  useEffect(() => {
    dispatch(fetchInterviewLocations({}));
    dispatch(fetchFilterData());
  }, [dispatch]);

  const {
    interviewLocations: interviewList,
    loading: interviewListLoading,
    currentPage,
    lastPage,
    perPage,
    total,
    fromPage,
    toPage,
  } = useSelector((state: RootState) => state.interviewList);
  const { creationLoading, creationMessage, creationStatus } = useSelector(
    (state: RootState) => state.interviewList
  );

  const { interview: interviewDetail } = useSelector(
    (state: RootState) => state.interviewDetail
  );

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
    city: fetchedCity,
    loading: fetchedCityLoading,
    error: fetchedCityError,
  } = useSelector((state: RootState) => state.cityDetail);

  //   const {
  //     creationLoading: cityCreationLoading,
  //     creationError: cityCreationError,
  //     cityCreation: createdCity,
  //     creationMessage: cityCreationSuccessMessage,
  //     creationStatus,
  //   } = useSelector((state: RootState) => state.cityList);

  // For city listing
  //   const {
  //     cities: cityListing,
  //     listLoading: cityListingLoading,
  //     listError: cityListingError,
  //     listMessage: cityListingMessage,

  //   } = useSelector((state: RootState) => state.cityList);

  const fetchPage = (pageNumber: number) => {
    const params = {
      page: pageNumber,
    };
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value != null && String(value) != ""
      )
    );
    dispatch(fetchInterviewLocations(filteredParams as any)); // if needed, type assertion here
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
      interviewLocation: "",
      interviewLocationStatus: "1",
    });
  };

  useEffect(() => {
    if (interviewDetail) {
      setFormState({
        interviewLocation: interviewDetail.name,
        interviewLocationStatus: interviewDetail.status.toString() || "",
      });
    }
  }, [interviewDetail]);

  useEffect(() => {
    if (showUpdateBtn === false) {
      resetForm();
    }
  }, [showUpdateBtn]);

  useEffect(() => {
    let toastMessage = "";
    let toastType = "";
  
    if (creationStatus) {
      toastMessage = creationMessage || "Created successfully!";
      toastType = "success";
      dispatch(fetchInterviewLocations({}));
      setShowUpdateBtn(false);
      resetForm();
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetInterviewStatus());
    } else if (creationStatus === false) {
      toastMessage = creationMessage  || "Something went wrong!";
      toastType = "fail";
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetInterviewStatus());
    }
  
  }, [creationStatus]);
  

  const fields = [
    {
      type: "input" as FieldType,
      name: "interviewLocation",
      label: t("interviewLocation"),
      value: formState.interviewLocation,
      placeholder: t("interviewLocation"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },

    {
      type: "radio" as FieldType,
      label: t("status"),
      name: "interviewLocationStatus",
      selectedValue: formState.interviewLocationStatus,
      options: [
        { value: "1", label: "有効" },
        { value: "0", label: "無効" },
      ],
      onChange: handleInputChange,
      // className: Style.radioThirdRow,
    },
  ];

  const handleSubmit = () => {
    const locationData = {
      name: String(formState.interviewLocation),
      status: String(formState.interviewLocationStatus),
    };
    if (showUpdateBtn === false) {
      // Dispatching the action to create the city
      dispatch(createInterviewLocation(locationData)).then(() =>
        dispatch(fetchInterviewLocations({}))
      );
    }
    if (showUpdateBtn === true) {
      const id = Number(getParamValue("id"));
      dispatch(updateInterviewLocation({ id, data: locationData }));
    }
  };

  const columns = [
    { header: `${t("interviewLocation")}`, accessor: "name" },
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
    router.push(`/settings/interview?id=${id}`);
    dispatch(fetchInterviewById(id)).then(() => setShowUpdateBtn(true));
  };
  const renderLink = (baseName: string, id: number) => {
    return (
      <span onClick={() => handleLinkClick(id)} className="text-link">
        {baseName}
      </span>
    );
  };

  let updatedInterviewListing = interviewList?.map((item) => ({
    ...item,
    status: renderStatus(String(item?.status)),
    name: renderLink(String(item?.name), Number(item?.id)),
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

    dispatch(fetchInterviewLocations({ ...otherParams, ...sortParam }));
  };

  
  const handleRowLimitChange = (newLimit: string) => {
    const sortParam: { sort_asc?: string; sort_desc?: string } = sortDirection === "asc"
      ? { sort_asc: sortColumn }
      : { sort_desc: sortColumn };
      const otherParams = {
        page: currentPage ?? undefined,
        limit: Number(newLimit),
      };
      dispatch(fetchInterviewLocations({ ...otherParams, ...sortParam }));
  };

  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetInterviewStatus());
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
      {/* <HeadingRow headingTitle={t("interviewSettings")}></HeadingRow> */}
      <div className={settingStyles.formContainer}>
        <GenericForm
          fields={fields}
          onSubmit={handleSubmit}
          isLoading={creationLoading ?? undefined}
          submitButtonLabel={`${t("register")}`}
          showResetButton={true}
          showResetLabel={t("フォームをリセットする")}
          onReset={resetForm}
          parentClassName={Style.createFormWrapper}
          buttonClassName={settingStyles.formCreateBtn}
          disabledSubmitBtn={toast.message == '面談場所が登録されました。' && toast.type == 'success' ? true :false}
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
          data={updatedInterviewListing}
          loading={interviewListLoading}
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
