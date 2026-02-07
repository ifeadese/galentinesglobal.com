import React, { useState } from "react";
import Button from "components/button";
import { useFormSubmission } from "hooks/useFormSubmission";
import SuccessMessage from "./success-message";
import LoadingOverlay from "./loading-overlay";
import FormField from "./form-field";
import styles from "./form.module.scss";

interface FeedbackFormData {
  eventAttended: string;
  isAnonymous: string;
  fullName: string;
  howDidYouFindIt: string;
  whatCouldBeBetter: string;
  otherComments: string;
  [key: string]: string;
}

const EVENT_OPTIONS = [
  "Galentines: In-Bold 2023",
  "Galentines: In-Purpose 2024",
  "Galentines: Made Anew 2024",
  "Galentines: The Love of God Conference 2026",
].map((event) => ({ value: event, label: event }));

interface FeedbackFormProps {
  description?: React.ReactNode;
  disabled?: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  description,
  disabled = false,
}) => {
  const [isAnonymous, setIsAnonymous] = useState(false);
  
  const initialData: FeedbackFormData = {
    eventAttended: "",
    isAnonymous: "",
    fullName: "",
    howDidYouFindIt: "",
    whatCouldBeBetter: "",
    otherComments: "",
  };

  const {
    formData,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
  } = useFormSubmission<FeedbackFormData>(initialData, {
    formspreeEndpoint: "https://formspree.io/f/mbdgdare",
    successMessage:
      "Your feedback has been received. We appreciate you taking the time to share your thoughts with us. Your input helps us create better experiences for future events.",
  });

  const handleAnonymousChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsAnonymous(checked);
    handleChange({
      ...e,
      target: {
        ...e.target,
        name: "isAnonymous",
        value: checked ? "yes" : "no",
      },
    } as React.ChangeEvent<HTMLInputElement>);
    if (checked) {
      handleChange({
        ...e,
        target: {
          ...e.target,
          name: "fullName",
          value: "",
        },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that fullName is provided if not anonymous
    if (!isAnonymous && !formData.fullName.trim()) {
      // This will be caught by HTML5 validation, but we can add custom validation here if needed
      return;
    }
    
    handleSubmit(e);
  };

  // Show success message instead of form when successfully submitted
  if (submitStatus.type === "success") {
    return (
      <SuccessMessage
        title="Thank You!"
        message={submitStatus.message}
      />
    );
  }

  return (
    <div className={styles.formWrapper}>
      {isSubmitting && <LoadingOverlay />}
      <form onSubmit={handleFormSubmit} className={styles.form}>
        {description && (
          <p className={styles.description}>{description}</p>
        )}

        <FormField
          name="eventAttended"
          label="Which Galentines event did you attend?"
          type="select"
          value={formData.eventAttended}
          onChange={handleChange}
          required
          disabled={isSubmitting || disabled}
          options={EVENT_OPTIONS}
        />

        <div className={styles.anonymousSection}>
          <div className={styles.field}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={handleAnonymousChange}
                disabled={isSubmitting || disabled}
                className={styles.checkbox}
              />
              <span>I would like to remain anonymous</span>
            </label>
          </div>

          {!isAnonymous && (
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
          )}
        </div>

        <FormField
          name="howDidYouFindIt"
          label="How did you find the conference today?"
          type="textarea"
          value={formData.howDidYouFindIt}
          onChange={handleChange}
          required
          placeholder="Share your experience..."
          disabled={isSubmitting || disabled}
        />

        <FormField
          name="whatCouldBeBetter"
          label="Is there anything you wish we did better?"
          type="textarea"
          value={formData.whatCouldBeBetter}
          onChange={handleChange}
          placeholder="Your suggestions are welcome..."
          disabled={isSubmitting || disabled}
        />

        <FormField
          name="otherComments"
          label="Any other comments?"
          type="textarea"
          value={formData.otherComments}
          onChange={handleChange}
          placeholder="Additional thoughts or feedback..."
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

export default FeedbackForm;
