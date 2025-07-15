import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Style from '../../styles/components/atoms/date-picker.module.scss';
import { ja } from "date-fns/locale/ja";
import InputField from '../input-field/input-field';

// Register the Japanese locale
registerLocale("ja", ja as any);

interface JapaneseDatePickerProps {
    initialDate: Date | string | null;
    label: string;
    disabled?: boolean;
    onDateChange: any;
    className?: string;
}
function parseDate(dateInput: string | number | Date | null) {
    if (dateInput instanceof Date) return dateInput;
    if (typeof dateInput === 'string') {
        const parsedDate = new Date(dateInput);
        if (!isNaN(parsedDate.getTime())) return parsedDate;
    }
    return null;
}
const JapaneseDatePicker: React.FC<JapaneseDatePickerProps> = ({ initialDate, onDateChange, label, disabled, className }) => {
    const [date, setDate] = useState<Date | null>(() => parseDate(initialDate));
    const [inputValue, setInputValue] = useState<string>(initialDate instanceof Date ? initialDate.toISOString().split('T')[0] : (initialDate || ''));
    const [isComposing, setIsComposing] = useState(false);

    const [japaneseDateText, setJapaneseDateText] = useState<string>('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const newDate = parseDate(initialDate);
        if (newDate) {
            setDate(newDate);
            setInputValue(newDate.toISOString().split('T')[0]);
        }
    }, [initialDate]);

    useEffect(() => {
        if(!inputValue)
            {
            onDateChange('')
            }
    },[inputValue, onDateChange])

    useEffect(() => {
        updateInputAndText(date);
        // Ensure the input is focused on initial render
        
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [date]);
    useEffect(() => {
        
        if (inputRef.current) {
            inputRef.current.focus();
        }
    },[inputValue]) 
    const updateInputAndText = (date: any) => {
        
        if (!date) return; // Add this line to guard against undefined dates
    
        const formattedDate = date.toLocaleDateString('ja-JP');
        setInputValue(formattedDate);  // Update the input to show the date
        updateJapaneseDateText(date);  // Update the Japanese date text
        onDateChange(formattedDate);  // Propagate changes to the parent component
    };

   

    const updateJapaneseDateText = (date: Date) => {
        const eraInfo = getJapaneseEra(date);
        if (eraInfo) {
            const { era, year } = eraInfo;
            const month = date.getMonth() + 1;
            const day = date.getDate();
            setJapaneseDateText(`${era}${year}年${month}月${day}日`);
        } else {
            setJapaneseDateText(''); // Clear if no valid era found
        }
    };

    const getJapaneseEra = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // JavaScript months are zero-indexed, add 1 for human-readable month.
        const day = date.getDate();
    
        // Reiwa era started May 1, 2019
        if (year > 2019 || (year === 2019 && (month > 5 || (month === 5 && day >= 1)))) {
            return { era: "令和", year: year - 2018 };
        }
        // Heisei era from January 8, 1989 to April 30, 2019
        if (year > 1989 || (year === 1989 && (month > 1 || (month === 1 && day >= 8)))) {
            return { era: "平成", year: year - 1988 };
        }
        // Showa era from December 25, 1926 to January 7, 1989
        if (year > 1926 || (year === 1926 && (month > 12 || (month === 12 && day >= 25)))) {
            return { era: "昭和", year: year - 1925 };
        }
        // Taisho era from July 30, 1912 to December 24, 1926
        if (year > 1912 || (year === 1912 && (month > 7 || (month === 7 && day >= 30)))) {
            return { era: "大正", year: year - 1911 };
        }
        // Meiji era from September 8, 1868 to July 29, 1912
        if (year > 1868 || (year === 1868 && (month > 9 || (month === 9 && day >= 8)))) {
            return { era: "明治", year: year - 1867 };
        }
        return null;  // No era matched, or date is before Meiji era.
    };


   
    const convertWarekiToSeireki = (input: string): Date | null => {
        if (!input) return null;
        let baseString = input.toUpperCase().replace(/\./g, '/').replace(/-/g, '/');
        let parts = baseString.split('/');
        if (parts.length !== 3) return null;
    
        const firstPart = parts[0];
        const month = parseInt(parts[1]);
        const day = parseInt(parts[2]);
        let year;
    
        if (firstPart.match(/^\d+$/)) {  // Check if it's a Western year
            year = parseInt(firstPart);
        } else {
            const gengou = firstPart.slice(0, 1);
            const yearPart = parseInt(firstPart.slice(1));
            if (isNaN(yearPart) || isNaN(month) || isNaN(day)) return null;
    
            switch (gengou) {
                case 'M': year = 1868 + yearPart - 1; break;
                case 'T': year = 1912 + yearPart - 1; break;
                case 'S': year = 1926 + yearPart - 1; break;
                case 'H': year = 1989 + yearPart - 1; break;
                case 'R': year = 2019 + yearPart - 1; break;
                default: return null; // Unrecognized era or format
            }
        }
    
        const checkDate = new Date(year, month - 1, day);
        return isNaN(checkDate.getTime()) ? null : checkDate;
    };

 
    const handleChange = (input: string) => {
        // if (!isComposing) {
        
        setInputValue(input);
        const convertedDate = convertWarekiToSeireki(input);
        if (convertedDate) {
            setDate(convertedDate);
        } else {
            setJapaneseDateText('');
        }
    // }
    };
  
     
    const CustomInput = forwardRef<HTMLInputElement, { value: string, onClick: () => void }>(({ value, onClick }, ref) => {
   
       return <InputField
            type="text"
            value={inputValue }
            placeholder=""
            onChange={(e) => handleChange(e.target.value)}
            onClick={onClick}
            ref={inputRef}
            className={Style.dateInput}
            disabled={disabled}
            // onCompositionEnd={handleCompositionEnd}
            // onCompositionStart={handleCompositionStart}
          
        />
});
    CustomInput.displayName = 'CustomInput';

    return (
        <div className={`${Style.datePickerWrapper} ${className}`}>
            {label && <label htmlFor="">{label}</label>} 
            <div>
            <DatePicker
                selected={date}
                onChange={(newDate) => updateInputAndText(newDate)}
                locale='ja'
                customInput={<CustomInput value={''} onClick={function (): void {
                    throw new Error('Function not implemented.');
                } } />}
            />
            </div>
            <p className={Style.jpDateTxt}>{japaneseDateText}</p>
        </div>
    );
}

export default JapaneseDatePicker;
