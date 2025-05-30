import React, { useState, ChangeEvent } from "react";
import ClientSection from "@/components/client-section/client-section";
import styles from "@/styles/pages/cnChangePaymentMethod.module.scss";
import style from "@/styles/pages/cnabout.module.scss";
import Button from "@/components/button/button";
import { useLanguage } from "@/localization/LocalContext";
import { Form } from "@/components/form/form";
import InputField from "@/components/input-field/input-field";
import SelectField from "@/components/select-field/select-field";
import { FaHome, FaTrain } from "react-icons/fa";
import SubRouteLayout from "../layout";

export default function UpdateAddress() {
  const { t } = useLanguage();

  const [formValues, setFormValues] = useState({
    postalCode: "123-4567",
    prefecture: "hokkaido",
    address1: "Old Address 1",
    address2: "Old Address 2",
    building: "Building Name",
    railwayCompany1: "Company A",
    trainLine1: "Line A",
    trainStation1: "Station A",
    railwayCompany2: "Company B",
    trainLine2: "Line B",
    trainStation2: "Station B",
  });

  const [updatedValues, setUpdatedValues] = useState({ ...formValues });
  const [errors, setErrors] = useState<Record<string, string | null>>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUpdatedValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Updated Address:", updatedValues);
    // Add validation if needed
  };

  const prefectureOptions = [
    { label: "Hokkaido", value: "hokkaido" },
    { label: "Aomori", value: "aomori" },
    { label: "Iwate", value: "iwate" },
    { label: "Miyagi", value: "miyagi" },
  ];

  return (
    <ClientSection heading={t("updateAddressPage.heading")}>
      <h3 className={styles.subHeading}>{t("updateAddressPage.subHeading")}</h3>

      {/* --- Read-Only Section --- */}
      <h1 className="cn-seperator-heading primary">{t("Previous Address")}</h1>
      <Form
        className={style.formGrid}
        onSubmit={() => {}}
        errors={{}}
        setErrors={() => {}}
      >
        <div className={style.label}>{t("aboutPage.addressLabel")}</div>
        <div className={style.fieldGroup}>
          <div className={style.fieldRow}>
            <InputField
              name="postalCode"
              placeholder={t("aboutPage.postalCodePlaceholder")}
              value={formValues.postalCode}
              onChange={() => {}}
              icon={<FaHome size={12} />}
              disabled
            />
            <SelectField
              name="prefecture"
              options={prefectureOptions}
              value={formValues.prefecture}
              onChange={() => {}}
              icon={<FaHome size={12} />}
              disabled
            />
          </div>
          <InputField
            name="address1"
            value={formValues.address1}
            onChange={() => {}}
            icon={<FaHome size={12} />}
            disabled
          />
          <InputField
            name="address2"
            value={formValues.address2}
            onChange={() => {}}
            icon={<FaHome size={12} />}
            disabled
          />
          <InputField
            name="building"
            value={formValues.building}
            onChange={() => {}}
            icon={<FaHome size={12} />}
            disabled
          />
        </div>

        <div className={style.label}>{t("aboutPage.trainStationLabel")}</div>
        <div className={style.fieldGroup}>
          <div className={style.stationGroup}>
            <InputField
              name="railwayCompany1"
              value={formValues.railwayCompany1}
              onChange={() => {}}
              icon={<FaTrain size={12} />}
              disabled
            />
            <InputField
              name="trainLine1"
              value={formValues.trainLine1}
              onChange={() => {}}
              icon={<FaTrain size={12} />}
              disabled
            />
            <InputField
              name="trainStation1"
              value={formValues.trainStation1}
              onChange={() => {}}
              icon={<FaTrain size={12} />}
              disabled
            />
          </div>
          <div className={style.stationGroup}>
            <InputField
              name="railwayCompany2"
              value={formValues.railwayCompany2}
              onChange={() => {}}
              icon={<FaTrain size={12} />}
              disabled
            />
            <InputField
              name="trainLine2"
              value={formValues.trainLine2}
              onChange={() => {}}
              icon={<FaTrain size={12} />}
              disabled
            />
            <InputField
              name="trainStation2"
              value={formValues.trainStation2}
              onChange={() => {}}
              icon={<FaTrain size={12} />}
              disabled
            />
          </div>
        </div>
      </Form>

      {/* --- Editable Section --- */}
      <h1 className="cn-seperator-heading danger mt-3">
        {t("Updated Address")}
      </h1>
      <Form
        className={style.formGrid}
        onSubmit={handleSubmit}
        errors={errors}
        setErrors={setErrors}
      >
        <div className={style.label}>{t("aboutPage.addressLabel")}</div>
        <div className={style.fieldGroup}>
          <div className={style.fieldRow}>
            <InputField
              name="postalCode"
              value={updatedValues.postalCode}
              onChange={handleInputChange}
              icon={<FaHome size={12} />}
            />
            <SelectField
              name="prefecture"
              options={prefectureOptions}
              value={updatedValues.prefecture}
              onChange={handleInputChange}
              icon={<FaHome size={12} />}
            />
          </div>
          <InputField
            name="address1"
            value={updatedValues.address1}
            onChange={handleInputChange}
            icon={<FaHome size={12} />}
          />
          <InputField
            name="address2"
            value={updatedValues.address2}
            onChange={handleInputChange}
            icon={<FaHome size={12} />}
          />
          <InputField
            name="building"
            value={updatedValues.building}
            onChange={handleInputChange}
            icon={<FaHome size={12} />}
          />
        </div>

        <div className={style.label}>{t("aboutPage.trainStationLabel")}</div>
        <div className={style.fieldGroup}>
          <div className={style.stationGroup}>
            <InputField
              name="railwayCompany1"
              value={updatedValues.railwayCompany1}
              onChange={handleInputChange}
              icon={<FaTrain size={12} />}
            />
            <InputField
              name="trainLine1"
              value={updatedValues.trainLine1}
              onChange={handleInputChange}
              icon={<FaTrain size={12} />}
            />
            <InputField
              name="trainStation1"
              value={updatedValues.trainStation1}
              onChange={handleInputChange}
              icon={<FaTrain size={12} />}
            />
          </div>
          <div className={style.stationGroup}>
            <InputField
              name="railwayCompany2"
              value={updatedValues.railwayCompany2}
              onChange={handleInputChange}
              icon={<FaTrain size={12} />}
            />
            <InputField
              name="trainLine2"
              value={updatedValues.trainLine2}
              onChange={handleInputChange}
              icon={<FaTrain size={12} />}
            />
            <InputField
              name="trainStation2"
              value={updatedValues.trainStation2}
              onChange={handleInputChange}
              icon={<FaTrain size={12} />}
            />
          </div>
        </div>

        <div className="mt-2 d-flex justify-content-center align-items-center">
          <Button
            className="px-10"
            htmlType="submit"
            type="primary"
            text={t("Submit")}
          />
        </div>
      </Form>
    </ClientSection>
  );
}

// Apply layout for sub route
UpdateAddress.getLayout = function getLayout(page: React.ReactElement) {
  return <SubRouteLayout>{page}</SubRouteLayout>;
};
