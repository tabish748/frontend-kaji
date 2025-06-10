type ValidationInput = {
  value: any;  // We'll do runtime type checking instead
};

type Params = string | number | null | undefined;

type ValidationFunction = (
  input: ValidationInput,
  param?: Params
) => string | null;

// Import error messages from en.json
import en from "../../localization/en.json";
const error = en.error;

export const Validators: Record<string, ValidationFunction> = {
  isEmail: (input: ValidationInput): string | null => {
    if (typeof input.value !== 'string') return null;
    const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (input.value) {
      if (!input.value.match(emailPattern)) {
        return error.invalidEmail;
      }
    }
    return null;
  },
  minLength: (input: ValidationInput, params?: Params) => {
    if (typeof input.value !== 'string') return null;
    const numParams = Number(params);
    if (input.value && !isNaN(numParams) && input.value.length < numParams) {
      return error.minLength.replace("{min}", String(numParams));
    }
    return null;
  },
  maxLength: (input: ValidationInput, params?: Params): string | null => {
    if (typeof input.value !== 'string') return null;
    const numParams = Number(params);
    if (!isNaN(numParams) && input.value.length > numParams) {
      return error.maxLength.replace("{max}", String(numParams));
    }
    return null;
  },
  required: (input: ValidationInput, param?: Params): string | null => {
    // Handle array values (checkboxes)
    if (Array.isArray(input.value)) {
      if (input.value.length === 0) {
        return error.required.replace(
          "{field}",
          String(param || error.default)
        );
      }
      return null;
    }
    
    // Handle string values
    if (typeof input.value === 'string') {
      if (!input.value.trim()) {
        return error.required.replace(
          "{field}",
          String(param || error.default)
        );
      }
      return null;
    }

    // Handle other types (including null/undefined)
    if (input.value === null || input.value === undefined || input.value === '') {
      return error.required.replace(
        "{field}",
        String(param || error.default)
      );
    }
    return null;
  },
  isNumber: (input: ValidationInput): string | null => {
    if (typeof input.value !== 'string') return null;
    const pattern = /^[\d-]+$/;
    if (!pattern.test(input.value)) {
      return error.notNumber;
    }
    return null;
  },
  strongPassword: (input: ValidationInput): string | null => {
    if (typeof input.value !== 'string') return null;
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{6,}$/;
    if (!input.value.match(passwordPattern)) {
      return error.strongPassword;
    }
    return null;
  },
  noSpaceAllowed: (input: ValidationInput): string | null => {
    if (typeof input.value !== 'string') return null;
    if (input.value.includes(" ")) {
      return error.noSpace;
    }
    return null;
  },
  // onlyKanaCharacters: (input: ValidationInput): string | null => {
  //     const kanaOrRomajiPattern =  /^[-ァ-ンｦ-ﾟー\-ｰ\s]+$/u;
  //     if(input && input.value) {
  //         if (input.value.trim() !== '') {
  //             if (!input.value.match(kanaOrRomajiPattern)) {
  //                 return error.onlyKana;
  //             }
  //         }
  //     }
  // return null;
  // },
  minDate: (input: ValidationInput, params?: Params): string | null => {
    if (typeof input.value !== 'string') return null;
    if (!params) {
      return null;
    }
    const inputDate = new Date(input.value);
    const minDate = new Date(String(params));
    if (inputDate < minDate) {
      return error.minDate.replace("{date}", minDate.toLocaleDateString());
    }
    return null;
  },
  onlyAlphanumeric: (input: ValidationInput): string | null => {
    if (typeof input.value !== 'string') return null;
    const alphanumericPattern = /^[A-Za-z0-9-]+$/;
    if (input.value.trim() !== "") {
      if (!input.value.match(alphanumericPattern)) {
        return error.alphanumeric;
      }
    }
    return null;
  },
};
