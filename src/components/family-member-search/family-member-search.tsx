import React, { useEffect } from "react";
import InputField from "../input-field/input-field";
import Style from "../../styles/components/molecules/search-modal.module.scss";
import InquiryStyle from "@/styles/pages/inquiry.module.scss";
import plus from "../../../public/assets/svg/userAdd.svg";
import Image from "next/image";
import close from "../../../public/assets/svg/modalClose.svg";
import { useLanguage } from "@/localization/LocalContext";
import GenericForm, { FieldType } from "@/components/generic-form/generic-form";
import { useState } from "react";
import { statusValidInvalidOptions } from "@/libs/optionsHandling";
import { searchForOptions } from "@/libs/optionsHandling";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/app/store";
import { fetchCustomers, resetCustomerSearchStatus } from "@/app/features/insurance/customerSearchSlice";
import TableBuddy from "../table-buddy/table-buddy";
import Button from "../button/button";
import Pagination from "../pagination/pagination";
import router from "next/router";

interface Props {
  onClose?: (customer?: any) => void;
  hideRadio?: true;
}
interface Customer {
  familyCode: string;
  personalCode: string;
  firstLastName: string;
  phone: string;
  selectBtn: React.ReactNode | string;
}

const FamilyMemberSearchModal: React.FC<Props> = ({ onClose, hideRadio }) => {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    familyCode: "",
    personalCode: "",
    lastFirstName: "",
    telephoneNumber: "",
    email: "",
    searchFor: "customer",
  });
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">(
    "asc"
  );
  const [recordLimit, setRecordLimit] = useState("50");
  const dispatch = useDispatch<AppDispatch>();

  const { customers, loading, error, message, success, currentPage,
    lastPage,
    perPage,
    total,
    fromPage,
    toPage, } = useSelector(
      (state: RootState) => state.customerSearch
    );

    useEffect(() => {
      return () =>{
        dispatch(resetCustomerSearchStatus())
      }
    },[])

  // console.log('customers', customers)
  const columns = [
    { header: `${t("familyCode")}`, accessor: "familyCode" },
    { header: `${t("personalCode")}`, accessor: "personalCode" },
    { header: `${t("lastFirstName")}`, accessor: "firstLastName" },
    { header: `${t("telephoneNumber")}`, accessor: "phone" },
    { header: `${t("email")}`, accessor: "email" },
    { header: `${t("")}`, accessor: "selectBtn" },
  ];

  useEffect(() => {
    // dispatch(fetchCustomers({}))
  }, [])
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
  const handleCustomSelect = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormState({
      ...formState,
      lastFirstName: e.target.value,
    });
  };

  const fields = [
    {
      type: "input" as FieldType,
      name: "familyCode",
      value: formState.familyCode,
      onChange: handleInputChange,
    },
    {
      type: "input" as FieldType,
      name: "personalCode",
      value: formState.personalCode,
      onChange: handleInputChange,
    },
    {
      type: "input" as FieldType,
      name: "lastFirstName",
      value: formState.lastFirstName,
      onChange: handleInputChange,
    },

    {
      type: "input" as FieldType,
      name: "telephoneNumber",
      value: formState.telephoneNumber,
      onChange: handleInputChange,
    },
    {
      type: "input" as FieldType,
      name: "email",
      value: formState.email,
      onChange: handleInputChange,
    },
    {
      type: "radio" as FieldType,
      name: "searchFor",
      options: searchForOptions,
      value: formState.searchFor,
      onChange: handleInputChange,
      placeholder: t("chooseOptions"),
      className: Style.searchForRadio,
      selectedValue: formState.searchFor,
      hidden: hideRadio,
    },
  ];

  const handleSubmit = () => {
    const params = {
      family_code: formState.familyCode,
      personal_code: formState.personalCode,
      first_last_name: formState.lastFirstName,
      email: formState.email,
      phone: formState.telephoneNumber,
      search_for: formState.searchFor,
    };
    dispatch(fetchCustomers(params));
  };

  const OnClickSelectBtn = (customer: Customer) => {
    onClose && onClose(customer);
  };

  // useEffect(() => {
  //   const handleRouteChange = () => {
  //     alert('ohoo')
  //     onClose && onClose(null)
  //   };

  //   router.events.on("routeChangeComplete", handleRouteChange);

  //   return () => {
  //     router.events.off("routeChangeComplete", handleRouteChange);
  //   };
  // }, [router.events]);

  const createBtn = (text: string, item: Customer): React.ReactNode => {
    return (
      <Button
        text={t(`${text}`)}
        type="secondary"
        size="small"
        onClick={() => OnClickSelectBtn(item)}
      />
    );
  };

  let updatedCustomer = customers?.map((item: any) => ({
    ...item,
    selectBtn: createBtn(String(item?.selectBtn), item),
  }));

  const handleFormReset = () => {
    setFormState({
      familyCode: "",
      personalCode: "",
      lastFirstName: "",
      telephoneNumber: "",
      email: "",
      searchFor: "customer",
    });
    dispatch(fetchCustomers({}));
  };


  const fetchPage = (pageNumber: number) => {
    let params: {
      family_code?: string;
      personal_code?: string;
      first_last_name?: string;
      email?: string;
      phone?: string;
      search_for?: string;
      sort_asc?: any; // include this
      sort_desc?: any; // and this
      limit?: any; // and this
      page?: any; // and this
    } = {
      family_code: formState.familyCode,
      personal_code: formState.personalCode,
      first_last_name: formState.lastFirstName,
      email: formState.email,
      phone: formState.telephoneNumber,
      search_for: formState.searchFor,
      page: pageNumber,
      limit: recordLimit,
    };

    // If sortColumn is set, then add the appropriate sort parameter
    if (sortColumn) {
      if (sortDirection === "asc") {
        params.sort_asc = sortColumn;
      } else {
        params.sort_desc = sortColumn;
      }
    }

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value != null && value !== ""
      )
    );

    dispatch(fetchCustomers(filteredParams as any)); // if needed, type assertion here
  };


  const handleRowLimitChange = (newLimit: string) => {
    setRecordLimit(newLimit);

    const params = {
      family_code: formState.familyCode,
      personal_code: formState.personalCode,
      first_last_name: formState.lastFirstName,
      email: formState.email,
      phone: formState.telephoneNumber,
      search_for: formState.searchFor,
      limit: newLimit,
    };

    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(
        ([key, value]) => value != null && value !== ""
      )
    );
    dispatch(fetchCustomers(filteredParams));

  };


  return (
    <div className={Style.modalOverlay}>
      <div className={Style.modalContent}>
        <div className={`${Style.modalHeader} ${Style.justify_center} p-0 mb-3`}>
          {/* <p>{t("customerSearch")}</p> */}
          <Button
            onClick={() => onClose?.(false)} className={Style.closeButton}
            icon={
              <Image src={close} alt="Close Icon" width={15} height={20} />
            }
          />
          {/* <button onClick={() => onClose?.()} className={Style.closeButton}>
            X
          </button> */}
          <h5 className="text-center mt-2 mb-1"><b>{t("相続人検索")}</b></h5>
        </div>

        <div className={Style.searchCustomerFieldsWrapper}>
          {/* <Button
            text={t('createNew')}
            size="small"
            type="primary"
            href="/customer/create"
            className={Style.customerCreateBtn}
            icon={
              <Image src={plus} alt="Plus Icon" width={18} height={20} />
            }
          /> */}
          <div className="h-100"></div>
          <div>
            <GenericForm
              fields={fields}
              onSubmit={handleSubmit}
              buttonClassName={Style.CustomerSrchBtn}
              showResetButton={true}
              onReset={handleFormReset}
              showResetLabel="reset"
              ResetBtnClassName={Style.CustomerSrchResetBtn}
              submitButtonLabel={`${t("search")}`}
              isLoading={loading}
              parentClassName={Style.customerSrchFilterWrapper}
            >
              <label className={`${Style.fieldLabel} ${Style.fieldLabel1}`}>
                {t("familyCode")}
              </label>
              <label className={`${Style.fieldLabel} ${Style.fieldLabel2}`}>
                {t("personalCode")}
              </label>
              <label className={`${Style.fieldLabel} ${Style.fieldLabel3}`}>
                {t("lastFirstName")}
              </label>
              <label className={`${Style.fieldLabel} ${Style.fieldLabel4}`}>
                {t("telephoneNumber")}
              </label>
              <label className={`${Style.fieldLabel} ${Style.fieldLabel5}`}>
                {t("email")}
              </label>
              {!hideRadio && <label className={`${Style.fieldLabel} ${Style.fieldLabel6}`}>
                {t("searchFor")}
              </label>}
            </GenericForm>
          </div>

          <div className={`${Style.tableBuddySection} mt-3`}>
            <div className={`${InquiryStyle.paginationMargin} mb-1`}>
              <Pagination
                currentPage={currentPage}
                lastPage={lastPage}
                onFirst={() => fetchPage(1)}
                onLast={() => fetchPage(lastPage)}
                onPrev={() => fetchPage(currentPage - 1)}
                onNext={() => fetchPage(currentPage + 1)}
                totalNumber={total}
                fromPage={fromPage}
                toPage={toPage}
                onPageClick={(page: number) => fetchPage(page)}
                onRowLimitChange={handleRowLimitChange}
                recordLimit={recordLimit}
              />
            </div>
            <TableBuddy
              columns={columns}
              data={updatedCustomer as any}
              loading={loading}
              stickyHeaders={false}
            // onSort={handleSort}
            // sortedColumn={sortColumn}
            // sortDirection={sortDirection} 
            />

          </div>
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onFirst={() => fetchPage(1)}
            onLast={() => fetchPage(lastPage)}
            onPrev={() => fetchPage(currentPage - 1)}
            onNext={() => fetchPage(currentPage + 1)}
            totalNumber={total}
            fromPage={fromPage}
            toPage={toPage}
            onPageClick={(page: number) => fetchPage(page)}
            onRowLimitChange={handleRowLimitChange}
            recordLimit={recordLimit}
          />
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberSearchModal;
