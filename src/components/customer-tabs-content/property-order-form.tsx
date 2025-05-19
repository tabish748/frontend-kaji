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
import { propertyOrderDetailOptions } from "@/libs/optionsHandling";

interface Props {
  proposalDate?: string;
  attendees?: string;
  familyMember?: string;

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
  isFirstForm?: any;
  errors?: any;
  key?: any;
  indexLoop?: any;
  propertyFormsData?: any;
  children?: React.ReactNode;

}

const PropertyOrderForm: React.FC<Props> = ({
  familyMember: initialPersonalCode = "",
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
  isFirstForm,
  children,
  errors,
  key,
  indexLoop
}) => {
  const { t } = useLanguage();
  const [familyMember, setFamilyMember] = useState(initialPersonalCode);
  const [comment, setComment] = useState(initialComment);
  const [contractor, setContractor] = useState(initialContractor);
  const [orderDetail, setOrderDetail] = useState(initialOrderDetail);
  const [orderAmount, setOrderAmount] = useState(initialorderAmount);
  const [orderDate, setOrderDate] = useState(initialOrderDate);
  const [isSaving, setIsSaving] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const dispatch = useDispatch();
  const getApplicationTypeLabel = (
    applicationType: any,
    applicationTypes: any
  ) => {
    if (applicationType && applicationTypes)
      return applicationTypes[applicationType] || "";
  };

  useEffect(() => {
    setComment(orderData?.sales_remarks);
  }, [orderData]);
  useEffect(() => {
    const loggedInUserRole = localStorage.getItem("loggedInUserRoleId");
    if (loggedInUserRole) {
      const allowedRoles = ['1', '99'];
      if (!allowedRoles.includes(loggedInUserRole))
        setIsAuthenticated(false);
      else
        setIsAuthenticated(true);
    }
  }, [])
  useEffect(() => {
    const formData = {
      familyMember, // from CustomSelectField
      orderDate, // from InputDateField
      contractor, // from CustomSelectField
      orderDetail, // from InputField, but readOnly
      orderAmount, // from InputField
      comment, // from InputField
    };

    if (JSON.stringify(formData) !== JSON.stringify(orderData)) {
      onDataChange && onDataChange(formData);
    }
  }, [familyMember, orderDate, contractor, orderDetail, orderAmount, comment]);

  const { success, loading } = useSelector(
    (state: RootState) => state.customerOrderSave
  );

  return (
    <div className={Style.requestFormWrapper}>
      <div>
        <div className={`${Style.customerOrderFormRow1} mt-2 mb-2`}>
          <CustomSelectField
            label={t("familyMember")}
            options={familyMemberOptions}
            value={familyMember}
            name={`familyMember-${indexLoop}`}
            onChange={(e) => setFamilyMember(e.target.value)}
            placeholder={t("familyMember")}
            className={Style.propertyDropdownSelect}
            validations={[{ type: "required" }]}
            errorText={errors[`familyMember-${indexLoop}`]}
          />
          <InputDateField
            name={`orderDate-${indexLoop}`}
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            label={t("orderDate")}
            placeholder={t("orderDate")}
            validations={[{ type: "required" }]}
            errorText={errors[`orderDate-${indexLoop}`]}
          />
          <CustomSelectField
            name={`contractor-${indexLoop}`}
            value={contractor}
            options={usersOptions?.map((user: any) => ({
              label: user.label,
              value: user.value,
            }))}
            onChange={(e) => setContractor(e.target.value)}
            label={t("contractor")}
            className={Style.propertyDropdownSelect}
            placeholder={t("contractor")}
            validations={[{ type: "required" }]}
            errorText={errors[`contractor-${indexLoop}`]}
          />

          <CustomSelectField
            name={`orderDetail-${indexLoop}`}
            value={orderDetail}
            onChange={(e) => setOrderDetail(e.target.value)}
            label={t("orderDetail")}
            placeholder={t("orderDetail")}
            className={Style.propertyDropdownSelect}
            options={propertyOrderDetailOptions}
            validations={[{ type: "required" }]}
            errorText={errors[`orderDetail-${indexLoop}`]}
          />
          <InputField
            name={`orderAmount-${indexLoop}`}
            type="number"
            value={orderAmount}
            label={t("orderAmount")}
            placeholder={t("orderAmount")}
            onChange={(e) => setOrderAmount(e.target.value)}
            validations={[{ type: "required" }]}
            errorText={errors[`orderAmount-${indexLoop}`]}
          />
          <div className={Style.commentField}>
            <InputField
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("comment")}
            />
          </div>
          {(!isFirstForm && isAuthenticated) && (
            <Button
              text={t("remove")}
              type="danger"
              isLoading={isSaving}
              size="small"
              className={Style.customerOrderSaveBtn}
              onClick={onRemove}
            />
          )}
        </div>
      </div>
      <div className={Style.requestFormActionsContainer}></div>
    </div>
  );
};

export default PropertyOrderForm;
