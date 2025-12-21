import React from "react";
import { useRouter } from "next/router";
import MuiButton from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Layout from "components/layout";
import Card from "components/card";
import { getBusinessById } from "helpers";
import { Business } from "types";

interface ServicesPageProps {
  business: string;
}

export default function ServicesPage({ business: stringifiedBusinessObj }: ServicesPageProps) {
  const router = useRouter();
  const returnRoute = { path: "/", name: "Back to Home" }
  const business: Business = JSON.parse(stringifiedBusinessObj);
  return (
    <Layout business={business}>
      <section style={{ padding: '3rem 5%' }}>
        {returnRoute && (
          <MuiButton
            sx={{
              textTransform: "none",
              letterSpacing: "2px",
              color: "lightgray",
              justifyContent: "flex-start",
              padding: "0.5rem",
              fontFamily: "inherit",
            }}
            size="medium"
            startIcon={<ChevronLeftIcon />}
            onClick={() => router.push(returnRoute.path)}
          >
            {returnRoute.name}
          </MuiButton>
        )}
        <h1>Services</h1>
        <div className="services-content">
          {business.services.map((option, idx) => (
            <Card key={idx} service={option} height='25rem' />
          ))}
        </div>
      </section>
    </Layout>
  );
}

export const getStaticProps = () => ({
  props: {
    business: JSON.stringify(getBusinessById(process.env.BUSINESS_ID || 'loctineer')),
  },
});
