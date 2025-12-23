import React from "react";
import Hero from "components/hero";
import Layout from "components/layout";
import { getBusinessById } from "helpers";
import { Event } from "types";

interface HomePageProps {
  business: string;
}

export default function HomePage({ business: stringifiedBusinessObj }: HomePageProps) {
  const event: Event = JSON.parse(stringifiedBusinessObj);
  return (
    <Layout event={event}>
      <Hero event={event} />
    </Layout>
  );
}

export const getStaticProps = () => ({
  props: {
    business: JSON.stringify(getBusinessById(process.env.BUSINESS_ID || 'loctineer')),
  },
});
