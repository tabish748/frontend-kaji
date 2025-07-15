import React, { forwardRef, useEffect, useState, useRef, useImperativeHandle } from "react";
import { IoClose } from "react-icons/io5";
import { FiPaperclip } from "react-icons/fi";
import styles from "../../styles/components/atoms/input.module.scss";
import Image from "next/image";

interface InputFieldProps {
  label?: string;
  tag?: any;
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  errorText?: string | null;
  labelClassName?: string;
  className?: string;
  dataLabel?: string;
  autocomplete?: string;
  id?: string;
  validations?: any;
  onClick?: any;
  ref?: any;
  readOnly?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode | string; // Add icon prop
  accept?: string; // File types allowed
  onFileChange?: (file: File | null) => void; // Custom file change handler
  fileValue?: File | null; // Actual file object for validation
  existingFileName?: string; // Existing file name to display
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
  label,
  tag,
  type = "text",
  value,
  onChange,
  disabled = false,
  errorText,
  placeholder,
  className = "",
  name,
  dataLabel,
  autocomplete,
  id,
  readOnly,
  onClick,
  onBlur,
  labelClassName,
  icon,
  accept,
  onFileChange,
  existingFileName
}, ref) => { 
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDisplayName, setFileDisplayName] = useState<string>("");
  const internalRef = useRef<HTMLInputElement>(null);

  // Expose custom methods through ref
  useImperativeHandle(ref, () => ({
    ...internalRef.current,
    clearFile: () => {
      if (internalRef.current) {
        internalRef.current.value = '';
        setSelectedFile(null);
        setFileDisplayName("");
        if (onFileChange) {
          onFileChange(null);
        }
      }
    },
    getFile: () => selectedFile,
    hasFile: () => !!selectedFile
  } as HTMLInputElement & { 
    clearFile: () => void; 
    getFile: () => File | null; 
    hasFile: () => boolean; 
  }));
    
  const getTagClass = (tagValue: string) => {
    switch (tagValue) {
      case 'firstTime':
        return 'tagFirstTime';
      case 'inherit':
        return 'tagInherit';
      case 'required':
        return 'tagRequired';
      default:
        return 'tagDefault'; // Default class for simple text tags
    }
  };

  // Render function for tags
  const renderTags = () => {
    if (Array.isArray(tag)) {
      return tag.map((item, index) => (
        <span key={index} className={`${styles.tag} ${getTagClass(item.value)}`}>
          {item.label}
        </span>
      ));
    } else if (typeof tag === 'string') {
      // Render a simple text tag with a default red color
      return <span className={`${styles.tag} ${styles.tagDefault}`}>{tag}</span>;
    }
    return null; 
  };

  // Render function for icon
  const renderIcon = () => {
    if (!icon) return null;
    if (typeof icon === 'string') {
      // Check if the string is a URL (simple check)
      if (icon.match(/\.(jpeg|jpg|gif|png|svg)$/) || icon.startsWith('http') || icon.startsWith('/')) {
        return (
          <span className={styles.iconWrapper}>
            <Image src={icon} alt="icon" width={20} height={20} />
          </span>
        );
      } else {
        // Handle text icon (emoji or text)
        return <span className={styles.iconWrapper} style={{ fontSize: '12px' }}>{icon}</span>;
      }
    }
    return <span className={styles.iconWrapper}>{icon}</span>;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    
    if (file) {
      const fileName = file.name;
      const fileType = file.type || fileName.split('.').pop()?.toUpperCase() || 'Unknown';
      setFileDisplayName(`${fileName} (${fileType})`);
    } else {
      setFileDisplayName("");
    }

    // Call custom file change handler if provided
    if (onFileChange) {
      onFileChange(file);
    }

    // Call original onChange with modified event for form compatibility
    if (onChange) {
      const modifiedEvent = {
        ...e,
        target: {
          ...e.target,
          value: file ? file.name : "",
          name: name || ""
        }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(modifiedEvent);
    }
  };

  // Handle file removal
  const handleFileRemove = () => {
    // Clear the actual input value so same file can be selected again
    if (internalRef.current) {
      internalRef.current.value = '';
    }
    
    setSelectedFile(null);
    setFileDisplayName("");
    
    if (onFileChange) {
      onFileChange(null);
    }

    // Create a synthetic event for form compatibility
    if (onChange) {
      const syntheticEvent = {
        target: {
          value: "",
          name: name || "",
          files: null
        }
      } as any;
      onChange(syntheticEvent);
    }
  };

  // Get file info for inline display
  const getFileInfo = () => {
    if (!selectedFile) return placeholder || "Choose file...";
    return selectedFile.name;
  };

  // For file inputs, render special UI
  if (type === 'file') {
    return (
      <div className={`${styles.inputWrapper} ${styles.fileInputWrapper}`}>
        {/* Label with tags */}
        <div className={` ${label ? "":"d-none"} ${labelClassName || ''}`}>
          {label && <>{label}</>}
          {renderTags()}
        </div>
        
        {/* File input container */}
        <div className={styles.simpleFileContainer}>
          <input
            type="file"
            onChange={handleFileChange}
            name={name}
            onBlur={onBlur}
            onClick={onClick}
            disabled={disabled}
            ref={internalRef}
            className={styles.hiddenFileInput}
            id={id || name}
            accept={accept}
          />
          
          {/* Clickable icon */}
          <label 
            htmlFor={id || name} 
            className={`${styles.fileIconButton} ${disabled ? styles.disabled : ''} ${errorText ? styles.error : ''}`}
            title={selectedFile ? `Selected: ${selectedFile.name}` : existingFileName ? `Current: ${existingFileName}` : placeholder || "Click to choose file"}
          >
            <FiPaperclip style={{ fontSize: '22px' }} />
          </label>
          
          {/* Selected file display or existing file display */}
          {selectedFile ? (
            <div className={styles.selectedFileDisplay}>
              <span className={styles.fileName}>{selectedFile.name}</span>
              <button 
                type="button" 
                className={styles.removeFileButton}
                onClick={handleFileRemove}
                disabled={disabled}
                title="Remove file"
              >
                <IoClose />
              </button>
            </div>
          ) : existingFileName ? (
            <div className={styles.selectedFileDisplay}>
              <span className={styles.fileName} >{existingFileName}</span>
            </div>
          ) : null}
        </div>
        
        {errorText && <div className={styles.errorText}>{errorText}</div>}
      </div>
    );
  }

  return (
    <div className={styles.inputWrapper}>
      <label htmlFor={name} className={` ${label ? "":"d-none"} ${labelClassName}`}>
        {label && <>{label}</>}
        {renderTags()}
      </label>
      <div style={{ position: 'relative' }} className={errorText ? styles.hasError : ""}>
        {renderIcon()}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          name={name}
          onBlur={onBlur}
          onClick={onClick}
          disabled={disabled}
          ref={ref}
          autoComplete={autocomplete}
          className={`${errorText ? styles.error : ""} ${className}`}
          readOnly={readOnly}
          id={id}
          style={icon ? { paddingLeft: 50 } : {}} // Add left padding if icon
        />
      </div>
      {errorText && <div className={styles.errorText}>{errorText}</div>}
    </div>
  );
});

InputField.displayName = 'InputField';

export default InputField;
