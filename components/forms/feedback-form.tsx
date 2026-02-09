import React, { useState } from "react";
import Button from "components/button";
import { useFormSubmission } from "hooks/useFormSubmission";
import SuccessMessage from "./success-message";
import LoadingOverlay from "./loading-overlay";
import FormField from "./form-field";
import styles from "./form.module.scss";

interface FeedbackFormData {
  eventAttended: string;
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
  const [validationError, setValidationError] = useState("");
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  
  const initialData: FeedbackFormData = {
    eventAttended: "",
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

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const isFeedbackField = ["howDidYouFindIt", "whatCouldBeBetter", "otherComments"].includes(e.target.name);
    if (isFeedbackField) {
      if (validationError) setValidationError("");
      if (needsConfirmation) setNeedsConfirmation(false);
    }
    handleChange(e);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");
    
    const hasFeedback = formData.howDidYouFindIt.trim() || formData.whatCouldBeBetter.trim() || formData.otherComments.trim();
    if (!hasFeedback) {
      setValidationError("Please provide at least one response to the feedback questions.");
      setNeedsConfirmation(false);
      return;
    }
    
    if (!needsConfirmation) {
      setNeedsConfirmation(true);
      return;
    }
    
    setNeedsConfirmation(false);
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

        <FormField
          name="howDidYouFindIt"
          label="How did you find the conference today?"
          type="textarea"
          value={formData.howDidYouFindIt}
          onChange={handleFieldChange}
          placeholder="Share your experience..."
          disabled={isSubmitting || disabled}
        />

        <FormField
          name="whatCouldBeBetter"
          label="Is there anything you wish we did better?"
          type="textarea"
          value={formData.whatCouldBeBetter}
          onChange={handleFieldChange}
          placeholder="Your suggestions are welcome..."
          disabled={isSubmitting || disabled}
        />

        <FormField
          name="otherComments"
          label="Any other comments or testimonies you'd like to share?"
          type="textarea"
          value={formData.otherComments}
          onChange={handleFieldChange}
          placeholder="Additional thoughts or feedback..."
          disabled={isSubmitting || disabled}
          isLast
        />

        {validationError && (
          <div className={`${styles.status} ${styles.error}`}>
            {validationError}
          </div>
        )}

        {submitStatus.type === "error" && (
          <div className={`${styles.status} ${styles.error}`}>
            {submitStatus.message}
          </div>
        )}

        <div className={styles.submitContainer}>
          {needsConfirmation && (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setNeedsConfirmation(false)}
              disabled={isSubmitting || disabled}
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            variant="primary"
            disabled={isSubmitting || disabled}
          >
            {isSubmitting ? "Submitting..." : needsConfirmation ? "Confirm" : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackForm;
