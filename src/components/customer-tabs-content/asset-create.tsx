import React, { useEffect, useState, useRef } from "react";
import Style from "../../styles/pages/customer-create.module.scss";
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
import HeadingRow from "../heading-row/heading-row";
import Button from "../button/button";
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
import { fetchPropertyTypes } from "@/app/features/generals/getPropertyTypesSlice";
import { fetchFamilyAssetById } from "@/app/features/customers/getFamilyAssetByIdSlice";
import { createFamilyAsset } from "@/app/features/customers/FamilyAssetCreateSlice";
import { resetFamilyAssetCreateState } from "@/app/features/customers/FamilyAssetCreateSlice";
import { getParamValue } from "@/libs/utils";
import { fetchFamilyMembers } from "@/app/features/generals/getFamilyMembersDropdownSlice";
import FullscreenLoader from "../loader/loader";
import { fetchFamilyCodes } from "@/app/features/generals/getFamilyCodesDropdownSlice";
import ConfirmationBox from "../confirmation-box/confirmation-box";

type ToastState = {
  message: string | string[];
  type: string;
};

export default function AssetCreateTab() {
  const { t } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [showAssetForm, setShowAssetForm] = useState(true);
  const [familyMember, setFamilyMember] = useState("");
  const [familyCode, setFamilyCode] = useState("");
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const handleRemoveButtonClick = (index: number) => {
    // Store the index and show the confirmation box
    setRemoveIndex(index);
    setShowConfirmBox(true);
  };

  const handleRemoveRealEstateConfirmed = () => {
    if (removeIndex !== null) {
      // Proceed to remove the item at removeIndex
      const updatedRealEstate = formState.realEstate.filter(
        (_, index) => index !== removeIndex
      );
      setFormState((prevState) => ({
        ...prevState,
        realEstate: updatedRealEstate,
      }));
      // Reset removeIndex and hide the confirmation box
      setRemoveIndex(null);
      setShowConfirmBox(false);
    }
  };
  const router = useRouter();

  const [formState, setFormState] = useState({
    cashDeposit: "",
    stock: "",
    lifeInsurance: "",
    lifeInsuranceAmountReceived: "",
    realEstate: [
      {
        address: "",
        amount: "",
        type: "",
      },
    ],
  });

  const handleAddRealEstate = () => {
    setFormState((prevState) => ({
      ...prevState,
      realEstate: [
        ...prevState.realEstate,
        {
          address: "",
          type: "",
          amount: "",
        },
      ],
    }));
  };

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const loggedInUserRole = localStorage.getItem("loggedInUserRoleId");
    if (loggedInUserRole) {
      const allowedRoles = ["1", "99", "2"];
      if (!allowedRoles.includes(loggedInUserRole)) setIsAuthenticated(false);
      else setIsAuthenticated(true);
    }
  }, []);
  useEffect(() => {
    const familyMemId = getParamValue("familyMemberId");
    if (familyMemId != null) {
      setFamilyMember(familyMemId);
      dispatch(fetchFamilyAssetById(familyMemId));
    }
  }, [dispatch]);

  useEffect(() => {
    if (familyMember) {
      setShowAssetForm(true);
    } else {
      setShowAssetForm(false);
    }
  }, [familyMember]);
  useEffect(() => {
    const id = getParamValue("id");
    if (id) dispatch(fetchFamilyCodes(id));
  }, [dispatch]);

  const familyCodes = useSelector(
    (state: RootState) => state.familyCodes.familyCodes
  );

  const propertyTypes = useSelector(
    (state: RootState) => state.propertyTypes.propertyTypes
  );
  const familyAsset = useSelector(
    (state: RootState) => state.familyAssetDetail.asset
  );
  const { loading, status, message, errorMessages } = useSelector(
    (state: RootState) => state.familyAssetCreate
  );

  useEffect(() => {
    if (status === true) {
      setToast({
        message: message || "Asset updated successfully!",
        type: "success",
      });
      dispatch(resetFamilyAssetCreateState());
    } else if (errorMessages && errorMessages.length > 0) {
      setToast({
        message: errorMessages,
        type: "fail",
      });
      dispatch(resetFamilyAssetCreateState());
    }
  }, [dispatch, status, errorMessages, message]);

  useEffect(() => {
    setToast({ message: "", type: "" });
  }, []);
  useEffect(() => {
    if (familyAsset) {
      const realEstateMapped = Array.isArray(familyAsset.property)
        ? familyAsset.property.map((item: any) => ({
          address: item.address,
          amount: item.amount,
          type: item.type,
        }))
        : [{ address: "", amount: "", type: "" }];

      setFormState((prevState) => ({
        ...prevState,
        cashDeposit: familyAsset.cash_deposit,
        stock: familyAsset.stock,
        lifeInsurance: familyAsset.life_insurance,
        lifeInsuranceAmountReceived: familyAsset.expected_amount_life_insurance,
        realEstate:
          realEstateMapped.length > 0
            ? realEstateMapped
            : [{ address: "", amount: "", type: "" }],
      }));
    } else {
      setFormState((prevState) => ({
        cashDeposit: "",
        stock: "",
        lifeInsurance: "",
        lifeInsuranceAmountReceived: "",
        realEstate: [
          {
            address: "",
            amount: "",
            type: "",
          },
        ],
      }));
    }
    // setLocalLoading(false);
  }, [familyAsset]);

  const handleFormSubmit = () => {
    const familyMemId = getParamValue("familyMemberId");

    const familyMemberIdNumber = familyMemId ? parseInt(familyMemId, 10) : null;
    if (familyMemberIdNumber === null || isNaN(familyMemberIdNumber)) {
      console.error("Invalid family member ID");
    }

    const payload = {
      family_member_id: familyMemberIdNumber,
      cash_deposit: formState.cashDeposit,
      stock: formState.stock,
      life_insurance: formState.lifeInsurance,
      expected_amount_life_insurance: formState.lifeInsuranceAmountReceived,
      property: formState.realEstate,
    };
    dispatch(createFamilyAsset(payload as any));
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // Check if the field is one of the first four fields
    if (
      [
        "cashDeposit",
        "stock",
        "lifeInsurance",
        "lifeInsuranceAmountReceived",
      ].includes(name)
    ) {
      const limitedValue = limitNumberCommas(value);
      setFormState({
        ...formState,
        [name]: limitedValue,
      });
    } else {
      setFormState({
        ...formState,
        [name]: value,
      });
    }
  };
  const handleDynamicInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof (typeof formState.realEstate)[0],
    index: number
  ) => {
    let value = e.target.value;
    if (field === "amount") {
      value = limitNumberCommas(value);
    }

    const updatedRealEstate = [...formState.realEstate];
    updatedRealEstate[index][field] = value;

    setFormState((prevState) => ({
      ...prevState,
      realEstate: updatedRealEstate,
    }));
  };

  const handleDynamicSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    field: keyof (typeof formState.realEstate)[0],
    index: number
  ) => {
    const updatedRealEstate = [...formState.realEstate];
    updatedRealEstate[index][field] = e.target.value;
    setFormState((prevState) => ({
      ...prevState,
      realEstate: updatedRealEstate,
    }));
  };

  const handleRemoveRealEstate = (index: number) => {
    const updatedRealEstate = [...formState.realEstate];
    updatedRealEstate.splice(index, 1);
    setFormState((prevState) => ({
      ...prevState,
      realEstate: updatedRealEstate,
    }));
  };
  const limitNumberCommas = (value: string): string => {
    return value.replace(/[^0-9.,]/g, "");
  };

  useEffect(() => {
    dispatch(fetchPropertyTypes());
  }, [dispatch]);

  const handleFamilyMemberChange = (e: any) => {
    setShowAssetForm(true);
    setFamilyMember(e.target.value);
  };
  useEffect(() => {
    const fc = getParamValue("familyCode");
    if (fc != null) dispatch(fetchFamilyMembers(fc));
  }, [dispatch]);

  // Usage example within your useEffect
  useEffect(() => {
    if (!router.isReady) return;
    if (familyMember) {
      updateQueryParams({ familyMemberId: familyMember });
      dispatch(fetchFamilyAssetById(familyMember));
    }
  }, [familyMember, dispatch]);

  useEffect(() => {
    const fc = getParamValue("familyCode");
    if (fc) setFamilyCode(fc);
  }, []);

  const updateQueryParams = (newParams: { familyMemberId: string }) => {
    const currentPath = router.pathname;
    const currentQuery = { ...router.query, ...newParams };
    router.replace(
      {
        pathname: currentPath,
        query: currentQuery,
      },
      undefined,
      { shallow: true }
    );
  };
  const familyMembers = useSelector(
    (state: RootState) => state.familyMembers.familyMembers
  );

  const OnClearFamilyMember = () => {
    setShowAssetForm(false);
  };

  useEffect(() => {
    if (familyMember == "") {
      setShowAssetForm(false);
    }
  }, [familyMember]);
  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetFamilyAssetCreateState());
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
      {localLoading && <FullscreenLoader />}
      <div className={`${Style.orderFamilyCode} mb-2`}>
        <CustomSelectField
          name="familyCode"
          value={familyCode}
          onChange={(e) => setFamilyCode(e.target.value)}
          label={t("familyCode")}
          placeholder={t("familyCode")}
          options={familyCodes.map((code) => ({
            label: code.label,
            value: code.label, // Setting the value to be the same as the label
          }))}
        />
        <CustomSelectField
          name={`familyMember`}
          value={familyMember}
          onChange={handleFamilyMemberChange}
          options={familyMembers}
          label={t("familyMember")}
          placeholder={t("familyMember")}
        // className={Style.familyMemberSelect}
        // onClear={OnClearFamilyMember}
        />
      </div>


      {showAssetForm ? (
        <Form onSubmit={handleFormSubmit} isLoading={loading}   disabledSubmitForm={toast.message == '資産情報が登録されました。' && toast.type == 'success' ? true :false}>
          <HeadingRow headingTitle={"現預金・有価証券情報"} />
          <div className={`${Style.assetFromRow1} mt-2 mb-2`}>
            <InputField
              name="cashDeposit"
              value={formState.cashDeposit}
              onChange={handleInputChange}
              label={t("cashDeposit")}
              placeholder={t("cashDeposit")}
            />
            <InputField
              name="stock"
              value={formState.stock}
              onChange={handleInputChange}
              label={t("stock")}
              placeholder={t("stock")}
            />
          </div>

          <HeadingRow headingTitle={"保険情報"} />
          <div className={`${Style.assetFromRow1} mt-2 mb-2`}>
            <InputField
              name="lifeInsurance"
              value={formState.lifeInsurance}
              onChange={handleInputChange}
              label={t("lifeInsurance")}
              placeholder={t("lifeInsurance")}
            />
            <InputField
              name="lifeInsuranceAmountReceived"
              value={formState.lifeInsuranceAmountReceived}
              onChange={handleInputChange}
              label={t("lifeInsuranceAmountReceived")}
              placeholder={t("lifeInsuranceAmountReceived")}
            />
          </div>

          <HeadingRow headingTitle={"不動産情報"} />
          <button
            className={`${Style.FormModalBtn} mt-2`}
            onClick={handleAddRealEstate}
            type="button"
          >
            <PlusIcon className={Style.addIcon} focusable="false" />
            {t("add")}
          </button>
          <br />
          <div className={Style.engagementFromRow1MainWrapper}>
            <div
              className={`${Style.engagementFromRow1} ${Style.engagementFromRow1Header} ${Style.assetFromRow3Grid} p-2`}
            >
              <span className={Style.engagementLabels}>{t("realEstate")}</span>
              <span className={Style.engagementLabels}>{t("amount")}</span>
              <span className={Style.engagementLabels}>{t("realEstateType")}</span>
              <span className={Style.engagementLabels}></span>
            </div>
            {formState.realEstate.map((estate, index) => (
              <>
                <div key={index} className={`${Style.assetFromRow3}`}>
                  <InputField
                    name={`realEstateValue-${index}`}
                    value={estate.address}
                    onChange={(e) =>
                      handleDynamicInputChange(e, "address", index)
                    }
                    // label={t("realEstate")}
                    placeholder={t("realEstate")}
                  />
                  <InputField
                    name={`amount-${index}`}
                    value={estate.amount}
                    onChange={(e) => {
                      handleDynamicInputChange(e, "amount", index);
                    }}
                    // label={t("amount")}
                    placeholder={t("amount")}
                  />
                  <CustomSelectField
                    name={`realEstateType-${index}`}
                    value={estate.type}
                    onChange={(e) => handleDynamicSelectChange(e, "type", index)}
                    options={propertyTypes}
                    // label={t("realEstateType")}
                    placeholder={t("realEstateType")}
                  />
                  {isAuthenticated && index !== 0 && (
                  <Button
                    text={t("remove")}
                    type="danger"
                    size="small"
                    onClick={() => handleRemoveButtonClick(index)} // Update to use the new click handler
                  // className={Style.removeButton}
                  />)}
                </div>
              </>
            ))}
          </div>
        </Form>
      ) : (
        <div className={Style.selectOptText}>
          <p>資産情報を入力する対象の顧客を選択してください。</p>
        </div>
      )}

      {showConfirmBox && (
        <ConfirmationBox
          isOpen={showConfirmBox}
          title={`${t("この不動産情報を削除してもよろしいですか？")}`}
          onConfirm={handleRemoveRealEstateConfirmed} // Use the new confirmed handler
          onCancel={() => setShowConfirmBox(false)}
        />
      )}
    </>
  );
}
