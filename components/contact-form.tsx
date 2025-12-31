import React, { useState } from "react";
import Button from "components/button";
import styles from "components/contact-form.module.scss";

export interface FormData {
  name: string;
  email: string;
  message: string;
  [key: string]: string; // Allow additional fields
}

interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
  submitButtonText?: string;
  description?: React.ReactNode;
  disabled?: boolean; // Disable form submission (e.g., when Google connection is not set up)
  fields?: Array<{
    name: string;
    label: string;
    type?: "text" | "email" | "textarea" | "tel";
    required?: boolean;
    placeholder?: string;
  }>;
}

// Helper to create empty form data - extracted outside component for performance
function createEmptyFormData(
  fields: Array<{ name: string }>,
  defaultFields: FormData = { name: "", email: "", message: "" }
): FormData {
  const initial: FormData = { ...defaultFields };
  fields.forEach((field) => {
    initial[field.name] = "";
  });
  return initial;
}

const ContactForm: React.FC<ContactFormProps> = ({
  onSubmit,
  submitButtonText = "Submit",
  description,
  disabled = false,
  fields = [
    { name: "name", label: "Name", type: "text", required: true, placeholder: "Your name" },
    { name: "email", label: "Email", type: "email", required: true, placeholder: "your.email@example.com" },
    { name: "message", label: "Message", type: "textarea", required: true, placeholder: "Your message" },
  ],
}) => {
  const [formData, setFormData] = useState<FormData>(
    () => createEmptyFormData(fields)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear status when user starts typing again
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Build data object from configured fields
      const dataToSend: Record<string, string> = {};
      fields.forEach((field) => {
        dataToSend[field.name] = formData[field.name] || "";
      });

      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: "We've received your submission and sent you a confirmation email. See you soon!",
        });
        setFormData(createEmptyFormData(fields));
        // Call custom onSubmit handler with the data that was sent
        if (onSubmit) {
          onSubmit(dataToSend as FormData);
        }
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show success message instead of form when successfully submitted
  if (submitStatus.type === "success") {
    return (
      <div className={styles.form}>
        <div className={styles.successMessage}>
          <span className={styles.icon}>🎉</span>
          <h2 className={styles.title}>Yayyy!</h2>
          <p className={styles.message}>
            {submitStatus.message}
          </p>
          <p className={styles.spamNote}>
            💌 <strong>Tip:</strong> Check your spam or junk folder if you don&apos;t see the confirmation email in your inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {description && (
        <p className={styles.description}>{description}</p>
      )}
      {fields.map((field) => (
        <div key={field.name} className={styles.field}>
          <label htmlFor={field.name} className={styles.label}>
            {field.label}
            {field.required && <span className={styles.required}>*</span>}
          </label>
          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              className={styles.textarea}
              rows={5}
            />
          ) : (
            <input
              id={field.name}
              name={field.name}
              type={field.type || "text"}
              value={formData[field.name] || ""}
              onChange={handleChange}
              required={field.required}
              placeholder={field.placeholder}
              className={styles.input}
            />
          )}
        </div>
      ))}

      {submitStatus.type === "error" && (
        <div
          className={`${styles.status} ${styles.error}`}
        >
          {submitStatus.message}
        </div>
      )}

      <div className={styles.submitContainer}>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting || disabled}
        >
          {isSubmitting ? "Submitting..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
};

export default ContactForm;

