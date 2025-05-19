import React, { useEffect, useState } from "react";
import Style from "../../styles/pages/customer-create.module.scss";
import { useLanguage } from "../../localization/LocalContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { fetchCustomerEngagements } from "@/app/features/customers/customerEngagmentListingSlice";
import { getParamValue } from "@/libs/utils";
import { Form } from "../form/form";
import InputDateField from "../input-date/input-date";
import InputField from "../input-field/input-field";
import CustomSelectField from "../custom-select/custom-select";
import HeadingRow from "../heading-row/heading-row";
import { fetchUsersDropdown } from "@/app/features/generals/getUsersDropdownSlice";
import TextAreaField from "../text-area/text-area";
import Button from "../button/button";
import {
  createCustomerEngagement,
  resetCustomerEngagementCreateState,
} from "@/app/features/customers/customerEngagmentCreateSlice";
import Toast from "../toast/toast";
import { fetchFamilyCodes } from "@/app/features/generals/getFamilyCodesDropdownSlice";
import { fetchFamilyMembers } from "@/app/features/generals/getFamilyMembersDropdownSlice";
import FullscreenLoader from "../loader/loader";
import ConfirmationBox from "../confirmation-box/confirmation-box";
import { PlusIcon } from "@/libs/svgIcons";

interface Engagement {
  id: string;
  compatibleDate: string;
  howToRespond: string;
  users: string;
}

type ToastState = {
  message: string | string[];
  type: string;
};

export default function EngagementCreateTab() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const { engagements: fetchedEngagements, loading: fetchedLoading } =
    useSelector((state: RootState) => state.customerEngagement);
  const [showForm, setShowForm] = useState(false);
  const [removeEngagementIndex, setRemoveEngagementIndex] = useState<
    number | null
  >(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState<any>([]);
  useEffect(() => {
    const loggedInUserRole = localStorage.getItem("loggedInUserRoleId");
    if (loggedInUserRole) {
      const allowedRoles = ["1", "99", "2"];
      if (!allowedRoles.includes(loggedInUserRole)) setIsAuthenticated(false);
      else setIsAuthenticated(true);
    }
  }, []);

  const users = useSelector((state: RootState) => state.usersDropdown.users);

  const { loading, success, message, errorMessages } = useSelector(
    (state: RootState) => state.customerEngagementCreate
  );
  const [toast, setToast] = useState<ToastState>({ message: "", type: "" });

  // Initialize with one new engagement
  const [engagements, setEngagements] = useState<Engagement[]>([
    { id: "_new", compatibleDate: "", howToRespond: "", users: "" },
  ]);
  const [familyMember, setFamilyMember] = useState("");
  const [showConfirmBox, setShowConfirmBox] = useState(false);
  const [familyCode, setFamilyCode] = useState("");

  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const handleRemoveButtonClick = (index: number) => {

    
    setRemoveEngagementIndex(index);
    // Show confirmation box

    // Store the index and show the confirmation box
    setRemoveIndex(index);
    setShowConfirmBox(true);
  };

  const propertyTypes = useSelector(
    (state: RootState) => state.propertyTypes.propertyTypes
  );

  // const onRemove = (index: number) => {
  //   // Store the index of the engagement to be removed
  //   setRemoveEngagementIndex(index);
  //   // Show confirmation box
  //   setShowConfirmBox(true);
  // };

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
  const limitNumberCommas = (value: string): string => {
    return value.replace(/[^0-9.,]/g, "");
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

  useEffect(() => {
    if (success === true) {
      setToast({
        message: message || "Engagement updated successfully!",
        type: "success",
      });
      dispatch(fetchCustomerEngagements(Number(familyMember)));
      dispatch(resetCustomerEngagementCreateState());
    } else if (errorMessages && errorMessages.length > 0) {
      setToast({
        message: errorMessages,
        type: "fail",
      });
      dispatch(resetCustomerEngagementCreateState());
    }
  }, [dispatch, success, errorMessages, message]);

  useEffect(() => {
    const id = getParamValue("id");
    dispatch(fetchCustomerEngagements(Number(id)));
    dispatch(fetchUsersDropdown());
  }, [dispatch]);

  useEffect(() => {
    const fc = getParamValue("familyCode");
    if (fc) setFamilyCode(fc);
  }, []);

  useEffect(() => {
    if (fetchedEngagements && fetchedEngagements.length > 0) {
      const transformedEngagements = fetchedEngagements.map((e) => ({
        id: e.id.toString(),
        compatibleDate: e.response_date || "",
        howToRespond: e.content || "",
        users: e.user_id.toString() || "",
      }));

      transformedEngagements.push({
        id: "_new",
        compatibleDate: "",
        howToRespond: "",
        users: "",
      });
      setEngagements(transformedEngagements);
    } else {
      // Initialize with one new empty engagement if fetchedEngagements is empty
      setEngagements([
        { id: "_new", compatibleDate: "", howToRespond: "", users: "" },
      ]);
    }
  }, [fetchedEngagements]);

  const handleInputChange = (e: any, name: string, engagementId: string) => {
    const updatedEngagements = engagements?.map((engagement) =>
      engagement.id === engagementId
        ? { ...engagement, [name]: e.target.value }
        : engagement
    );
    setEngagements(updatedEngagements);
  };

  const handleFormSubmit = () => {
    // event.preventDefault();
    const customerId = getParamValue("id");
    // Exclude the new engagement row if it's empty
    const filteredEngagements = engagements.filter(
      (engagement) =>
        engagement.id !== "_new" ||
        engagement.compatibleDate ||
        engagement.howToRespond ||
        engagement.users
    );
    const payload = {
      family_member_id: familyMember,
      eng_rows: filteredEngagements?.map(
        ({ compatibleDate, howToRespond, id, users }) => ({
          response_date: compatibleDate,
          content: howToRespond,
          id,
          corresponding_person_id: users,
        })
      ),
    };
    dispatch(createCustomerEngagement(payload as any));
  };

  // const onRemove = (engagementId: string) => {
  //   setEngagements(engagements.filter((e) => e.id !== engagementId));
  // };

  const onRemove = (index: number) => {
    // Filter out the engagement with the specified index
    const updatedEngagements = engagements.filter((_, i) => i !== index);
    // Update the state with the filtered engagements
    setEngagements(updatedEngagements);
  };

  const handleRemoveEngagementConfirmed = () => {
    if (removeEngagementIndex !== null) {
      const updatedEngagements = engagements.filter(
        (_, i) => i != removeEngagementIndex
      );
      
      setEngagements(updatedEngagements);
      setShowConfirmBox(false);
      setRemoveEngagementIndex(null);
    }
  };

  const handleCloseToast = () => {
    setToast({ message: "", type: "" });
    dispatch(resetCustomerEngagementCreateState());
  };
  useEffect(() => {
    const id = getParamValue("id");
    if (id) dispatch(fetchFamilyCodes(id));
  }, [dispatch]);

  const familyCodes = useSelector(
    (state: RootState) => state.familyCodes.familyCodes
  );

  const handleFamilyMemberChange = (e: any) => {
    setFamilyMember(e.target.value);
  };

  useEffect(() => {
    const fc = getParamValue("familyCode");
    if (fc != null) dispatch(fetchFamilyMembers(fc));
  }, [dispatch]);

  const familyMembers = useSelector(
    (state: RootState) => state.familyMembers.familyMembers
  );

  // useEffect(() => {
  //   if (familyMembers && familyMembers.length > 0) {
  //     setFamilyMember(familyMembers[0].value as any);
  //   }
  // }, [familyMembers]);

  useEffect(() => {
    if (familyMember) {
      
      // updateQueryParams({ familyMemberId: familyMember });
      dispatch(fetchCustomerEngagements(Number(familyMember)));
      setShowForm(true);
    } else if (familyMember == "") {
      setShowForm(false);
    }
  }, [dispatch, familyMember]);

  const OnClearFamilyMember = () => {
    // dispatch(fetchCustomerEngagements(0));
  };
  
  return (
    <>
      <div className={`${Style.orderFamilyCode} mb-2`}>
        <CustomSelectField
          name="familyCode"
          value={familyCode}
          onChange={(e) => setFamilyCode(e.target.value)}
          label={t("familyCode")}
          placeholder={t("familyCode")}
          options={familyCodes?.map((code) => ({
            label: code.label,
            value: code.label, // Setting the value to be the same as the label
          }))}
        />
        <CustomSelectField
          name="familyMember"
          value={familyMember}
          onChange={(e) => setFamilyMember(e.target.value)}
          options={familyMembers}
          label={t("familyMember")}
          placeholder={t("familyMember")}
        // className={Style.familyMemberSelect}
        // onClear={OnClearFamilyMember}
        />
      </div>

      {/* {formState.realEstate.map((estate, index) => (
            <div key={index} className={`${Style.assetFromRow3}`}>
              <InputField
                name={`realEstateValue-${index}`}
                value={estate.address}
                onChange={(e) => handleDynamicInputChange(e, "address", index)}
                label={t("realEstate")}
                placeholder={t("realEstate")}
              />
              <InputField
                name={`amount-${index}`}
                value={estate.amount}
                onChange={(e) => {
                  handleDynamicInputChange(e, "amount", index);
                }}
                label={t("amount")}
                placeholder={t("amount")}
              />
              <CustomSelectField
                name={`realEstateType-${index}`}
                value={estate.type}
                onChange={(e) => handleDynamicSelectChange(e, "type", index)}
                options={propertyTypes}
                label={t("realEstateType")}
                placeholder={t("realEstateType")}
                className={Style.selectFieldAsset}
              />
              {index !== 0 && (
                <Button
                  text={t("remove")}
                  type="danger"
                  size="small"
                  onClick={() => handleRemoveButtonClick(index)} // Update to use the new click handler
                  className={Style.removeButton}
                />
              )}
            </div>
          ))}
          {showConfirmBox && (
        <ConfirmationBox
          isOpen={showConfirmBox}
          title={`${t("areYouSureWantToDelete")}`}
          onConfirm={handleRemoveRealEstateConfirmed} // Use the new confirmed handler
          onCancel={() => setShowConfirmBox(false)}
        />
      )} */}
      {showForm ? (
        <>
         {toast.message && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={handleCloseToast}
              />
            )}
             {fetchedLoading && <FullscreenLoader />}
          <Form onSubmit={handleFormSubmit} isLoading={loading}  setErrors={setErrors} errors={errors}   disabledSubmitForm={toast.message == '関与記録が更新されました。' && toast.type == 'success' ? true :false}>
            <HeadingRow headingTitle={t("engagementInformation")} />
           
           
           

            <div className={`${Style.engagementFromRow1MainWrapper} mt-2`}>
              <div
                className={`${Style.engagementFromRow1} ${Style.engagementFromRow1Header} ${Style.customerFromRowGrid} p-2`}
              >
                <span className={Style.engagementLabels}></span>
                <span className={Style.engagementLabels}>
                  {t("compatibleDate")}
                </span>
                <span className={Style.engagementLabels}>
                  {t("howToRespond")}
                </span>
                <span className={Style.engagementLabels}>{t("users")}</span>
              </div>

              {engagements?.map((engagement, index) => (
                <div
                  key={engagement.id}
                  className={`${Style.engagementFromRow1} ${Style.customerFromRowGrid} pt-1 pl-2 pr-2`}
                >
                  <small>{index + 1}</small>
                  <InputDateField
                    name={`compatibleDate-${engagement.id}`}
                    value={engagement.compatibleDate}
                    onChange={(e) =>
                      handleInputChange(e, "compatibleDate", engagement.id)
                    }
                    placeholder={t("compatibleDate")}
                    className="mb-0"
                    validations={(engagement.compatibleDate  || engagement.howToRespond || engagement.users   ) && [{ type: "required" }]}
                    errorText={(engagement.compatibleDate  || engagement.howToRespond || engagement.users   ) && errors[`compatibleDate-${engagement.id}`]}
                  />
                  <TextAreaField
                    name={`howToRespond-${engagement.id}`}
                    value={engagement.howToRespond}
                    placeholder={t("howToRespond")}
                    onChange={(e) =>
                      handleInputChange(e, "howToRespond", engagement.id)
                    }
                    rows={2}
                    cols={50}
                    className={`${Style.textAreaField}`}
                    validations={(engagement.compatibleDate  || engagement.howToRespond || engagement.users   ) && [{ type: "required" }]}
                    errorText={(engagement.compatibleDate  || engagement.howToRespond || engagement.users   ) && errors[`howToRespond-${engagement.id}`]}
                  />
                  <CustomSelectField
                    name={`users-${engagement.id}`}
                    value={engagement.users}
                    options={users.map((user: any) => ({
                      label: user.label,
                      value: user.value,
                    }))}
                    onChange={(e) =>
                      handleInputChange(e, "users", engagement.id)
                    }
                    placeholder={t("users")}
                    className="mb-1"
                    validations={(engagement.compatibleDate  || engagement.howToRespond || engagement.users   ) && [{ type: "required" }]}
                    errorText={(engagement.compatibleDate  || engagement.howToRespond || engagement.users   ) && errors[`users-${engagement.id}`]}
                  />

                  {/* <Button
                  text={t("remove")}
                  type="danger"
                  size="small"
                  onClick={() => handleRemoveButtonClick(index)} // Update to use the new click handler
                  className={`mb-4 ${Style.removeButton}`}
                /> */}

                  {(engagement.id !== "_new" && isAuthenticated) && (
                    <Button
                      text={t("remove")}
                      type="danger"
                      size="small"
                      onClick={() => handleRemoveButtonClick(index)} // Update to use the new click handler
                      className={`mb-4 ${Style.removeButton}`}
                    />
                  )}
                </div>
              ))}
              {showConfirmBox && (
                <ConfirmationBox
                  isOpen={showConfirmBox}
                  title={`${t("areYouSureWantToDelete")}`}
                  onConfirm={handleRemoveEngagementConfirmed} // Use the new confirmed handler
                  onCancel={() => setShowConfirmBox(false)}
                />
              )}
            </div>
          </Form>
        </>
      ) : (
        <div className={Style.selectOptText}>
          <p>関与記録を入力する対象の顧客を選択してください。</p>
        </div>
      )}
    </>
  );
}
function updateQueryParams(arg0: { familyMemberId: string }) {
  throw new Error("Function not implemented.");
}
