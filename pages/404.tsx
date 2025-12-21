import Link from "next/link";
import Image from "next/legacy/image";
import Button from "components/button";
import Layout from "components/layout";
import { Business } from "types";
import { getBusinessById } from "helpers";

interface ErrorPageProps {
  business: string;
}

export default function ErrorPage({ business: stringifiedBusinessObj }: ErrorPageProps) {
  const business: Business = JSON.parse(stringifiedBusinessObj);
  return (
    <Layout business={business}>
      <section style={{ padding: '5rem 2rem', textAlign: "center" }}>
        <Image src="/images/404.png" alt="404" width={150} height={150} />
        <h1 style={{ marginBottom: 'unset' }}>We don&apos;t have this page</h1>
        <br />
        <p style={{ marginTop: 'unset' }}>Your URL is probably invalid. Make sure you have the correct one.</p>
        <Link href="/" legacyBehavior>
          <Button variant="primary">Return Home</Button>
        </Link>
      </section>
    </Layout>
  );
}

export const getStaticProps = () => ({
  props: {
    business: JSON.stringify(getBusinessById(process.env.BUSINESS_ID || 'loctineer')),
  },
});
