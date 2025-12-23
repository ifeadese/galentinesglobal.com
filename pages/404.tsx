import Link from "next/link";
import Image from "next/legacy/image";
import Button from "components/button";
import Layout from "components/layout";
import { CMSContent } from "types";
import { getCMSById, getEventFromCMS } from "helpers";

interface ErrorPageProps {
  cms: string;
}

export default function ErrorPage({ cms: stringifiedCMS }: ErrorPageProps) {
  const cms: CMSContent = JSON.parse(stringifiedCMS);
  const event = getEventFromCMS(cms);
  const errorContent = cms.error404;

  return (
    <Layout event={event}>
      <section style={{ padding: '5rem 2rem', textAlign: "center" }}>
        <Image src={errorContent.image || "/images/404.png"} alt={errorContent.imageAlt || "404"} width={150} height={150} />
        <h1 style={{ marginBottom: 'unset' }}>{errorContent.title || "We don't have this page"}</h1>
        <br />
        <p style={{ marginTop: 'unset' }}>{errorContent.message || "Your URL is probably invalid. Make sure you have the correct one."}</p>
        <Link href={errorContent.buttonLink || "/"} legacyBehavior>
          <Button variant="primary">{errorContent.buttonText || "Return Home"}</Button>
        </Link>
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
