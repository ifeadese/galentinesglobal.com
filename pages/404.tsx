import Link from "next/link";
import Image from "next/legacy/image";
import Button from "components/button";
import Layout from "components/layout";
import { CMSContent } from "types";
import { getEventFromCMS } from "helpers";
import { CMS } from "../cms";

export default function ErrorPage() {
  const event = getEventFromCMS(CMS);
  const errorContent = CMS.error404;

  return (
    <Layout event={event}>
      <section style={{ padding: '5rem 2rem', textAlign: "center" }}>
        <Image src={errorContent.image!} alt={errorContent.imageAlt!} width={150} height={150} />
        <h1 style={{ marginBottom: 'unset' }}>{errorContent.title!}</h1>
        <br />
        <p style={{ marginTop: 'unset' }}>{errorContent.message!}</p>
        <Link href={errorContent.buttonLink!} legacyBehavior>
          <Button variant="primary">{errorContent.buttonText!}</Button>
        </Link>
      </section>
    </Layout>
  );
}

