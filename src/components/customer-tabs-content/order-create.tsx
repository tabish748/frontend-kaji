import React, { useEffect, useState, useRef, useCallback } from "react";
import Button from "../button/button";
import Style from "../../styles/pages/customer-create.module.scss";
import close from "../../../public/assets/svg/modalClose.svg";
import { useLanguage } from "../../localization/LocalContext";
import GenericForm, { FieldType } from "@/components/generic-form/generic-form";
import { useDispatch, useSelector } from "react-redux";
import Toast from "@/components/toast/toast";
import { AppDispatch, RootState } from "../../app/store";
import { useRouter } from "next/router";
import settingStyles from "../../styles/pages/settings.module.scss";
import { Form } from "../form/form";
import Pagination from "../pagination/pagination";
import InputDateField from "../input-date/input-date";
import InputField from "../input-field/input-field";
import ToggleButton from "../toggle-button/toggle-button";
import Image from "next/image";
import SelectField from "../select-field/select-field";
import { PlusIcon } from "@/libs/svgIcons";
import {
  monthOptions,
  dayOptions,
  yearOptions,
  genderOptions,
  phoneTypeOptions,
} from "@/libs/optionsHandling";
import { fetchInsuranceDropdowns } from "@/app/features/insurance/insuranceDropdownSlice";
import RadioField from "../radio-field/radio-field";
import CustomSelectField from "../custom-select/custom-select";
import TextAreaField from "../text-area/text-area";
import CustomerOrderForm from "./customer-order-form";
import { fetchCustomerOrders } from "@/app/features/customers/customerOrderListingSlice";
import { addCommas, getParamValue } from "@/libs/utils";
import { fetchFamilyMembers } from "@/app/features/generals/getFamilyMembersDropdownSlice";
import PropertyOrderForm from "./property-order-form";
import { fetchUsersDropdown } from "@/app/features/generals/getUsersDropdownSlice";
import {
  createProperty,
  resetPropertyCreateState,
} from "@/app/features/customers/propertyCreateSlice";
import FullscreenLoader from "../loader/loader";
import { fetchFamilyCodes } from "@/app/features/generals/getFamilyCodesDropdownSlice";
import { resetCustomerOrderSaveState } from "@/app/features/customers/customerOrderSaveSlice";

interface FormObject {
  id: string;
  // Add any other properties that each form object should have
}
interface FetchCustomerOrdersParams {
  familyCodesId: string;
  familyMemberId?: string | null;
}
type ToastState = {
  message: string | string[];
  type: string;
};
interface OrderCategories {
  sozoku: any;
  legal: any;
  insurance: any;
  property: any;
  // ... other categories if there are any
}
interface CustomerOrderState {
  orders: OrderCategories; // Update this line if your orders state is structured like this
  // ... other properties
}
interface CustomerOrder {
  // ... other properties
  order_amount?: string;
  insurance?: any;
}

interface FormData {
  // Define the structure of your form data here
  // For example:
  property: string;
  value: string;
  // Add other properties as needed
}
export default function OrderCreateTab() {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [propertyFormsData, setPropertyFormsData] = useState<FormData[]>([]);
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [formState, setFormState] = useState({
    familyCode: "",
    familyMemberCode: "",
    totalOrderAmount: "",
  });
  const [errors, setErrors] = useState<any>([]);

  const [modalForms, setModalForms] = useState([{ id: "form-0" }]);
  const [localLoading, setLocalLoading] = useState(false);

  const handleFormDataChange = useCallback(
    (index: number, formData: FormData) => {
      setPropertyFormsData((prevData) => {
        const newData = [...prevData];
        newData[index] = formData;
        return newData;
      });
    },
    []
  );

  
  const addNewFormToModal = () => {
    setModalForms((prevForms) => [
      ...prevForms,
      {
        id: `form-${prevForms.length}`,
      },
    ]);
  };

  const handleRemoveForm = (formIndex: number) => {
    setModalForms((currentForms) =>
      currentForms.filter((_, index) => index !== formIndex)
    );

    setPropertyFormsData((currentData) =>
      currentData.filter((_, index) => index !== formIndex)
    );
  };

  const dispatch = useDispatch<AppDispatch>();
  const users = useSelector((state: RootState) => state.usersDropdown.users);

  useEffect(() => {
    const fc = getParamValue("familyCode");
    if (fc != null) {
      dispatch(
        fetchCustomerOrders({ familyCodesId: fc, familyMemberId: null })
      );
      dispatch(fetchFamilyMembers(fc));
    }

    dispatch(fetchUsersDropdown());
    const id = getParamValue("id");
    if (id) dispatch(fetchFamilyCodes(id));
  }, [dispatch]);
  const familyCodes = useSelector(
    (state: RootState) => state.familyCodes.familyCodes
  );

  const {
    loading: propertyCreateLoading,
    status: propertyCreateStatus,
    message: propertyCreateMessage,
    errorMessages: propertyCreateErrorMsg,
  } = useSelector((state: RootState) => state.propertyCreate);

  useEffect(() => {
    if (propertyCreateStatus === true) {
      setToast({
        message: propertyCreateMessage || "Property Created successfully!",
        type: "success",
      });
      setShowModal(false);
      const fc = getParamValue("familyCode");
      if (fc != null) {
        const params = {
          familyCodesId: fc,
        };
        dispatch(fetchCustomerOrders(params));
      }
      dispatch(resetPropertyCreateState());

    } else if (propertyCreateErrorMsg && propertyCreateErrorMsg.length > 0) {
      setToast({
        message: propertyCreateErrorMsg,
        type: "fail",
      });
      dispatch(resetPropertyCreateState());
    }

  }, [
    dispatch,
    propertyCreateStatus,
    propertyCreateErrorMsg,
    propertyCreateMessage,
  ]);


  const familyMembers = useSelector(
    (state: RootState) => state.familyMembers.familyMembers
  );
  const { orders, loading } = useSelector(
    (state: RootState) => state.customerOrderList
  );

  useEffect(() => {
    if (orders) setLocalLoading(false);
  }, [orders]);

  useEffect(() => {
    const fc = getParamValue("familyCode");
    if (fc)
      setFormState((prevState) => ({
        ...prevState,
        familyCode: String(fc),
      }));
  }, []);

  

  const handleShowModal = () => {
    setShowModal(true);
    setPropertyFormsData([])
  };

  const handleHideModal = () => {
    setShowModal(false);
  };

  const handleFormSubmit = () => {
    // Submit 'payload' to wherever it needs to go
  };
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });

    if (name == "familyMemberCode") {
      const fc = getParamValue("familyCode");
      if (fc != null)
        dispatch(
          fetchCustomerOrders({ familyCodesId: fc, familyMemberId: value })
        );
      setLocalLoading(true);
    }
  };

  const handleToggleStateChange = (isOn: boolean) => {
    setFormState((prevState) => ({
      ...prevState,
      isCustomer: isOn ? "1" : "0",
    }));
  };

  const handleClearSelect = () => {
    const fc = getParamValue("familyCode");
    if (fc != null) {
      dispatch(
        fetchCustomerOrders({ familyCodesId: fc, familyMemberId: null })
      );
      dispatch(fetchFamilyMembers(fc));
    }
    (true);

  }
  useEffect(() => {
    let totalAmount = 0;

    const addOrderAmounts = (ordersArray: any) => {
      if (ordersArray) {
        totalAmount += ordersArray.reduce(
          (sum: number, order: CustomerOrder) =>
            sum + parseFloat(order.order_amount || "0"),
          0
        );
      }
    };

    // Ensure that 'orders' is of the correct type
    if (
      orders &&
      "sozoku" in orders &&
      "legal" in orders &&
      "insurance" in orders &&
      "property" in orders
    ) {
      addOrderAmounts(orders.sozoku);
      addOrderAmounts(orders.legal);
      addOrderAmounts(orders.insurance);
      addOrderAmounts(orders.property);
    }

    setFormState((prevState) => ({
      ...prevState,
      totalOrderAmount: totalAmount.toFixed(0),
    }));
  }, [orders]);

  const OnPropertyCreateSubmit = () => {
    const transformedPropertyData = propertyFormsData?.map((item: any) => {
      
      return {
        family_member_id: item.familyMember || "",
        order_amount: item.orderAmount || "",
        requested_date: item.orderDate || "",
        manager_id: item.contractor || "",
        sales_remarks: item.comment || "",
        application_type: item.orderDetail || "",
      };
    });

    const payload = {
      property: transformedPropertyData,
      family_code: getParamValue("familyCode"),
      office_departments_id: localStorage.getItem("officeDepartmentsId"),
    };

    dispatch(createProperty(payload as any));
  };
  const anyOrders = orders as any;

  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetPropertyCreateState());
  };



  useEffect(() => {
    setModalForms([{ id: "form-0" }])
  }, [showModal])

  return (
    <>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
      {localLoading && <FullscreenLoader />}
      <div className={Style.orderFamilyCode}>
        <CustomSelectField
          name="familyCode"
          value={formState.familyCode}
          onChange={handleInputChange}
          label={t("familyCode")}
          placeholder={t("familyCode")}
          options={familyCodes.map((code) => ({
            label: code.label,
            value: code.label, // Setting the value to be the same as the label
          }))}
        />

        <CustomSelectField
          name="familyMemberCode"
          value={formState.familyMemberCode}
          onChange={handleInputChange}
          label={t("familyMember")}
          placeholder={t("familyMemberCode")}
          options={familyMembers}
        />
      </div>
      <button
        className={Style.FormModalBtn}
        onClick={handleShowModal}
        type="button"
      >
        {/* <Image
          src="/assets/svg/plus.svg"
          alt="plus icon"
          width={15}
          height={20}
        /> */}
        <PlusIcon className={Style.addIcon} focusable="false" />
        {t("add")}
      </button>
      <hr className="mt-3" />

      {anyOrders?.sozoku?.map((order: any, index: any) => (
        <CustomerOrderForm
          key={`suzoko-${index}`}
          orderId={"sozoku"}
          orderData={order}
          applicationTypes={anyOrders?.application_types}
        />
      ))}

      {anyOrders?.legal?.map((order: any, index: any) => (
        <CustomerOrderForm
          key={`legal-${index}`}
          orderId={"legal"}
          orderData={order}
          applicationTypes={anyOrders?.application_types}
        />
      ))}

      {anyOrders?.insurance?.map((order: any, index: any) => (
        <CustomerOrderForm
          key={`insurance-${index}`}
          orderId={"insurance"}
          orderData={order}
          applicationTypes={anyOrders?.application_types}
        />
      ))}
      {anyOrders?.property?.map((order: any, index: any) => (
        <CustomerOrderForm
          key={`property-${index}`}
          orderId={"property"}
          orderData={order}
          recordId={order.id}
          applicationTypes={anyOrders?.application_types}
          familyMemberOptions={familyMembers}
          usersOptions={users}
        />
      ))}
      <div className={Style.totalAmountWrapper}>
        <InputField
          name="totalOrderAmount"
          value={addCommas(formState.totalOrderAmount)}
          onChange={handleInputChange}
          label={t("totalOrderAmount")}
          placeholder={t("totalOrderAmount")}
          readOnly={true}
        />
      </div>
      {showModal && (
        <div className={Style.customerOrderModalSection}>
          <div className={Style.customerOrderModal}>
            <header className="pos-relative d-flex justify-content-center">
              <h5 className={Style.customerOrderModalHeaderText}><b>{t(" 受注情報")}</b></h5>
              
              <Button
                onClick={() => setShowModal(false)} className={`${Style.customerCloseButton}`}
                icon={
                  <Image src={close} alt="Close Icon" width={15} height={20} />
                }
              />
            </header>

            <div className="p-3">
              <button
                className={Style.FormModalBtn}
                onClick={addNewFormToModal}
                type="button"
              >
                <PlusIcon className={Style.addIcon} focusable="false" />
                {t("add")}
              </button>
              <Form
                onSubmit={OnPropertyCreateSubmit}
                isLoading={propertyCreateLoading}
                showTobSubmitBtn={false}
                setErrors={setErrors} errors={errors}
              >
                {modalForms?.map((form, index) => (
                  <PropertyOrderForm
                    key={form.id}
                    indexLoop= {index}
                    orderId={`modalForm-${index}`}
                    onDataChange={(data) => handleFormDataChange(index, data)}
                    onRemove={() => handleRemoveForm(index)} // Pass the function to remove this specific form
                    familyMemberOptions={familyMembers}
                    usersOptions={users}
                    isFirstForm={index === 0} // Pass true if this is the first form
                    applicationTypes={(orders as any)?.application_types}
                    errors={errors}
                    propertyFormsData={propertyFormsData} // Pass propertyFormsData here

                  />
                ))}
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
