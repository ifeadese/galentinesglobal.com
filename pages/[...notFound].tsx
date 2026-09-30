import type { GetServerSideProps } from "next";
import ErrorPage from "./404";

// Serves the site's own 404 page for every unmatched URL.
//
// The App Router exists in this project only to host the Payload admin under
// app/(payload). Once an app directory is present, Next answers unmatched
// routes with the App Router's bare default 404 rather than pages/404.tsx,
// and returning `notFound: true` from a Pages route hands off to that same
// default. So this catch-all claims unmatched URLs for the Pages Router and
// renders the 404 page itself with a 404 status. More specific routes,
// including /admin and /api, still win over it.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.statusCode = 404;
  return { props: {} };
};

export default ErrorPage;
