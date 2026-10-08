import { GetServerSideProps } from "next";

// Target of the fallback rewrite in next.config.mjs. Next serves the App Router's built-in
// not-found page for /404 whenever an app/ directory exists (Payload's admin), so unmatched URLs
// are rewritten here instead to keep rendering our custom 404 page with a 404 status.
export { default } from "./404";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.statusCode = 404;
  return { props: {} };
};
