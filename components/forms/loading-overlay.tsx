import React from "react";
import styles from "./form.module.scss";

const LoadingOverlay: React.FC = () => {
  return (
    <div className={styles.loadingOverlay}>
      <div className={styles.spinner}>
        <div className={styles.spinnerCircle}></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
