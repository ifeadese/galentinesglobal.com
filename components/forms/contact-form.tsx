import React from "react";
import Button from "components/button";
import { useFormSubmission } from "hooks/useFormSubmission";
import SuccessMessage from "./success-message";
import LoadingOverlay from "./loading-overlay";
import FormField from "./form-field";
import styles from "./form.module.scss";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  [key: string]: string;
}

interface ContactFormProps {
  description?: React.ReactNode;
  disabled?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({
  description,
  disabled = false,
}) => {
  const initialData: ContactFormData = {
    name: "",
    email: "",
    subject: "",
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

  // Show success message instead of form when successfully submitted
  if (submitStatus.type === "success") {
    return (
      <SuccessMessage
        title="Message Sent!"
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
          name="name"
          label="Name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your name"
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
          name="subject"
          label="Subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What is this regarding?"
          disabled={isSubmitting}
        />

        <FormField
          name="message"
          label="Message"
          type="textarea"
          value={formData.message}
          onChange={handleChange}
          required
          placeholder="Your message..."
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
            {isSubmitting ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
