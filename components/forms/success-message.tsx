import React from "react";
import styles from "./form.module.scss";

interface SuccessMessageProps {
  title: string;
  message: string;
  spamNote?: React.ReactNode;
  icon?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({
  title,
  message,
  spamNote,
  icon = "🎉",
}) => {
  return (
    <div className={styles.form}>
      <div className={styles.successMessage}>
        <span className={styles.icon}>{icon}</span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        {spamNote && <p className={styles.spamNote}>{spamNote}</p>}
      </div>
    </div>
  );
};

export default SuccessMessage;
