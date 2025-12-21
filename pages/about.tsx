import React from "react";
import Layout from "components/layout";
import { getBusinessById } from "helpers";
import { Business } from "types";

interface AboutPageProps {
  business: string;
}

export default function AboutPage({ business: stringifiedBusinessObj }: AboutPageProps) {
  const business: Business = JSON.parse(stringifiedBusinessObj);
  return (
    <Layout business={business}>
      <section style={{ padding: '5rem 5%' }}>
        <h1>About The Love of God Conference</h1>
        <p>
          Join us for The Love of God Conference on February 7, 2026. A transformative faith-based event for women hosted by Galentines Global and Shile Adeyoyin. Experience powerful worship, inspiring speakers, and fellowship.
        </p>
        <p>
          This conference is designed to deepen your understanding of God&apos;s love and equip you to walk in the fullness of that love. Come prepared to be transformed, encouraged, and empowered as we gather together in worship and community.
        </p>
        <p>
          &ldquo;And to know the love of Christ which passes knowledge; that you might be filled with all the fullness of God.&rdquo; - Ephesians 3:19
        </p>
      </section>
    </Layout>
  );
}

export const getStaticProps = () => ({
  props: {
    business: JSON.stringify(getBusinessById(process.env.BUSINESS_ID || 'loctineer')),
  },
});
