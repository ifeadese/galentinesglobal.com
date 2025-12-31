import React from "react";
import Link from "next/link";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import { getCMSById, getEventFromCMS } from "helpers";
import { CMSContent } from "types";
import styles from "./terms.module.scss";

interface TermsPageProps {
  cms: string;
}

export default function TermsPage({ cms: stringifiedCMS }: TermsPageProps) {
  const cms: CMSContent = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);
  const contactEmail = cms.general.contactEmailAddress || 'galentinesglobal@gmail.com';

  return (
    <Layout event={event}>
      <TitleHero
        image={cms.about.heroImage || "/images/ladies.JPG"}
        imageAlt={cms.about.heroImageAlt || "Galentines Community"}
        title="Terms of Service"
        subtitle="Terms and conditions for using our services"
      />

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.lastUpdated}>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className={styles.section}>
              <h2 className={styles.heading}>1. Service Description</h2>
              <p className={styles.paragraph}>
                <strong>Galentines Global</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates an event management 
                platform that enables users to:
              </p>
              <ul className={styles.list}>
                <li>Submit RSVP forms for event registration</li>
                <li>Apply to partner with us or volunteer for events</li>
                <li>Receive email confirmations for submissions</li>
                <li>Access event information and updates</li>
              </ul>
              <p className={styles.paragraph}>
                <strong>For Administrators:</strong> Our platform uses Google services (Google Sheets API, Google Drive API, 
                and Gmail) to enable event organizers to manage form submissions. Administrators can connect their Google 
                account to store submissions in Google Sheets, send email notifications, and organize event data. 
                This functionality is only available to authorized administrators and requires explicit Google account 
                authorization. Administrators only access Google Sheets files they explicitly select or create for 
                managing event submissions.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>2. Acceptance of Terms</h2>
              <p className={styles.paragraph}>
                By accessing and using our website, you accept and agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>3. Use of Services</h2>
              <p className={styles.paragraph}>
                You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className={styles.list}>
                <li>Submit false, misleading, or fraudulent information</li>
                <li>Use the services to transmit any harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to any part of the services</li>
                <li>Interfere with or disrupt the services or servers</li>
                <li>Use the services in any way that violates applicable laws or regulations</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>4. Data Collection and Usage</h2>
              <p className={styles.paragraph}>
                When you submit forms on our website, we collect and process your information as described in our 
                <Link href="/privacy" legacyBehavior>
                  <a className={styles.link}> Privacy Policy</a>
                </Link>. 
                Your submissions are stored in Google Sheets (managed by our event organizers) and used solely for 
                event management purposes. We do not sell or share your personal information with third parties for 
                advertising or marketing purposes.
              </p>
              <p className={styles.paragraph}>
                <strong>Google Services Integration:</strong> Our platform integrates with Google services to provide 
                administrative functionality. This integration requires authorized administrators to grant access to 
                Google Sheets, Google Drive, and Gmail. This access is limited to:
              </p>
              <ul className={styles.list}>
                <li>Storing form submissions in administrator-selected Google Sheets</li>
                <li>Sending email confirmations via Gmail</li>
                <li>Creating and managing Google Sheets files for event organization</li>
              </ul>
              <p className={styles.paragraph}>
                Regular users (form submitters) do not need to connect a Google account and are not required to 
                provide Google authorization.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>5. User Responsibilities</h2>
              <p className={styles.paragraph}>
                You are responsible for:
              </p>
              <ul className={styles.list}>
                <li>Providing accurate and complete information when submitting forms</li>
                <li>Maintaining the confidentiality of any account credentials (for administrators)</li>
                <li>Complying with all applicable laws and regulations</li>
                <li>Notifying us of any unauthorized use of your information</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>6. Intellectual Property</h2>
              <p className={styles.paragraph}>
                All content on this website, including text, graphics, logos, images, and software, is the property 
                of Galentines Global or its content suppliers and is protected by copyright and other intellectual 
                property laws. You may not reproduce, distribute, or create derivative works from any content without 
                our express written permission.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>7. Service Availability</h2>
              <p className={styles.paragraph}>
                We strive to provide reliable service but do not guarantee that the services will be available at all 
                times or free from errors. We reserve the right to modify, suspend, or discontinue any part of the 
                services at any time without prior notice.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>8. Limitation of Liability</h2>
              <p className={styles.paragraph}>
                To the fullest extent permitted by law, Galentines Global shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether 
                incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses 
                resulting from your use of the services.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>9. Indemnification</h2>
              <p className={styles.paragraph}>
                You agree to indemnify and hold harmless Galentines Global, its officers, directors, employees, and 
                agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising out 
                of or related to your use of the services or violation of these Terms.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>10. Changes to Terms</h2>
              <p className={styles.paragraph}>
                We reserve the right to modify these Terms of Service at any time. We will notify users of any material 
                changes by posting the updated terms on this page and updating the &quot;Last updated&quot; date. 
                Your continued use of the services after such changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>11. Governing Law</h2>
              <p className={styles.paragraph}>
                These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction 
                in which Galentines Global operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>12. Contact Information</h2>
              <p className={styles.paragraph}>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className={styles.contactInfo}>
                <p className={styles.paragraph}>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${contactEmail}`} className={styles.link}>
                    {contactEmail}
                  </a>
                </p>
                <p className={styles.paragraph}>
                  <strong>Website:</strong>{' '}
                  <a href="https://www.galentinesglobal.com" className={styles.link}>
                    www.galentinesglobal.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps = () => {
  return {
    props: {
      cms: JSON.stringify(getCMSById(process.env.EVENT_ID)),
    },
  };
};

