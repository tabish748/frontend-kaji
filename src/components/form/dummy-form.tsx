import React, { useState } from "react";
import { Form } from "../form/form";
import InputField from "../input-field/input-field";
import TextAreaField from "../text-area/text-area";
import CustomSelectField from "../custom-select/custom-select";
import SelectField from "../select-field/select-field";
import InputDateField from "../input-date/input-date";
import CustomDateField from "../custom-date-field/custom-date-field";
import CheckboxField from "../checkbox-field/checkbox-field";

const DummyForm = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    select: "",
    customSelect: "",
    date: "",
    customDate: "",
    checkboxes: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (name: string, value: any) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    alert("Form submitted!\n" + JSON.stringify(formValues, null, 2));
  };

  return (
    <Form onSubmit={handleSubmit} errors={errors} setErrors={setErrors}>
      <InputField
        name="name"
        label="Name"
        value={formValues.name}
        onChange={(e: any) => handleChange("name", e.target.value)}
        validations={[{ type: "required" }]}
      />
      <TextAreaField
        name="description"
        label="Description"
        value={formValues.description}
        onChange={(e: any) => handleChange("description", e.target.value)}
        validations={[]}
      />
      <SelectField
        name="select"
        label="Select Option"
        value={formValues.select}
        onChange={(e: any) => handleChange("select", e.target.value)}
        options={[
          { value: "", label: "Select..." },
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
        validations={[{ type: "required" }]}
      />
      <CustomSelectField
        name="customSelect"
        label="Custom Select"
        value={formValues.customSelect}
        onChange={(e: any) => handleChange("customSelect", e.target.value)}
        options={[
          { value: "", label: "Select..." },
          { value: "x", label: "Option X" },
          { value: "y", label: "Option Y" },
        ]}
        validations={[]}
      />
      <InputDateField
        name="date"
        label="Date"
        value={formValues.date}
        onChange={(e: any) => handleChange("date", e.target.value)}
        validations={[]}
      />
      <CustomDateField
        name="customDate"
        label="Custom Date"
        value={formValues.customDate}
        onChange={(e: any) => handleChange("customDate", e.target.value)}
        validations={[]}
      />
      <CheckboxField
        name="checkboxes"
        label="Choose options"
        options={[
          { value: "one", label: "One" },
          { value: "two", label: "Two" },
        ]}
        selectedValues={formValues.checkboxes}
        onChange={(vals: string[]) => handleChange("checkboxes", vals)}
      />
    </Form>
  );
};

export default DummyForm;
