import React from "react";
import Hero from "components/hero";
import Layout from "components/layout";
import { getCMSById, getEventFromCMS } from "helpers";
import { CMSContent } from "data/cms-types";

interface HomePageProps {
  cms: string;
}

export default function HomePage({ cms: stringifiedCMS }: HomePageProps) {
  const cms: CMSContent = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);
  return (
    <Layout event={event}>
      <Hero event={event} cms={cms} />
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
