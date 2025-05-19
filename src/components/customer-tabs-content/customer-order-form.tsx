import React, { useState, useEffect } from "react";
import InputField from "../input-field/input-field";
import SelectField from "../select-field/select-field";
import Button from "../button/button";
import Style from "../../styles/components/molecules/customer-order-form.module.scss";
import Style2 from "../../styles/pages/customer-create.module.scss";
import Image from "next/image";
import close from "../../../public/assets/svg/modalClose.svg";
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
import OrderUpdateForm from "./order-update-form";
import { addCommas, getParamValue } from "@/libs/utils";
import Toast from "../toast/toast";

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
}
type ToastState = {
  message: string | string[];
  type: string;
};

const CustomerOrderForm: React.FC<Props> = ({
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
}) => {
  const { t } = useLanguage();
  const [personalCode, setPersonalCode] = useState(initialPersonalCode);
  const [comment, setComment] = useState(initialComment);
  const [contractor, setContractor] = useState(initialContractor);
  const [orderDetail, setOrderDetail] = useState(initialOrderDetail);
  const [orderAmount, setOrderAmount] = useState(initialorderAmount);
  const [orderDate, setOrderDate] = useState(initialOrderDate);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [localSuccess, setLocalSuccess] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const getApplicationTypeLabel = (
    applicationType: any,
    applicationTypes: any
  ) => {
    if (applicationType) return applicationTypes[applicationType] || "";
  };

  useEffect(() => {
    setComment(orderData?.sales_remarks);
  }, [orderData]);

  const OnClickOrderSaveBtn = async () => {
    setIsSaving(true); // Set loading state to true for this form

    const payload = {
      project_type: orderId,
      sales_remarks: comment,
      id: orderData?.id,
    };
    try {
      const response = await dispatch(
        saveCustomerOrder(payload as any)
      ).unwrap();
      setLocalSuccess(true); // Update local success state
      // ... handle response
    } catch (error) {
      // ... handle error
    } finally {
      setIsSaving(false);
    }
  };

  const { success, loading, message } = useSelector(
    (state: RootState) => state.customerOrderSave
  );

  useEffect(() => {
    if (localSuccess) {
      // Handle success, such as displaying a message
      setToast({
        message: message || "",
        type: "success",
      });
      setLocalSuccess(false);

    }
  }, [localSuccess]);

  const OnPropertyUpdateSubmit = () => { };

  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetCustomerOrderSaveState());
  };
  return (
    <div className={Style.requestFormWrapper}>
      {toast.message && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={handleCloseToast}
        />
      )}

      <div>
        <div className={`${Style.customerOrderFormRow1} mt-2 mb-2`}>
          <InputField
            name="personalCode"
            value={orderData?.personal_code}
            onChange={(e) => setPersonalCode(e.target.value)}
            label={t("personalCode")}
            placeholder={t("personalCode")}
            readOnly={true}
          />

          <InputDateField
            name="orderDate"
            value={orderData?.order_date}
            onChange={(e) => setOrderDate(e.target.value)}
            label={t("orderDate")}
            placeholder={t("orderDate")}
            readOnly={true}
          />
          <InputField
            name="contractor"
            value={orderData?.username}
            onChange={(e) => setContractor(e.target.value)}
            label={t("contractor")}
            placeholder={t("contractor")}
            readOnly={true}
          />
          <InputField
            name="orderDetail"
            value={getApplicationTypeLabel(
              orderData?.application_type,
              applicationTypes
            )}
            onChange={(e) => setContractor(e.target.value)}
            label={t("orderDetail")}
            placeholder={t("orderDetail")}
            readOnly={true}
          />
          <InputField
            name="orderAmount"
            // type="number" due to commas
            value={addCommas(orderData?.order_amount)}
            label={t("orderAmount")}
            placeholder={t("orderAmount")}
            onChange={(e) => setOrderAmount(e.target.value)}
            readOnly={true}
          />
          <div className={Style.commentField}>
            <InputField
              name="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("comment")}
              readOnly={orderId == "property" ? true : false}
            />
          </div>

          {orderId != "property" ? (
            <Button
              text={t("registration")}
              type="primary"
              isLoading={isSaving}
              size="small"
              className={Style.customerOrderSaveBtn}
              onClick={OnClickOrderSaveBtn}
            />
          ) : (
            <Button
              text={t("update")}
              type="primary"
              isLoading={isSaving}
              size="small"
              className={Style.customerOrderSaveBtn}
              onClick={() => setShowModal(true)}
            />
          )}
        </div>
      </div>
      <div className={Style.requestFormActionsContainer}></div>

      {showModal && (
        <>
          <div className={Style2.customerOrderModalSection}>
            <div className={Style2.customerOrderModal}>
            <header className={`${Style2.customerHeader} pos-relative d-flex p-1`} >
              <h5 className={Style.customerOrderModalHeaderText}><b>{t(" 受注情報")}</b></h5>
              {/* <span onClick={() => setShowModal(false)}>x</span> */}
              <Button
                onClick={() => setShowModal(false)} className={Style2.customerCloseButton}
                icon={
                  <Image src={close} alt="Close Icon" width={15} height={20} />
                }
              />
            </header>

              <div className="p-3">
                <OrderUpdateForm
                  // orderId={`modalForm-${index}`}
                  recordId={recordId}
                  onCloseModal={() => setShowModal(false)}
                  onUpdateRecord={() => {
                    const fc = getParamValue("familyCode");
                    if (fc != null) {
                      dispatch(
                        fetchCustomerOrders({
                          familyCodesId: fc,
                        })
                      );
                    }
                  }}
                  familyMemberOptions={familyMemberOptions}
                  usersOptions={usersOptions}
                  applicationTypes={applicationTypes}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomerOrderForm;
