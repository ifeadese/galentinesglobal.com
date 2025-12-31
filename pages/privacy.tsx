import React from "react";
import Layout from "components/layout";
import TitleHero from "components/title-hero";
import { getCMSById, getEventFromCMS } from "helpers";
import { CMSContent } from "types";
import styles from "./privacy.module.scss";

interface PrivacyPageProps {
  cms: string;
}

export default function PrivacyPage({ cms: stringifiedCMS }: PrivacyPageProps) {
  const cms: CMSContent = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);
  const contactEmail = cms.general.contactEmailAddress || 'galentinesglobal@gmail.com';

  return (
    <Layout event={event}>
      <TitleHero
        image={cms.about.heroImage || "/images/ladies.JPG"}
        imageAlt={cms.about.heroImageAlt || "Galentines Community"}
        title="Privacy Policy"
        subtitle="How we protect and use your information"
      />

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.content}>
            <p className={styles.lastUpdated}>
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className={styles.section}>
              <h2 className={styles.heading}>Introduction</h2>
              <p className={styles.paragraph}>
                Galentines Global (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our 
                website and services, including submitting forms for event registration, RSVP, partnerships, or volunteering.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>Information We Collect</h2>
              <p className={styles.paragraph}>
                When you submit forms on our website (including RSVP, &quot;Partner with us,&quot; or &quot;Volunteer with us&quot; forms), 
                we may collect the following types of information:
              </p>
              <ul className={styles.list}>
                <li>Name and contact information (email address, phone number)</li>
                <li>Any additional information you voluntarily provide in form submissions</li>
                <li>Event preferences and responses</li>
                <li>Timestamp of your submission</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>How We Use Your Information</h2>
              <p className={styles.paragraph}>
                We use the information you provide to:
              </p>
              <ul className={styles.list}>
                <li>Process and manage event registrations and RSVPs</li>
                <li>Send you confirmation emails and event-related communications</li>
                <li>Notify event organizers of new submissions</li>
                <li>Organize and coordinate event activities</li>
                <li>Respond to your inquiries and requests</li>
              </ul>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>Data Storage and Sharing</h2>
              <p className={styles.paragraph}>
                Your form submissions are securely stored in Google Sheets, which is managed by our event organizers. 
                This allows us to efficiently organize and manage event registrations and communications. 
                All data is stored in accordance with Google&apos;s security and privacy standards.
              </p>
              <p className={styles.paragraph}>
                <strong>Data Sharing:</strong> We do not sell, rent, or trade your personal information to third parties. 
                Your information is only shared with:
              </p>
              <ul className={styles.list}>
                <li>Event organizers and administrators who need access to manage the event</li>
                <li>Google (as a service provider) for data storage and email delivery</li>
                <li>As required by law or to protect our rights and safety</li>
              </ul>
              <p className={styles.paragraph}>
                We do not use your information for advertising purposes or share it with advertisers.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>Email Communications</h2>
              <p className={styles.paragraph}>
                When you submit a form, we may send you:
              </p>
              <ul className={styles.list}>
                <li>A confirmation email acknowledging your submission</li>
                <li>Event-related updates and information</li>
                <li>Important notifications about the event</li>
              </ul>
              <p className={styles.paragraph}>
                You can opt out of non-essential communications by contacting us at the email address provided below.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>Google Services and OAuth</h2>
              <p className={styles.paragraph}>
                Our website uses Google services and APIs to provide functionality. When you interact with our 
                administrative features, we request access to the following Google services:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Google Sheets API:</strong> To store and manage form submissions in Google Sheets. 
                  We request access to view and edit spreadsheets to save your form data.
                </li>
                <li>
                  <strong>Google Drive API:</strong> To create and list Google Sheets files for organizing 
                  event data. We only access files we create for this purpose.
                </li>
                <li>
                  <strong>Google User Info API:</strong> To identify the administrator managing the event 
                  forms. We only access your email address for administrative purposes.
                </li>
              </ul>
              <p className={styles.paragraph}>
                <strong>Important:</strong> These permissions are only requested from event administrators 
                who connect their Google account to manage form submissions. Regular website visitors and 
                form submitters do not need to connect a Google account.
              </p>
              <p className={styles.paragraph}>
                By using our administrative services, you acknowledge that your data may be processed 
                through Google&apos;s infrastructure. Google&apos;s use of your information is governed by 
                their Privacy Policy, which you can review at{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  https://policies.google.com/privacy
                </a>. We comply with Google&apos;s API Services User Data Policy, available at{' '}
                <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className={styles.link}>
                  https://developers.google.com/terms/api-services-user-data-policy
                </a>.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>Data Security</h2>
              <p className={styles.paragraph}>
                We take reasonable measures to protect your personal information from unauthorized access, 
                disclosure, alteration, or destruction. However, no method of transmission over the internet 
                or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>Data Retention</h2>
              <p className={styles.paragraph}>
                We retain your personal information for as long as necessary to fulfill the purposes outlined 
                in this Privacy Policy, unless a longer retention period is required or permitted by law. 
                Event-related data may be retained for organizational and historical purposes.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>Your Rights</h2>
              <p className={styles.paragraph}>
                You have the right to:
              </p>
              <ul className={styles.list}>
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate or incomplete information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of certain communications</li>
                <li>Withdraw consent for data processing</li>
              </ul>
              <p className={styles.paragraph}>
                To exercise these rights, please contact us using the information provided below.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>Third-Party Services</h2>
              <p className={styles.paragraph}>
                Our website may contain links to third-party websites or services. We are not responsible 
                for the privacy practices of these third parties. We encourage you to review their privacy 
                policies before providing any personal information.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>Children&apos;s Privacy</h2>
              <p className={styles.paragraph}>
                Our services are not directed to individuals under the age of 18. We do not knowingly collect 
                personal information from children. If you believe we have inadvertently collected information 
                from a child, please contact us immediately.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>Changes to This Privacy Policy</h2>
              <p className={styles.paragraph}>
                We may update this Privacy Policy from time to time. We will notify you of any material 
                changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date. 
                We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section className={styles.section}>
              <h2 className={styles.heading}>Contact Us</h2>
              <p className={styles.paragraph}>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data 
                practices, please contact us at:
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

