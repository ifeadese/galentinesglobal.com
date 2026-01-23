import React from "react";
import Button from "components/button";
import { useFormSubmission } from "hooks/useFormSubmission";
import SuccessMessage from "./success-message";
import LoadingOverlay from "./loading-overlay";
import FormField from "./form-field";
import styles from "./form.module.scss";

interface FeedbackFormData {
  howDidYouFindIt: string;
  whatCouldBeBetter: string;
  otherComments: string;
  [key: string]: string;
}

interface FeedbackFormProps {
  description?: React.ReactNode;
  disabled?: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  description,
  disabled = false,
}) => {
  const initialData: FeedbackFormData = {
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
      <form onSubmit={handleSubmit} className={styles.form}>
        {description && (
          <p className={styles.description}>{description}</p>
        )}

        <FormField
          name="howDidYouFindIt"
          label="How did you find the conference today?"
          type="textarea"
          value={formData.howDidYouFindIt}
          onChange={handleChange}
          required
          placeholder="Share your experience..."
          disabled={isSubmitting}
        />

        <FormField
          name="whatCouldBeBetter"
          label="Is there anything you wish we did better?"
          type="textarea"
          value={formData.whatCouldBeBetter}
          onChange={handleChange}
          placeholder="Your suggestions are welcome..."
          disabled={isSubmitting}
        />

        <FormField
          name="otherComments"
          label="Any other comments?"
          type="textarea"
          value={formData.otherComments}
          onChange={handleChange}
          placeholder="Additional thoughts or feedback..."
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

export default FeedbackForm;
