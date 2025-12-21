import React from "react";
import Layout from "components/layout";
import { getBusinessById } from "helpers";
import { Business } from "types";

interface SupportPageProps {
  business: string;
}

export default function SupportPage({ business: stringifiedBusinessObj }: SupportPageProps) {
  const business: Business = JSON.parse(stringifiedBusinessObj);
  return (
    <Layout business={business}>
      <section style={{ padding: '5rem 5%' }}>
      </section>
    </Layout>
  );
}

export const getStaticProps = () => ({
  props: {
    business: JSON.stringify(getBusinessById(process.env.BUSINESS_ID || 'loctineer')),
  },
});

