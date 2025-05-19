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
import HeadingBreadcrumb from "@/components/heading-breadcrumb/heading-breadcrumb";

import {
  fetchCities,
  updateCity,
} from "@/app/features/settings/city/cityListingSlice";
import Image from "next/image";
import { createCity } from "@/app/features/settings/city/cityListingSlice";
import {
  createOffice,
  updateOffice,
} from "@/app/features/settings/office/officeListingSlice";
import { resetOfficeStatus } from "@/app/features/settings/office/officeListingSlice";
import { fetchCityById } from "@/app/features/settings/city/getCityByIdSlice";
import { getParamValue } from "@/libs/utils";
import Pagination from "../pagination/pagination";
import CheckboxField from "../checkbox-field/checkbox-field";
import { fetchFilterData } from "../../app/features/employees/employeeFilterDataSlice";
import { fetchOffices } from "@/app/features/settings/office/officeListingSlice";
import { statusValidInvalidOptions } from "@/libs/optionsHandling";
import {
  fetchOfficeById,
  resetOfficeDetail,
} from "@/app/features/settings/office/getOfficeByIdSlice"; // Adjust the path
import { usePostCodeLookup } from "@/hooks/postCodeHook/postCodeHook";
import { showOfficeTag } from "@/libs/utils";


type ToastState = {
  message: string | string[];
  type: string;
};

export default function OfficeSettingsTab() {
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
  const [defaultCheckboxValues, setDefaultCheckboxValues] = useState<string[]>(
    []
  );
  const [formState, setFormState] = useState({
    officeCity: "",
    officeDepartments: "",
    office: "",
    fax: "",
    officeCode: "",
    officePostCode: "",
    officePrefectures: "",
    officeAddress: "",
    officeAddress2: "",
    officeTelephoneNumber: "",
    officeRepresentative: "",
    officeStatus: "1",
    position: "",
  });


  // const { prefCode: prefCodeApi, address: addressApi } = usePostCodeLookup(
  //   formState.officePostCode
  // );
  const [checkboxError, setCheckboxError] = useState<string | null>(null);


  // useEffect(() => {
  //   if (prefCodeApi || addressApi) {
  //     setFormState((prevState) => ({
  //       ...prevState,
  //       officePrefectures: prefCodeApi || prevState.officePrefectures,
  //       officeAddress: addressApi || prevState.officeAddress

  //     }));
  //   }
  // }, [prefCodeApi, addressApi]);

  useEffect(() => {
    dispatch(fetchOffices({}));
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
    office: fetchedOffice,
    loading: fetchedOfficeLoading,
    error: fetchedOfficeError,
  } = useSelector((state: RootState) => state.officeDetail);

  const {
    creationLoading: cityCreationLoading,
    creationError: cityCreationError,
    creationMessage: cityCreationSuccessMessage,
    creationStatus,
  } = useSelector((state: RootState) => state.officeList);

  // For city listing
  const {
    offices: cityListing,
    loading: cityListingLoading,
    message: cityListingMessage,
    currentPage,
    lastPage,
    perPage,
    total,
    fromPage,
    toPage,
  } = useSelector((state: RootState) => state.officeList);

  const fetchPage = (pageNumber: number) => {

    const params = {
      page: pageNumber,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value != null && String(value) != ""
      )
    );

    dispatch(fetchOffices(filteredParams as any)); // if needed, type assertion here
  };

  const [postcode, setPostcode] = useState("");

  const { prefCode: prefCodeApi, address: addressApi } = usePostCodeLookup(postcode);

  useEffect(() => {
    if (prefCodeApi || addressApi) {
      setFormState((prevState) => ({
        ...prevState,
        officePrefectures: prefCodeApi || prevState.officePrefectures,
        officeAddress: addressApi || prevState.officeAddress,
      }));
    }
  }, [prefCodeApi, addressApi]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name) {
        if (name === "officePostCode") {
      setPostcode(value);
    }
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };

  const resetForm = () => {
    setFormState({
      officeCity: "",
      office: "",
      officeCode: "",
      officePostCode: "",
      officePrefectures: "",
      officeAddress: "",
      officeAddress2: "",
      officeTelephoneNumber: "",
      officeRepresentative: "",
      officeStatus: "1",
      officeDepartments: "",
      position: "",
      fax: "",
    });
    setDefaultCheckboxValues([]);
  };

  useEffect(() => {
    if (fetchedOffice) {
      setFormState({
        officeCity: String(fetchedOffice?.cityId),
        office: fetchedOffice?.name,
        officeCode: fetchedOffice?.officeCode,
        officePostCode: String(fetchedOffice?.code),
        officePrefectures: String(fetchedOffice?.prefectures),
        officeAddress: fetchedOffice?.address,
        officeAddress2: fetchedOffice?.address2,
        officeTelephoneNumber: fetchedOffice?.telephoneNumber,
        officeRepresentative: fetchedOffice?.representative,
        officeStatus: fetchedOffice?.status.toString(),
        officeDepartments: fetchedOffice?.departments.join(", "),
        position: fetchedOffice?.representativePosition,
        fax: fetchedOffice?.fax,
      });
      setDefaultCheckboxValues(fetchedOffice?.departments);
    }
  }, [fetchedOffice]);

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
      dispatch(fetchOffices({}));
      // setShowUpdateBtn(false);
      // resetForm();
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetOfficeStatus());
    } else if (creationStatus === false) {
      toastMessage = cityCreationSuccessMessage || "Something went wrong!";
      toastType = "fail";
      setToast({ message: toastMessage, type: toastType });
      dispatch(resetOfficeStatus());
    }



  }, [creationStatus]);


  const fields = [
    {
      type: "select" as FieldType,
      name: "officeCity",
      label: t("area"),
      value: formState.officeCity,
      placeholder: t("base"),
      onChange: handleInputChange,
      validation: ["required"],
      options: cities,
      tag: t("required")
    },
    {
      type: "input" as FieldType,
      name: "office",
      label: t("office"),
      value: formState.office,
      placeholder: t("office"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "input" as FieldType,
      name: "officeCode",
      label: t("officeCode"),
      value: formState.officeCode,
      placeholder: t("officeCode"),
      onChange: handleInputChange,
      validation: ["required"],
      className: Style.officeCodeField,
      tag: t("required")
    },
    {
      type: "input" as FieldType,
      name: "officePostCode",
      label: t("postCode"),
      value: formState.officePostCode,
      placeholder: t("postCode"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "select" as FieldType,
      name: "officePrefectures",
      label: t("prefectures"),
      value: formState.officePrefectures,
      options: prefectures,
      placeholder: t("prefectures"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "input" as FieldType,
      name: "officeAddress",
      label: t("address"),
      value: formState.officeAddress,
      placeholder: t("address"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "input" as FieldType,
      name: "officeAddress2",
      label: t("address") + 2,
      value: formState.officeAddress2,
      placeholder: t("address") + 2,
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "input" as FieldType,
      name: "officeTelephoneNumber",
      label: t("telephoneNumber"),
      value: formState.officeTelephoneNumber,
      placeholder: t("telephoneNumber"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "input" as FieldType,
      name: "fax",
      label: t("fax"),
      value: formState.fax,
      placeholder: t("fax"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "input" as FieldType,
      name: "position",
      label: t("title"),
      value: formState.position,
      placeholder: t("title"),
      onChange: handleInputChange,
      className: Style.positionField,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "input" as FieldType,
      name: "officeRepresentative",
      label: t("representative"),
      value: formState.officeRepresentative,
      placeholder: t("representative"),
      onChange: handleInputChange,
      validation: ["required"],
      tag: t("required")
    },
    {
      type: "radio" as FieldType,
      label: t("status"),
      name: "officeStatus",
      selectedValue: formState.officeStatus,
      options: statusValidInvalidOptions,
      onChange: handleInputChange,
      className: Style.officeStatusField,
    },
  ];

  const handleSubmit = () => {
    if (defaultCheckboxValues.length == 0) {
      setCheckboxError(t("At least one department must be selected."));
      return;
    }

    const officeData = {
      city_id: parseInt(formState.officeCity, 10),
      prefecture_id: formState.officePrefectures
        ? parseInt(formState.officePrefectures, 10)
        : null,
      name: formState.office,
      phone: formState.officeTelephoneNumber,
      representative: formState.officeRepresentative,
      post_code: formState.officePostCode ? formState.officePostCode : null,
      position: formState.position ? formState.position : null,
      office_code: formState.officeCode ? formState.officeCode : null,
      address: formState.officeAddress ? formState.officeAddress : null,
      address2: formState.officeAddress2 ? formState.officeAddress2 : null,
      fax: formState.fax ? formState.fax : null,
      status: parseInt(formState.officeStatus, 10),
      departments: defaultCheckboxValues?.filter((item) => item !== ""),
    };

    if (showUpdateBtn === false) dispatch(createOffice(officeData as any));

    if (showUpdateBtn === true) {
      const id = Number(getParamValue("id"));
      dispatch(updateOffice({ id, officeData }));
    }
  };

  const columns = [
    { header: `${t("baseCode")}`, accessor: "baseCode" },
    { header: `${t("area")}`, accessor: "baseName" },
    { header: `${t("officeCode")}`, accessor: "officeCode" },
    { header: `${t("office")}`, accessor: "officeName" },
    { header: `${t("department")}`, accessor: "departments" },
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
    router.push(`/settings/office?id=${id}`);
    dispatch(fetchOfficeById(id)).then(() => setShowUpdateBtn(true));
  };
  const renderLink = (officeName: string, id: number) => {
    return (
      <span onClick={() => handleLinkClick(id)} className="text-link">
        {officeName}
      </span>
    );
  };

  function getTypeBadges(types: string[]) {
    return (
      <div>
        {types?.map((type) => {
          switch (type) {
            case "1":
              return (
                <span key={type} className="badge bg-tax">
                  {t("taxDepartment")}
                </span>
              );
            case "2":
              return (
                <span key={type} className="badge bg-legal">
                  {t("legalDepartment")}
                </span>
              );
            case "3":
              return (
                <span key={type} className="badge bg-insurance">
                  {t("insuranceDepartment")}
                </span>
              );
            default:
              return null;
          }
        })}
      </div>
    );
  }

  let updatedCityListing = cityListing?.map((item) => ({
    ...item,
    status: renderStatus(String(item?.status)),
    officeName: renderLink(String(item?.officeName), Number(item?.id)),
    departments: getTypeBadges(item?.departments),
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

    dispatch(fetchOffices({ ...otherParams, ...sortParam }));
  };


  const handleRowLimitChange = (newLimit: string) => {
    const sortParam: { sort_asc?: string; sort_desc?: string } = sortDirection === "asc"
      ? { sort_asc: sortColumn }
      : { sort_desc: sortColumn };
    const otherParams = {
      page: currentPage ?? undefined,
      limit: Number(newLimit),
    };
    dispatch(fetchOffices({ ...otherParams, ...sortParam }));
  };

  const handleCheckboxChange = (values: string[]) => {
    setDefaultCheckboxValues(values);
  };
  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetOfficeStatus());
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
      {/* <HeadingRow headingTitle={t("officeSettings")}></HeadingRow> */}
      <div className={`${settingStyles.officeFormContainer} mt-1`}>
        <GenericForm
          fields={fields}
          onSubmit={handleSubmit}
          isLoading={cityCreationLoading}
          submitButtonLabel={`${t("register")}`}
          showResetButton={true}
          showResetLabel={t("フォームをリセットする")}
          onReset={resetForm}
          parentClassName={Style.officeFormWrapper}
          buttonClassName={settingStyles.formCreateBtn}
          checkboxErrorReq={defaultCheckboxValues}
          setCheckboxErrorMsg={setCheckboxError}
          onChangeCheckBox={handleCheckboxChange}
          disabledSubmitBtn={toast.message == 'オフィスが登録されました。' && toast.type == 'success' ? true :false}
        >
          <CheckboxField
            label={`${t("department")}`}
            name="departments"
            options={departments}
            selectedValues={defaultCheckboxValues}
            onChange={handleCheckboxChange}
            className="departmentTypeField"
            validation={["required"]}
            errorText={checkboxError}
            tag= {t("required")}
          />
        </GenericForm>
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
