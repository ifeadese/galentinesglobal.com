import React from "react";
import ServicesComponent from "components/services";
import ServiceComponent from "components/service";
import Layout from "components/layout";
import { getBusinessById, getServiceById } from "helpers";
import { Business, Service } from "types";
import { createRootServicePaths } from "helpers";

interface Props {
  business: string;
  service: string;
}

export default function RootServicesPage({
  business: stringifiedBusinessObj,
  service: stringifiedServiceObj
}: Props) {

  const business: Business = JSON.parse(stringifiedBusinessObj);
  const service: Service = JSON.parse(stringifiedServiceObj);
  const returnRoute = { path: "/services", name: "All Services" }
  const props = { business, service, returnRoute }
  const hasSubServices = (service.services && service.services.length > 1);

  return (
    <Layout business={business}>
      {hasSubServices
        ? <ServicesComponent {...props} />
        : <ServiceComponent {...props} />}
    </Layout >
  );
}

export const getStaticPaths = () => ({
  paths: createRootServicePaths(getBusinessById(process.env.BUSINESS_ID || 'loctineer')),
  fallback: false
});

export const getStaticProps = ({ params }: { params: { "root-service": string } }) => {
  const business = getBusinessById(process.env.BUSINESS_ID || 'loctineer')
  const service = getServiceById(business, params["root-service"])?.service
  return {
    props: {
      business: JSON.stringify(business),
      service: JSON.stringify(service),
    },
  }
};
