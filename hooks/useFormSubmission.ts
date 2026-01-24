import { useState } from "react";
import { submitToFormspree } from "lib/formspree";
import { sanitizeFormData } from "lib/sanitize";

export interface SubmitStatus {
  type: "success" | "error" | null;
  message: string;
}

const FORM_SUBMISSION_FAILED_MESSAGE =
  "Form submission failed. Please try again later or contact the event organizer.";

const NETWORK_ERROR_MESSAGE =
  "Network error. Please check your connection and try again.";

interface UseFormSubmissionOptions {
  formspreeEndpoint: string; // Required - each form must provide its endpoint
  successMessage?: string;
  onSuccess?: (data: Record<string, string>) => void;
}

export function useFormSubmission<T extends Record<string, string>>(
  initialData: T,
  options: UseFormSubmissionOptions
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

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // Sanitize form data
      const sanitizedData = sanitizeFormData(formData);

      // Submit using the centralized Formspree function
      const result = await submitToFormspree(sanitizedData, {
        endpoint: options.formspreeEndpoint,
      });

      if (result.success) {
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
