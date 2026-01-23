import { useState } from "react";
import { isFormspreeConfigured, getFormspreeFormId } from "lib/formspree";
import { sanitizeFormData } from "lib/sanitize";

export interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
}

const FORM_UNAVAILABLE_MESSAGE =
  "Form submissions are temporarily unavailable. Please try again later or contact the event organizer.";

const FORM_SUBMISSION_FAILED_MESSAGE =
  "Form submission failed. Please try again later or contact the event organizer.";

const NETWORK_ERROR_MESSAGE =
  "Network error. Please check your connection and try again.";

interface UseFormSubmissionOptions {
  formspreeEndpoint?: string;
  successMessage?: string;
  onSuccess?: (data: Record<string, string>) => void;
}

export function useFormSubmission<T extends Record<string, string>>(
  initialData: T,
  options: UseFormSubmissionOptions = {}
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>({
    type: null,
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    // Type assertion is safe here because form input names should match keys in T
    // The form component ensures this by using proper name attributes
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      return updated as T;
    });
    // Clear status when user starts typing again
    if (submitStatus.type) {
      setSubmitStatus({ type: null, message: "" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const successMessage = options.successMessage || "Thank you! Your submission has been received successfully.";

    // Determine the Formspree endpoint
    let submitUrl: string;
    if (options.formspreeEndpoint) {
      submitUrl = options.formspreeEndpoint;
    } else {
      // Check if Formspree is configured via environment variable
      if (!isFormspreeConfigured()) {
        setSubmitStatus({
          type: "error",
          message: FORM_UNAVAILABLE_MESSAGE,
        });
        return;
      }
      const formId = getFormspreeFormId();
      if (!formId) {
        setSubmitStatus({
          type: "error",
          message: FORM_UNAVAILABLE_MESSAGE,
        });
        return;
      }
      submitUrl = `https://formspree.io/f/${formId}`;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Sanitize form data
      const sanitizedData = sanitizeFormData(formData);

      const response = await fetch(submitUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(sanitizedData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: successMessage,
        });
        setFormData(initialData);
        setIsSubmitting(false);
        // Call custom onSuccess handler
        if (options.onSuccess) {
          options.onSuccess(sanitizedData);
        }
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || FORM_SUBMISSION_FAILED_MESSAGE,
        });
        setIsSubmitting(false);
      }
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: NETWORK_ERROR_MESSAGE,
      });
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    isSubmitting,
    submitStatus,
    handleChange,
    handleSubmit,
  };
}
