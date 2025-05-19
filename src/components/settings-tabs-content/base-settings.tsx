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
import { resetBaseListCreationStatus } from "@/app/features/settings/city/cityListingSlice";
import { fetchCityById } from "@/app/features/settings/city/getCityByIdSlice";
import { getParamValue } from "@/libs/utils";
import Pagination from "../pagination/pagination";

type ToastState = {
  message: string | string[];
  type: string;
};

export default function BaseSettingsTab() {
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
    baseCode: "",
    baseName: "",
    status: "1",
  });

  useEffect(() => {
    dispatch(fetchCities({}));
  }, [dispatch]);

  const {
    city: fetchedCity,
    loading: fetchedCityLoading,
    error: fetchedCityError,
  } = useSelector((state: RootState) => state.cityDetail);

  const {
    creationLoading: cityCreationLoading,
    creationError: cityCreationError,
    cityCreation: createdCity,
    creationMessage: cityCreationSuccessMessage,
    creationStatus,
  } = useSelector((state: RootState) => state.cityList);

  // For city listing
  const {
    cities: cityListing,
    listLoading: cityListingLoading,
    listError: cityListingError,
    listMessage: cityListingMessage,
    currentPage,
    lastPage,
    perPage,
    total,
    fromPage,
    toPage,
  } = useSelector((state: RootState) => state.cityList);

  const fetchPage = (pageNumber: number| null) => {
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

    dispatch(fetchCities(filteredParams as any)); // if needed, type assertion here
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
      baseCode: "",
      baseName: "",
      status: "1",
    });
  };

  useEffect(() => {
    if (fetchedCity) {
      setFormState({
        baseCode: fetchedCity.code || "",
        baseName: fetchedCity.name,
        status: fetchedCity.status.toString() || "",
      });
    }
  }, [fetchedCity]);

  useEffect(() => {
    if (showUpdateBtn === false) {
      resetForm();
    }
  }, [showUpdateBtn]);

  useEffect(() => {
    let toastMessage = "";
    let toastType = "";
  
    if (creationStatus) {
      toastMessage = cityCreationSuccessMessage || "Created successfully!";
      toastType = "success";
      dispatch(fetchCities({}));
      setShowUpdateBtn(false);
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetBaseListCreationStatus());
    } else if (creationStatus === false) {
      toastMessage = cityCreationSuccessMessage || "Something went wrong!";
      toastType = "fail";
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetBaseListCreationStatus());
    }
  
   
  
    // Removed automatic hiding of the toast.
    // The toast will now stay visible until manually dismissed by the user.
  
  }, [cityCreationSuccessMessage, creationStatus, dispatch]);

  const fields = [
    {
      type: "input" as FieldType,
      name: "baseCode",
      label: t("baseCode"),
      value: formState.baseCode,
      placeholder: t("baseCode"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "input" as FieldType,
      name: "baseName",
      value: formState.baseName,
      placeholder: t("area"),
      label: t("area"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "radio" as FieldType,
      label: t("status"),
      name: "status",
      selectedValue: formState.status,
      options: [
        { value: "1", label: "有効" },
        { value: "0", label: "無効" },
      ],
      onChange: handleInputChange,
      className: Style.radioBtnField,
    },
  ];

  const handleSubmit = () => {
    const newCity = {
      name: formState.baseName,
      code: formState.baseCode,
      status: formState.status,
    };
    if (showUpdateBtn === false) {
      // Dispatching the action to create the city
      dispatch(createCity(newCity));
    }
    if (showUpdateBtn === true) {
      const id = Number(getParamValue("id"));

      dispatch(updateCity({ newCity, id }));
    }
  };

  const columns = [
    { header: `${t("baseCode")}`, accessor: "baseCode" },
    { header: `${t("area")}`, accessor: "baseName" },
    { header: `${t("status")}`, accessor: "status" },
  ];

  const renderStatus = (status: string) => {
    return (<>
      {
        status == "有効" ? <>
          <span className="cust-tag active-tag">
            {/* <Image
              src={`/assets/images/true.png`}
              alt="status icon"
              width={15}
              height={15}
            />
            &nbsp; &nbsp; */}
            {status}
          </span>
        </> : <>
          <span className="cust-tag block-tag">
            {/* <Image
              src={`/assets/images/false.png`}
              alt="status icon"
              width={15}
              height={15}
            />
            &nbsp; &nbsp; */}
            {status}
          </span>
        </>
      }
    </>
    );
  };
  const handleLinkClick = (id: number) => {
    router.push(`/settings?id=${id}`);
    dispatch(fetchCityById(id)).then(() => setShowUpdateBtn(true));
  };
  const renderLink = (baseName: string, id: number) => {
    return (
      <span onClick={() => handleLinkClick(id)} className="text-link">
        {baseName}
      </span>
    );
  };

  let updatedCityListing = cityListing?.map((city) => ({
    ...city,
    status: renderStatus(String(city?.status)),
    baseName: renderLink(String(city?.baseName), Number(city?.baseId)),
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

    dispatch(fetchCities({ ...otherParams, ...sortParam }));
  };
  

  const handleRowLimitChange = (newLimit: string) => {
    const sortParam: { sort_asc?: string; sort_desc?: string } = sortDirection === "asc"
      ? { sort_asc: sortColumn }
      : { sort_desc: sortColumn };
      const otherParams = {
        page: currentPage ?? undefined,
        limit: Number(newLimit),
      };
      dispatch(fetchCities({ ...otherParams, ...sortParam }));
  };

  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetBaseListCreationStatus());
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
      {/* <HeadingRow headingTitle={t("baseSettings")}></HeadingRow> */}
      <div className={`${settingStyles.formContainer} mt-2`}>
        <GenericForm
          fields={fields}
          onSubmit={handleSubmit}
          isLoading={cityCreationLoading}
          submitButtonLabel={`${t("register")}`}
          showResetButton={true}
          showResetLabel={t("フォームをリセットする")}
          onReset={resetForm}
          parentClassName={Style.createFormWrapper}
          buttonClassName={settingStyles.formCreateBtn}
          disabledSubmitBtn={toast.message == 'エリアが登録されました。' && toast.type == 'success' ? true :false}
        />
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
          data={updatedCityListing}
          loading={cityListingLoading}
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
