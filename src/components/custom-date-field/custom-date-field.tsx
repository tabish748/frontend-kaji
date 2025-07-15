import React, { useState, useEffect,forwardRef } from 'react';
import InputDateField from '../input-date/input-date';
import SelectField from '../select-field/select-field';
import styles from "../../styles/components/molecules/custom-date-field.module.scss";
import { useLanguage } from "@/localization/LocalContext";

interface CustomDateFieldProps {
  label?: string;
  value: any;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  showMinutes: boolean;
  isUserInteract?: boolean;
  readOnly?: boolean;
  tag?: any;
  errorText ?: any;
  validations ?: any;
  placeholder ?: any;
  ref ?: any;
  maxDate ?: any;
}

const CustomDateField: React.FC<CustomDateFieldProps> = forwardRef<HTMLDivElement, CustomDateFieldProps>(({
  label,
  value,
  name,
  onChange,
  showMinutes,
  tag,
  readOnly,
  errorText ,
  maxDate,
}, ref) => {
  const [localDate, setLocalDate] = useState('');
  const [localHour, setLocalHour] = useState('00');
  const [localMinute, setLocalMinute] = useState('00');
  const [isUserInteracting, setIsUserInteracting] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (isUserInteracting && value) {
      const [newDate, newTime] = value.split('T');
      const newHour = newTime?.substring(0, 2) || '00';
      const rawMinute = newTime?.substring(3, 5) || '00';
      const newMinute = snapMinutesToInterval(rawMinute);
      setLocalDate(newDate || '');
      setLocalHour(newHour);
      setLocalMinute(newMinute);
    }
  }, [value, isUserInteracting]);

  useEffect(() => {
    if (isUserInteracting) {
      let newValue = '';
      if (localDate) {
        newValue = `${localDate}T${localHour}:${localMinute}`;
        
      }
      onChange({ target: { name, value: newValue } } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [localDate, localHour, localMinute, name, isUserInteracting, onChange]);

  const snapMinutesToInterval = (minutes: string) => {
    const minuteIntervals = [0, 15, 30, 45];
    const minuteNumber = parseInt(minutes, 10);
    const closestInterval = minuteIntervals.reduce((prev, curr) => (
      Math.abs(curr - minuteNumber) < Math.abs(prev - minuteNumber) ? curr : prev
    ));
    return closestInterval.toString().padStart(2, '0');
  };

  const hourOptions = Array.from({ length: 24 }, (_, i) => ({ value: `${i < 10 ? '0' + i : i}`, label: `${i < 10 ? '0' + i : i}` }));
  const minuteOptions = ['00', '15', '30', '45'].map(min => ({ value: min, label: min }));

  return (
   <>
    <div className={styles.customDateFieldWrapper} ref={ref}>
      <InputDateField
        label={label}
        tag={tag}
        value={localDate}
        onChange={(e) => {
          setIsUserInteracting(true);
          setLocalDate(e.target.value);
        }}
        name={`${name}-date`}
        placeholder={t("inquiryRequestedDate")}
        inputType="date"
        readOnly={readOnly}
        errorText={errorText}
        maxDate={maxDate}
      />
      <SelectField
        options={hourOptions}
        value={localHour}
        onChange={(e) => {
          setIsUserInteracting(true);
          setLocalHour(e.target.value);
        }}
        name={`${name}-hour`}
        placeholder='localHour'
        className={label && 'mt-30'}
        disabled={readOnly}
      />
      {showMinutes && (
        <SelectField
          options={minuteOptions}
          value={localMinute}
          placeholder='localMinute'
          onChange={(e) => {
            setIsUserInteracting(true);
            setLocalMinute(e.target.value);
          }}
          className={label && 'mt-30'}
          name={`${name}-minute`}
          disabled={readOnly}
        />
      )}
    </div>
    {/* {errorText && <div className={styles.errorText}>{errorText}</div>}  */}
    </>
  );
});

CustomDateField.displayName = 'CustomDateField';

export default CustomDateField;
