import React, { useState, ChangeEvent, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/router";
import { RootState, AppDispatch } from "@/app/store";
import { fetchCustomerDropdowns } from "@/app/features/dropdowns/getCustomerDropdownsSlice";
import { changeAddressRequest, resetChangeAddressRequest } from "@/app/customer/changeAddressRequestSlice";
import ClientSection from "@/components/client-section/client-section";
import styles from "@/styles/pages/cnChangePaymentMethod.module.scss";
import style from "@/styles/pages/cnabout.module.scss";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import SelectField from "@/components/select-field/select-field";
import ApiLoadingWrapper from "@/components/api-loading-wrapper/api-loading-wrapper";
import Toast from "@/components/toast/toast";
import SubRouteLayout from "../layout";
import { MdOutlineHomeWork, MdOutlineTrain } from "react-icons/md";
import { BiHomeAlt2 } from "react-icons/bi";

export default function UpdateAddress() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { customerDropdowns, loading: dropdownsLoading, error: dropdownsError } = useSelector((state: RootState) => state.customerDropdowns);
  const customer = useSelector((state: RootState) => state.customerBasicInfo.customer);
  const changeAddressState = useSelector((state: RootState) => state.changeAddressRequest);

  // Toast state
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<string>("");
  const [showToast, setShowToast] = useState(false);

  // Fetch dropdowns on mount and reset state
  useEffect(() => {
    if (!customerDropdowns) {
      dispatch(fetchCustomerDropdowns());
    }
    // Reset the change address state when component mounts
    dispatch(resetChangeAddressRequest());
  }, [dispatch, customerDropdowns]);

  // Cleanup effect to reset state when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetChangeAddressRequest());
    };
  }, [dispatch]);

  // Handle success/error states from changeAddressRequest
  useEffect(() => {
    if (changeAddressState.success === true) {
      setToastMessage(changeAddressState.message || t('Address updated successfully.'));
      setToastType("success");
      setShowToast(true);
      // Auto-redirect after 2 seconds
      setTimeout(() => {
        const langParam = router.query.lang ? `?lang=${router.query.lang}` : '';
        router.replace(`/cn-request${langParam}`);
      }, 2000);
    } else if (changeAddressState.success === false && changeAddressState.error) {
      setToastMessage(changeAddressState.error);
      setToastType("error");
      setShowToast(true);
    }
  }, [changeAddressState.success, changeAddressState.error, changeAddressState.message, router, t]);

  // Previous address values from customer data
  const prevAddressValues = {
    postalCode: customer?.post_code || "",
    prefecture: customer?.prefecture_id?.toString() || "",
    address1: customer?.address1 || "",
    address2: customer?.address2 || "",
    building: customer?.apartment_name || "",
    railwayCompany1: customer?.customer_routes?.[0]?.company || "",
    trainLine1: customer?.customer_routes?.[0]?.route_name || "",
    trainStation1: customer?.customer_routes?.[0]?.nearest_station || "",
    railwayCompany2: customer?.customer_routes?.[1]?.company || "",
    trainLine2: customer?.customer_routes?.[1]?.route_name || "",
    trainStation2: customer?.customer_routes?.[1]?.nearest_station || "",
  };

  // Current editable address values
  const [updatedValues, setUpdatedValues] = useState({
    postalCode: "",
    prefecture: "",
    address1: "",
    address2: "",
    building: "",
    railwayCompany1: "",
    trainLine1: "",
    trainStation1: "",
    railwayCompany2: "",
    trainLine2: "",
    trainStation2: "",
  });

  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedValues((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Reset toast and state when user makes changes
    setShowToast(false);
    if (changeAddressState.success !== null || changeAddressState.error) {
      dispatch(resetChangeAddressRequest());
    }
  };

  const handleSubmit = () => {
    // Prepare payload
    const payload = {
      post_code: updatedValues.postalCode,
      prefecture_id: Number(updatedValues.prefecture),
      address1: updatedValues.address1,
      address2: updatedValues.address2,
      apartment_name: updatedValues.building,
      stations: [
        {
          company: updatedValues.railwayCompany1,
          route_name: updatedValues.trainLine1,
          nearest_station: updatedValues.trainStation1,
        },
        {
          company: updatedValues.railwayCompany2,
          route_name: updatedValues.trainLine2,
          nearest_station: updatedValues.trainStation2,
        },
      ],
    };

    dispatch(changeAddressRequest(payload));
  };

  const handleToastClose = () => {
    setShowToast(false);
    if (changeAddressState.success !== null || changeAddressState.error) {
      dispatch(resetChangeAddressRequest());
    }
  };

  return (
    <ApiLoadingWrapper
      loading={dropdownsLoading}
      error={dropdownsError}
      onRetry={() => dispatch(fetchCustomerDropdowns())}
      errorTitle="Error loading address data"
    >
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={handleToastClose}
          duration={5000}
        />
      )}

    <ClientSection heading={t("updateAddressPage.heading")}>
      <h3 className={styles.subHeading}>{t("updateAddressPage.subHeading")}</h3>

        {/* Show success message */}
        {changeAddressState.success && (
          <div className="alert alert-success mb-3">
            <p>{changeAddressState.message || t('Address updated successfully.')}</p>
            <p className="mb-0">{t('Redirecting back to requests...')}</p>
          </div>
        )}

        {/* Show loading, error from changeAddressRequest slice */}
        {changeAddressState.loading && <div className="alert alert-info">{t('Loading...')}</div>}
        {changeAddressState.error && <div className="alert alert-danger">{changeAddressState.error}</div>}

        {/* Only show form if not successful */}
        {!changeAddressState.success && (
          <>
      {/* --- Read-Only Section --- */}
            <h1 className="cn-seperator-heading primary">{t("changePaymentMethodPage.prev")}</h1>
      <Form
        onSubmit={() => {}}
        errors={{}}
        setErrors={() => {}}
      >
        <div className={style.formGrid}>
          <div className={style.label}>{t("aboutPage.addressLabel")}</div>
          <div className={style.fieldGroup}>
            <div className={style.fieldRow}>
              <InputField
                      name="prev_postalCode"
                placeholder={t("aboutPage.postalCodePlaceholder")}
                      value={prevAddressValues.postalCode}
                onChange={() => {}}
                icon={<MdOutlineHomeWork size={12} />}
                disabled
              />
              <SelectField
                      name="prev_prefecture"
                      placeholder={t("aboutPage.prefecturePlaceholder")}
                      options={customerDropdowns?.prefectures || []}
                      value={prevAddressValues.prefecture}
                onChange={() => {}}
                icon={<BiHomeAlt2 size={12} />}
                disabled
              />
            </div>
            <InputField
                    name="prev_address1"
                    placeholder={t("aboutPage.address1Placeholder")}
                    value={prevAddressValues.address1}
              onChange={() => {}}
              icon={<BiHomeAlt2 size={12} />}
              disabled
            />
            <InputField
                    name="prev_address2"
                    placeholder={t("aboutPage.address2Placeholder")}
                    value={prevAddressValues.address2}
              onChange={() => {}}
              icon={<BiHomeAlt2 size={12} />}
              disabled
            />
            <InputField
                    name="prev_building"
                    placeholder={t("aboutPage.buildingPlaceholder")}
                    value={prevAddressValues.building}
              onChange={() => {}}
              icon={<BiHomeAlt2 size={12} />}
              disabled
            />
          </div>

          <div className={style.label}>{t("aboutPage.trainStationLabel")}</div>
          <div className={style.fieldGroup}>
            <div className={style.stationGroup}>
              <InputField
                      name="prev_railwayCompany1"
                      placeholder={t("aboutPage.railwayCompany1Placeholder")}
                      value={prevAddressValues.railwayCompany1}
                onChange={() => {}}
                icon={<MdOutlineTrain size={12} />}
                disabled
              />
              <InputField
                      name="prev_trainLine1"
                      placeholder={t("aboutPage.trainLine1Placeholder")}
                      value={prevAddressValues.trainLine1}
                onChange={() => {}}
                icon={<MdOutlineTrain size={12} />}
                disabled
              />
              <InputField
                      name="prev_trainStation1"
                      placeholder={t("aboutPage.trainStation1Placeholder")}
                      value={prevAddressValues.trainStation1}
                onChange={() => {}}
                icon={<MdOutlineTrain size={12} />}
                disabled
              />
            </div>
            <div className={style.stationGroup}>
              <InputField
                      name="prev_railwayCompany2"
                      placeholder={t("aboutPage.railwayCompany2Placeholder")}
                      value={prevAddressValues.railwayCompany2}
                onChange={() => {}}
                icon={<MdOutlineTrain size={12} />}
                disabled
              />
              <InputField
                      name="prev_trainLine2"
                      placeholder={t("aboutPage.trainLine2Placeholder")}
                      value={prevAddressValues.trainLine2}
                onChange={() => {}}
                icon={<MdOutlineTrain size={12} />}
                disabled
              />
              <InputField
                      name="prev_trainStation2"
                      placeholder={t("aboutPage.trainStation2Placeholder")}
                      value={prevAddressValues.trainStation2}
                onChange={() => {}}
                icon={<MdOutlineTrain size={12} />}
                disabled
              />
            </div>
          </div>
        </div>
      </Form>

      {/* --- Editable Section --- */}
      <h1 className="cn-seperator-heading danger mt-3">
              {t("changePaymentMethodPage.update")}
      </h1>
      <Form
        onSubmit={handleSubmit}
        errors={errors}
        setErrors={setErrors}
      >
        <div className={style.formGrid}>
          <div className={style.label}>{t("aboutPage.addressLabel")}</div>
          <div className={style.fieldGroup}>
            <div className={style.fieldRow}>
              <InputField
                name="postalCode"
                      placeholder={t("aboutPage.postalCodePlaceholder")}
                value={updatedValues.postalCode}
                onChange={handleInputChange}
                      validations={[{ type: "required" }]}
                      errorText={errors["postalCode"] || undefined}
                icon={<MdOutlineHomeWork size={12} />}
                      disabled={changeAddressState.loading}
              />
              <SelectField
                name="prefecture"
                      placeholder={t("aboutPage.prefecturePlaceholder")}
                      options={customerDropdowns?.prefectures || []}
                value={updatedValues.prefecture}
                onChange={handleInputChange}
                      validations={[{ type: "required" }]}
                      errorText={errors["prefecture"] || undefined}
                icon={<BiHomeAlt2 size={12} />}
                      disabled={changeAddressState.loading}
              />
            </div>
            <InputField
              name="address1"
                    placeholder={t("aboutPage.address1Placeholder")}
              value={updatedValues.address1}
              onChange={handleInputChange}
                    validations={[{ type: "required" }]}
                    errorText={errors["address1"] || undefined}
              icon={<BiHomeAlt2 size={12} />}
                    disabled={changeAddressState.loading}
            />
            <InputField
              name="address2"
                    placeholder={t("aboutPage.address2Placeholder")}
              value={updatedValues.address2}
              onChange={handleInputChange}
              icon={<BiHomeAlt2 size={12} />}
                    disabled={changeAddressState.loading}
            />
            <InputField
              name="building"
                    placeholder={t("aboutPage.buildingPlaceholder")}
              value={updatedValues.building}
              onChange={handleInputChange}
              icon={<BiHomeAlt2 size={12} />}
                    disabled={changeAddressState.loading}
            />
          </div>

          <div className={style.label}>{t("aboutPage.trainStationLabel")}</div>
          <div className={style.fieldGroup}>
            <div className={style.stationGroup}>
              <InputField
                name="railwayCompany1"
                      placeholder={t("aboutPage.railwayCompany1Placeholder")}
                value={updatedValues.railwayCompany1}
                onChange={handleInputChange}
                icon={<MdOutlineTrain size={12} />}
                      disabled={changeAddressState.loading}
              />
              <InputField
                name="trainLine1"
                      placeholder={t("aboutPage.trainLine1Placeholder")}
                value={updatedValues.trainLine1}
                onChange={handleInputChange}
                icon={<MdOutlineTrain size={12} />}
                      disabled={changeAddressState.loading}
              />
              <InputField
                name="trainStation1"
                      placeholder={t("aboutPage.trainStation1Placeholder")}
                value={updatedValues.trainStation1}
                onChange={handleInputChange}
                icon={<MdOutlineTrain size={12} />}
                      disabled={changeAddressState.loading}
              />
            </div>
            <div className={style.stationGroup}>
              <InputField
                name="railwayCompany2"
                      placeholder={t("aboutPage.railwayCompany2Placeholder")}
                value={updatedValues.railwayCompany2}
                onChange={handleInputChange}
                icon={<MdOutlineTrain size={12} />}
                      disabled={changeAddressState.loading}
              />
              <InputField
                name="trainLine2"
                      placeholder={t("aboutPage.trainLine2Placeholder")}
                value={updatedValues.trainLine2}
                onChange={handleInputChange}
                icon={<MdOutlineTrain size={12} />}
                      disabled={changeAddressState.loading}
              />
              <InputField
                name="trainStation2"
                      placeholder={t("aboutPage.trainStation2Placeholder")}
                value={updatedValues.trainStation2}
                onChange={handleInputChange}
                icon={<MdOutlineTrain size={12} />}
                      disabled={changeAddressState.loading}
              />
            </div>
          </div>
        </div>
        
        <div className="d-flex justify-content-between mt-2 gap-1 false">
          <span></span>
          <div className="d-flex justify-content-between gap-1">
            <Button
              className="px-10"
              htmlType="submit"
              type="primary"
                    text={changeAddressState.loading ? t("Loading...") : t("buttons.submit")}
                    disabled={changeAddressState.loading}
            />
          </div>
          <span></span>
        </div>
      </Form>
          </>
        )}
    </ClientSection>
    </ApiLoadingWrapper>
  );
}

// Apply layout for sub route
UpdateAddress.getLayout = function getLayout(page: React.ReactElement) {
  return <SubRouteLayout>{page}</SubRouteLayout>;
};
