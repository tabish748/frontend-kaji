import React, { useState, useEffect } from "react";
import InputField from "../input-field/input-field";
import SelectField from "../select-field/select-field";
import Button from "../button/button";
import Style from "../../styles/components/molecules/customer-order-form.module.scss";
import CheckboxField from "../checkbox-field/checkbox-field";
import { useLanguage } from "@/localization/LocalContext";
import CustomSelectField from "../custom-select/custom-select";
import { questionAirOptions } from "@/libs/optionsHandling";
import InputDateField from "../input-date/input-date";
import ToggleButton from "../toggle-button/toggle-button";
import { fetchCustomerOrders } from "@/app/features/customers/customerOrderListingSlice";
import {
  saveCustomerOrder,
  resetCustomerOrderSaveState,
} from "@/app/features/customers/customerOrderSaveSlice";
import { AppDispatch, RootState } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import { Form } from "../form/form";
import { fetchPropertyOrderById } from "@/app/features/customers/getPropertyOrderByIdSlice";
import {
  updatePropertyOrder,
  resetPropertyOrderUpdateState,
} from "@/app/features/customers/propertyOrderUpdateSlice";
import Toast from "../toast/toast";
import { propertyOrderDetailOptions } from "@/libs/optionsHandling";
import Image from "next/image";
import bin from "../../../public/assets/svg/bin.svg";
import { deletePropertyById, resetDeletePropertyState } from "@/app/features/customers/DeletePropertyByIdSlice";

interface Props {
  proposalDate?: string;
  attendees?: string;
  personalCode?: string;

  contractor?: string;
  orderDetail?: string;
  orderAmount?: string;
  resultType?: string;
  orderDate?: string;
  nextTime?: string;
  workCategory?: string;
  questionaire?: string;
  comment?: string;
  onDataChange?: (data: any) => void;
  onRemove?: () => void;
  insuranceTypeOptions?: any;
  insuranceTypeResultOptions?: any;
  workCategoriesOptions?: any;
  attendeesOptions?: any;
  orderData?: any;
  applicationTypes?: any;
  orderId?: string;
  familyMemberOptions?: any;
  usersOptions?: any;
  recordId?: any;
  onCloseModal?: any;
  onUpdateRecord?: any;
}

type ToastState = {
  message: string | string[];
  type: string;
};

const OrderUpdateForm: React.FC<Props> = ({
  personalCode: initialPersonalCode = "",
  contractor: initialContractor = "",
  orderDetail: initialOrderDetail = "",
  orderAmount: initialorderAmount = "",
  orderDate: initialOrderDate = new Date().toISOString().split("T")[0],
  comment: initialComment = "",
  onDataChange,
  onRemove,
  insuranceTypeOptions,
  insuranceTypeResultOptions,
  workCategoriesOptions,
  attendeesOptions,
  orderData,
  applicationTypes,
  orderId,
  familyMemberOptions,
  usersOptions,
  recordId,
  onCloseModal,
  onUpdateRecord,
}) => {
  const { t } = useLanguage();
  const [personalCode, setPersonalCode] = useState(initialPersonalCode);
  const [comment, setComment] = useState(initialComment);
  const [contractor, setContractor] = useState(initialContractor);
  const [orderDetail, setOrderDetail] = useState(initialOrderDetail);
  const [orderAmount, setOrderAmount] = useState(initialorderAmount);
  const [orderDate, setOrderDate] = useState(initialOrderDate);
  const [applicationType, setApplicationType] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [errors, setErrors] = useState<any>([]);
  useEffect(() => {
    const loggedInUserRole = localStorage.getItem("loggedInUserRoleId");
    if (loggedInUserRole) {
      const allowedRoles = ["1", "99", "2"];
      if (!allowedRoles.includes(loggedInUserRole)) setIsAuthenticated(false);
      else setIsAuthenticated(true);
    }
  }, []);
  const dispatch = useDispatch<AppDispatch>();
  const getApplicationTypeLabel = (
    applicationType: any,
    applicationTypes: any
  ) => {
    if (applicationType) return applicationTypes[applicationType] || "";
  };

  const { propertyOrder } = useSelector(
    (state: RootState) => state.propertyOrderDetail
  );

  useEffect(() => {
    if (recordId != null) dispatch(fetchPropertyOrderById(String(recordId)));
  }, [recordId]);

  useEffect(() => {
    
    if (propertyOrder) {
      setOrderAmount(propertyOrder?.order_amount);
      setPersonalCode(String(propertyOrder?.family_member_id));
      setOrderDate(propertyOrder?.requested_date);
      setContractor(String(propertyOrder?.manager_id));
      setComment(propertyOrder?.sales_remarks);
      setApplicationType(String(propertyOrder?.application_type));
      setOrderDetail(String(propertyOrder?.application_type));
    }
  }, [propertyOrder]);

  const OnPropertyUpdateSubmit = () => {
    const updateData = {
      order_amount: orderAmount,
      requested_date: orderDate,
      family_member_id: personalCode,
      manager_id: contractor,
      sales_remarks: comment,
      application_type: orderDetail,
      office_departments_id: localStorage?.getItem("officeDepartmentsId"),
    };

    dispatch(updatePropertyOrder({ id: Number(recordId), updateData }));
  };
  const { success, loading, message, errorMessages } = useSelector(
    (state: RootState) => state.propertyOrderUpdate
  );
  const { success: deleteSuccess, loading: deleteLoading, message: deleteMessage, errorMessages: deleteErrorMessages } = useSelector(
    (state: RootState) => state.deletePropertyById
  );

  useEffect(() => {
    if (deleteSuccess === true) {
      setToast({
        message: deleteMessage || "Property Updated successfully!",
        type: "success",
      });
      onCloseModal();
      onUpdateRecord();
      dispatch(resetDeletePropertyState());

    } else if (deleteErrorMessages && deleteErrorMessages.length > 0) {
      setToast({
        message: deleteErrorMessages,
        type: "fail",
      });
      dispatch(resetDeletePropertyState());
    }
  }, [dispatch, deleteSuccess, deleteErrorMessages, deleteMessage]);


  useEffect(() => {
    if (success === true) {
      setToast({
        message: message || "Property Updated successfully!",
        type: "success",
      });
      onUpdateRecord();
      dispatch(resetPropertyOrderUpdateState());
      onCloseModal();


    } else if (errorMessages && errorMessages.length > 0) {
      setToast({
        message: errorMessages,
        type: "fail",
      });
      dispatch(resetPropertyOrderUpdateState());
    }
  }, [dispatch, success, errorMessages, message]);


  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetPropertyOrderUpdateState());
  };

  const handleRemoveProperty = () => {
    dispatch(deletePropertyById(recordId))
  }


  return (
    <Form onSubmit={OnPropertyUpdateSubmit} showTobSubmitBtn={false} isLoading={loading} setErrors={setErrors} errors={errors}>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}
      <div className={Style.requestFormWrapper}>
        <div>
          <div className={`${Style.customerOrderFormRow1} mt-2 mb-2`}>
            <CustomSelectField
              label={t("personalCode")}
              options={familyMemberOptions}
              value={personalCode}
              onChange={(e) => setPersonalCode(e.target.value)}
              placeholder={t("personalCode")}
              name="personalCode"
              className={Style.propertyDropdownSelect}
              validations={[{ type: "required" }]}
              errorText={errors["personalCode"]}
            />
            <InputDateField
              name="orderDate"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              label={t("orderDate")}
              placeholder={t("orderDate")}
              validations={[{ type: "required" }]}
              errorText={errors["orderDate"]}
            />
            <CustomSelectField
              name={`contractor`}
              value={contractor}
              options={usersOptions?.map((user: any) => ({
                label: user.label,
                value: user.value,
              }))}
              onChange={(e) => setContractor(e.target.value)}
              label={t("contractor")}
              className={Style.propertyDropdownSelect}
              placeholder={t("contractor")}
            />

            <CustomSelectField
              name="orderDetail"
              value={orderDetail}
              onChange={(e) => {setOrderDetail(e.target.value) }}
              label={t("orderDetail")}
              placeholder={t("orderDetail")}
              className={Style.propertyDropdownSelect}
              options={propertyOrderDetailOptions}
              validations={[{ type: "required" }]}
              errorText={errors["orderDetail"]}
            />
            <InputField
              name="orderAmount"
              type="number"
              value={orderAmount}
              label={t("orderAmount")}
              placeholder={t("orderAmount")}
              onChange={(e) => setOrderAmount(e.target.value)}
              validations={[{ type: "required" }]}
              errorText={errors["orderAmount"]}
            />
            <div className={Style.commentField}>
              <InputField
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={t("comment")}
              />

            </div>
            {isAuthenticated && <Button
              text={t("remove")}
              type="danger"
              size="small"
              onClick={() => handleRemoveProperty()}
              // onClick={() => handleBeforeRemoveProject(index)}
              isLoading={deleteLoading}
              icon={
                <Image
                  src={bin}
                  alt="Delete Icon"
                  width={15}
                  height={15}
                />
              }
            />
            }
          </div>
        </div>
        <div className={Style.requestFormActionsContainer}></div>
      </div>
    </Form>
  );
};

export default OrderUpdateForm;
