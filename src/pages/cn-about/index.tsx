import Button from "@/components/button/button";
import CheckboxField from "@/components/checkbox-field/checkbox-field";
import ClientSection from "@/components/client-section/client-section";
import CustomSelectField from "@/components/custom-select/custom-select";
import { Form } from "@/components/form/form";
import InputDateField from "@/components/input-date/input-date";
import InputField from "@/components/input-field/input-field";
import RadioField from "@/components/radio-field/radio-field";
import SelectField from "@/components/select-field/select-field";
import TextAreaField from "@/components/text-area/text-area";
import { useLanguage } from "@/localization/LocalContext";
import React, { ChangeEvent, useState } from "react";

export default function CnAbout() {
  const { t } = useLanguage();

  const [errors, setErrors] = React.useState<Record<string, string | null>>({});
  const [formValues, setFormValues] = useState({
    text: "",
    email: "",
    customSelect: "",
    select: "",
    inputDate: "",
    customDate: "",
    textarea: "",
    radioOption: "1",
    checkboxOptions: [] as string[],
  });

  // Generic change handler for inputs and selects
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Specific handler for textarea
  const handleTextAreaChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Custom handler for date field that doesn't use events
  const handleCustomDateChange = (value: string) => {
    setFormValues(prev => ({
      ...prev,
      customDate: value
    }));
  };

  const handleCheckboxChange = (selectedValues: string[]) => {
    setFormValues(prev => ({
      ...prev,
      checkboxOptions: selectedValues
    }));
  };

  const handleSubmit = () => {
    console.log("submit", formValues);
  };

  return (
    <ClientSection heading={t("aboutPage.customerInfo")}>
      
      <Form onSubmit={handleSubmit} setErrors={setErrors} errors={errors}>
        <InputField
          label={t("Text Field")}
          name="text"
          type="text"
          placeholder={t("Enter text")}
          validations={[{ type: "required" }]}
          errorText={errors["text"] || undefined}
          value={formValues.text}
          onChange={handleInputChange}
        />
        <InputField
          label={t("Email Field")}
          name="email"
          type="email"
          placeholder={t("Enter email")}
          validations={[{ type: "required" }, { type: "email" }]}
          errorText={errors["email"] || undefined}
          value={formValues.email}
          onChange={handleInputChange}
        />
        <CustomSelectField
          label={t("Custom Select")}
          name="customSelect"
          options={[
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
          ]}
          placeholder={t("Select an option")}
          value={formValues.customSelect}
          onChange={handleInputChange}
          validations={[{ type: "required" }]}
          errorText={errors["customSelect"] || undefined}
        />
        <SelectField
          label={t("Select Field")}
          name="select"
          options={[
            { label: "Select 1", value: "1" },
            { label: "Select 2", value: "2" },
          ]}
          placeholder={t("Select an option")}
          value={formValues.select}
          onChange={handleInputChange}
          validations={[{ type: "required" }]}
          errorText={errors["select"] || undefined}
        />
        <InputDateField
          label={t("Input Date")}
          name="inputDate"
          placeholder={t("Select a date")}
          value={formValues.inputDate}
          onChange={handleInputChange}
          validations={[{ type: "required" }]}
          errorText={errors["inputDate"] || undefined}
        />
        {/* <CustomDateField
          label={t("Custom Date")}
          name="customDate"
          value={formValues.customDate}
          onChange={handleCustomDateChange}
          showMinutes={false}
        /> */}
        <TextAreaField
          label={t("Text Area")}
          name="textarea"
          placeholder={t("Enter details")}
          value={formValues.textarea}
          validations={[{ type: "required" }]}
          errorText={errors["textarea"] || undefined}
          onChange={handleTextAreaChange}
        />
        <RadioField
          label={t("Radio Options")}
          name="radioOption"
          options={[
            { label: "Option 1", value: "1" },
            { label: "Option 2", value: "2" },
            { label: "Option 3", value: "3" }
          ]}
          selectedValue={formValues.radioOption}
          onChange={handleInputChange}
          className="mb-3"
        />
        <CheckboxField
          label={t("Checkbox Options")}
          name="checkboxOptions"
          options={[
            { label: "Option A", value: "A" },
            { label: "Option B", value: "B" },
            { label: "Option C", value: "C" }
          ]}
          selectedValues={formValues.checkboxOptions}
          onChange={handleCheckboxChange}
          className="mb-3"
          validations={[{ type: "required" }]}
          errorText={errors["checkboxOptions"] || undefined}
        />
        <Button htmlType="submit" type="primary" text={t("login")} />
      </Form> 
    </ClientSection>
  );
}
