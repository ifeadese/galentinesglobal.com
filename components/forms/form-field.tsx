import React from "react";
import styles from "./form.module.scss";

interface FormFieldProps {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select" | "date";
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
  isLast?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder,
  disabled = false,
  options,
  rows = 5,
  isLast = false,
}) => {
  return (
    <div className={`${styles.field} ${isLast ? styles.lastField : ""}`}>
      <label htmlFor={name} className={styles.label}>
        {label}
        {required && <span className={styles.required}>*</span>}
      </label>
      {type === "select" ? (
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={styles.select}
          disabled={disabled}
        >
          <option value="">Select an option</option>
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={styles.textarea}
          rows={rows}
          disabled={disabled}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type === "date" ? "date" : type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className={styles.input}
          disabled={disabled}
        />
      )}
    </div>
  );
};

export default FormField;
