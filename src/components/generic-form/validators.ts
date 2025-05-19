
type ValidationInput = {
    value: string;
};

type Params = string | number | null | undefined;

type ValidationFunction = (input: ValidationInput, param?: Params) => string | null;

export const Validators: Record<string, ValidationFunction> = {
    isEmail: (input: ValidationInput): string | null => {
        const emailPattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
        if (input.value) {
            if (!input.value.match(emailPattern)) {
                return 'Invalid email address';
            }
            return null;
        }
        else
        return null;

    },
    minLength: (input: ValidationInput, params?: Params) => {
        const numParams = Number(params);
        if (input.value && !isNaN(numParams) && input.value.length < numParams) { 
            return `入力は最低${numParams}文字必要です。`;
        }
        return null;
    },
    maxLength: (input: ValidationInput, params?: Params): string | null => {
        const numParams = Number(params);
        if (!isNaN(numParams) && input.value.length > numParams) {
            return `${numParams}文字以内で入力してください。`;
        }
        return null;
    },
    required: (input: ValidationInput, param?: Params): string | null => {
        
        const newInput = String(input.value || '').trim(); // Convert undefined or null to an empty string and trim it

        if (!newInput) { // Check if the trimmed string is empty
            return `${param || '返金日'} は必須項目です。`;
        }

        return null;
    },

    isNumber: (input: ValidationInput): string | null => {
        const pattern = /^[\d-]+$/;
        if (!pattern.test(input.value)) {
            return 'Input must be a number';
        }
        return null;
    },

    strongPassword: (input: ValidationInput): string | null => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{6,}$/;
        if (!input.value.match(passwordPattern)) {
            return 'Password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character';
        }
        return null;
    },
    noSpaceAllowed: (input: ValidationInput): string | null => {
        if (input.value.includes(' ')) {
            return 'スペースは使用できません。';
        }
        return null;
    },
    onlyKanaCharacters: (input: ValidationInput): string | null => {
        
        const kanaOrRomajiPattern =  /^[-ァ-ンｦ-ﾟー\-ｰ\s]+$/u; 
        if(input && input.value) {
            if (input.value.trim() !== '') {
                if (!input.value.match(kanaOrRomajiPattern)) {
                    return 'カナ文字とスペースのみ入力可能です。'; 
                }
            }
        }
    
    return null;
    },
    minDate: (input: ValidationInput, params?: Params): string | null => {
        if (!params) {
            return null;  // No parameter provided, so skip the check
        }

        const inputDate = new Date(input.value);
        const minDate = new Date(String(params));

        if (inputDate < minDate) {
            return `${minDate.toLocaleDateString()}以降の日付である必要があります。`;
        }
        return null;
    },
    onlyAlphanumeric: (input: ValidationInput): string | null => {
        const alphanumericPattern = /^[A-Za-z0-9-]+$/;
        // Check if the input value is not empty
        if (input.value.trim() !== '') {
            // If not empty, validate against the Alphanumeric pattern
            if (!input.value.match(alphanumericPattern)) {
                return '半角英数字で入力してください。';
            }
        }
        return null;
    },
    
};
