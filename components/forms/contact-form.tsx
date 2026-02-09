import React, { useState } from "react";
import Button from "components/button";
import { useFormSubmission } from "hooks/useFormSubmission";
import SuccessMessage from "./success-message";
import LoadingOverlay from "./loading-overlay";
import FormField from "./form-field";
import styles from "./form.module.scss";

interface ContactFormData {
  isAnonymous: string;
  fullName: string;
  email: string;
  category: string;
  eventSpecific: string;
  message: string;
  [key: string]: string;
}

const CATEGORY_OPTIONS = [
  "Inquiry",
  "Feedback",
  "Testimony",
  "Other",
].map((category) => ({ value: category, label: category }));

const EVENT_SPECIFIC_OPTIONS = [
  "No",
  "Yes. Galentines 2023: In-Bold",
  "Yes. Galentines 2024: In-Purpose",
  "Yes. Galentines 2025: Made Anew",
  "Yes. Galentines 2026: The Love of God Conference",
  "For future edition(s)",
].map((event) => ({ value: event, label: event }));

interface ContactFormProps {
  description?: React.ReactNode;
  disabled?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({
  description,
  disabled = false,
}) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const initialData: ContactFormData = {
    isAnonymous: "",
    fullName: "",
    email: "",
    category: "",
    eventSpecific: "",
    message: "",
  };

  const {
    formData,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
  } = useFormSubmission<ContactFormData>(initialData, {
    formspreeEndpoint: "https://formspree.io/f/xrepaldn",
    successMessage:
      "Thank you for reaching out! We've received your message and will get back to you as soon as possible.",
  });

  const handleAnonymousChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsAnonymous(checked);
    handleChange({
      ...e,
      target: { ...e.target, name: "isAnonymous", value: checked ? "yes" : "no" },
    } as React.ChangeEvent<HTMLInputElement>);
    if (checked) {
      ["fullName", "email"].forEach((field) => {
        handleChange({
          ...e,
          target: { ...e.target, name: field, value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      });
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnonymous && (!formData.fullName.trim() || !formData.email.trim())) return;
    handleSubmit(e);
  };

  // Show success message instead of form when successfully submitted
  if (submitStatus.type === "success") {
    return (
      <SuccessMessage
        title="Message Sent!"
        message={submitStatus.message}
      />
    );
  }

  const isDisabled = isSubmitting || disabled;

  return (
    <div className={styles.formWrapper}>
      {isSubmitting && <LoadingOverlay />}
      <form onSubmit={handleFormSubmit} className={styles.form}>
        {description && (
          <p className={styles.description}>{description}</p>
        )}

        <div className={styles.anonymousSection}>
          <div className={styles.field}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={handleAnonymousChange}
                disabled={isDisabled}
                className={styles.checkbox}
              />
              <span>Keep me anonymous</span>
            </label>
          </div>

          {!isAnonymous && (
            <>
              <FormField
                name="fullName"
                label="Full Name"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Jane Doe"
                disabled={isDisabled}
              />
              <FormField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your.email@example.com"
                disabled={isDisabled}
              />
            </>
          )}
        </div>

        <FormField
          name="category"
          label="Category"
          type="select"
          value={formData.category}
          onChange={handleChange}
          required
          disabled={isDisabled}
          options={CATEGORY_OPTIONS}
        />

        <FormField
          name="eventSpecific"
          label="Is this regarding any of our events?"
          type="select"
          value={formData.eventSpecific}
          onChange={handleChange}
          required
          disabled={isDisabled}
          options={EVENT_SPECIFIC_OPTIONS}
        />

        <FormField
          name="message"
          label="Message"
          type="textarea"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Your message..."
          disabled={isDisabled}
          isLast
        />

        {submitStatus.type === "error" && (
          <div className={`${styles.status} ${styles.error}`}>
            {submitStatus.message}
          </div>
        )}

        <div className={styles.submitContainer}>
          <Button
            type="submit"
            variant="primary"
            disabled={isDisabled}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
