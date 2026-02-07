import React from "react";
import Button from "components/button";
import { useFormSubmission } from "hooks/useFormSubmission";
import SuccessMessage from "./success-message";
import LoadingOverlay from "./loading-overlay";
import FormField from "./form-field";
import styles from "./form.module.scss";

interface RSVPFormData {
  fullName: string;
  email: string;
  phone: string;
  [key: string]: string;
}

interface RSVPFormProps {
  description?: React.ReactNode;
  disabled?: boolean;
}

const RSVPForm: React.FC<RSVPFormProps> = ({
  description,
  disabled = false,
}) => {
  const initialData: RSVPFormData = {
    fullName: "",
    email: "",
    phone: "",
  };

  const {
    formData,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
  } = useFormSubmission<RSVPFormData>(initialData, {
    formspreeEndpoint: "https://formspree.io/f/xqeazbvb",
    successMessage:
      "Registration is a two-step process. Please check the email sent to you for additional important information on step 2.",
  });

  // Show success message instead of form when successfully submitted
  if (submitStatus.type === "success") {
    return (
      <SuccessMessage
        title="Step 1 Complete!"
        message={submitStatus.message}
        spamNote={
          <>
            💌 <strong>Tip:</strong> Check your spam or junk folder if you
            don&apos;t see the confirmation email in your inbox.
          </>
        }
      />
    );
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;
    handleSubmit(e);
  };

  return (
    <div className={styles.formWrapper}>
      {isSubmitting && <LoadingOverlay />}
      <form onSubmit={handleFormSubmit} className={styles.form}>
        {description && (
          <p className={styles.description}>{description}</p>
        )}

        <FormField
          name="fullName"
          label="Full Name"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          required
          placeholder="Jane Doe"
          disabled={isSubmitting || disabled}
        />

        <FormField
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
          disabled={isSubmitting || disabled}
        />

        <FormField
          name="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="(123) 456-7890"
          disabled={isSubmitting || disabled}
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
            disabled={isSubmitting || disabled}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default RSVPForm;
