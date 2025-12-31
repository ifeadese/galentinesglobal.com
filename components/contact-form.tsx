import React, { useState, useEffect } from "react";
import Button from "components/button";
import styles from "components/contact-form.module.scss";
import { isFormspreeConfigured, getFormspreeFormId } from "lib/formspree";
import { sanitizeFormData } from "lib/sanitize";

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

  // Check for success parameter in URL (from Formspree redirect)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('success') === 'true') {
        setSubmitStatus({
          type: "success",
          message: "We've received your submission and sent you a confirmation email. There's one more email coming your way on January 15th to confirm your RSVP closer to the event—keep an eye out for it.",
        });
        setFormData(createEmptyFormData(fields));
        // Clean up URL
        window.history.replaceState({}, '', window.location.pathname);
      }
    }
  }, [fields]);

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
    
    // Check if Formspree is configured
    if (!isFormspreeConfigured()) {
      setSubmitStatus({
        type: "error",
        message: "Form submissions are temporarily unavailable. Please try again later or contact the event organizer.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Build data object from configured fields
      const dataToSend: Record<string, string> = {};
      fields.forEach((field) => {
        dataToSend[field.name] = formData[field.name] || "";
      });

      // Sanitize form data
      const sanitizedData = sanitizeFormData(dataToSend);

      // Create redirect URL with success parameter
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}${window.location.pathname}?success=true`
        : undefined;

      // Submit directly to Formspree with redirect URL
      const formId = getFormspreeFormId();
      if (!formId) {
        throw new Error('Formspree not configured');
      }

      const submitUrl = `https://formspree.io/f/${formId}`;
      const dataWithRedirect = redirectUrl ? { ...sanitizedData, _next: redirectUrl } : sanitizedData;

      const response = await fetch(submitUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(dataWithRedirect),
      });

      const result = await response.json();

      if (response.ok) {
        // If redirect URL is provided, redirect to it
        if (redirectUrl) {
          window.location.href = redirectUrl;
        } else {
          setSubmitStatus({
            type: "success",
            message: "We've received your submission and sent you a confirmation email. See you soon! We'll ask you to confirm your RSVP closer to the event—keep an eye out for a confirmation email on January 15th.",
          });
          setFormData(createEmptyFormData(fields));
          setIsSubmitting(false);
          // Call custom onSubmit handler with the data that was sent
          if (onSubmit) {
            onSubmit(dataToSend as FormData);
          }
        }
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Form submission failed. Please try again later or contact the event organizer.",
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
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
    <div className={styles.formWrapper}>
      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner}>
            <div className={styles.spinnerCircle}></div>
          </div>
        </div>
      )}
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
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
    </div>
  );
};

export default ContactForm;

