import React from "react";
import Button from "components/button";
import { useFormSubmission } from "hooks/useFormSubmission";
import SuccessMessage from "./success-message";
import LoadingOverlay from "./loading-overlay";
import FormField from "./form-field";
import styles from "./form.module.scss";

const CHRISTIAN_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "Yes", label: "Yes" },
  { value: "No", label: "No" },
  { value: "Undecided", label: "Undecided" },
];

const VOLUNTEER_CAPACITY_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "Set Up & Take Down", label: "Set Up & Take Down" },
  { value: "Communications", label: "Communications" },
  { value: "Social Media", label: "Social Media" },
  { value: "Hospitality", label: "Hospitality" },
  { value: "Project Management", label: "Project Management" },
  { value: "Prayer", label: "Prayer" },
  { value: "Event Decoration", label: "Event Decoration" },
  { value: "Guest Experience", label: "Guest Experience" },
  { value: "Guest Minister's Care", label: "Guest Minister's Care" },
  { value: "Photography", label: "Photography" },
  { value: "Videography", label: "Videography" },
];

interface VolunteerFormData {
  fullName: string;
  email: string;
  phone: string;
  isChristian: string;
  volunteerCapacity: string;
  availabilityStartDate: string;
  availabilityEndDate: string;
  additionalInfo: string;
  [key: string]: string;
}

interface VolunteerFormProps {
  description?: React.ReactNode;
  disabled?: boolean;
}

const VolunteerForm: React.FC<VolunteerFormProps> = ({
  description,
  disabled = false,
}) => {
  const initialData: VolunteerFormData = {
    fullName: "",
    email: "",
    phone: "",
    isChristian: "",
    volunteerCapacity: "",
    availabilityStartDate: "",
    availabilityEndDate: "",
    additionalInfo: "",
  };

  const {
    formData,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
  } = useFormSubmission<VolunteerFormData>(initialData, {
    formspreeEndpoint: "https://formspree.io/f/mzdejaaa",
    successMessage:
      "Thank you for your interest in volunteering! We've received your application and will get back to you soon with more details.",
  });

  // Show success message instead of form when successfully submitted
  if (submitStatus.type === "success") {
    return (
      <SuccessMessage
        title="Application Received!"
        message={submitStatus.message}
      />
    );
  }

  return (
    <div className={styles.formWrapper}>
      {isSubmitting && <LoadingOverlay />}
      <form onSubmit={handleSubmit} className={styles.form}>
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
          disabled={isSubmitting}
        />

        <FormField
          name="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="your.email@example.com"
          disabled={isSubmitting}
        />

        <FormField
          name="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          placeholder="(123) 456-7890"
          disabled={isSubmitting}
        />

        <FormField
          name="isChristian"
          label="Are you a Christian?"
          type="select"
          value={formData.isChristian}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          options={CHRISTIAN_OPTIONS}
        />

        <FormField
          name="volunteerCapacity"
          label="In what capacity would you like to volunteer?"
          type="select"
          value={formData.volunteerCapacity}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          options={VOLUNTEER_CAPACITY_OPTIONS}
        />

        <FormField
          name="availabilityStartDate"
          label="Availability Start Date"
          type="date"
          value={formData.availabilityStartDate}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        <FormField
          name="availabilityEndDate"
          label="Availability End Date"
          type="date"
          value={formData.availabilityEndDate}
          onChange={handleChange}
          required
          disabled={isSubmitting}
        />

        <FormField
          name="additionalInfo"
          label="Is there anything else you'd like to share with us?"
          type="textarea"
          value={formData.additionalInfo}
          onChange={handleChange}
          placeholder="Any additional information you'd like to share..."
          disabled={isSubmitting}
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

export default VolunteerForm;
