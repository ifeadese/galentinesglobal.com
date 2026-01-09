import { GetServerSideProps } from "next";
import { getCMSById, getEventFromCMS } from "helpers";

function generateSiteMap(pages: Array<{ url: string; lastmod?: string; changefreq?: string; priority?: string }>) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://galentinesglobal.com";
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${pages
       .map((page) => {
         return `
       <url>
           <loc>${baseUrl}${page.url}</loc>
           ${page.lastmod ? `<lastmod>${page.lastmod}</lastmod>` : ""}
           ${page.changefreq ? `<changefreq>${page.changefreq}</changefreq>` : ""}
           ${page.priority ? `<priority>${page.priority}</priority>` : ""}
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const cms = getCMSById(process.env.EVENT_ID);
  const event = getEventFromCMS(cms);

  // List of all pages
  const pages = [
    {
      url: "/",
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "1.0",
    },
    {
      url: "/about",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.8",
    },
    {
      url: "/rsvp",
      lastmod: new Date().toISOString(),
      changefreq: "weekly",
      priority: "0.9",
    },
    {
      url: "/team",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.7",
    },
    {
      url: "/team/founder",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.6",
    },
    {
      url: "/partners",
      lastmod: new Date().toISOString(),
      changefreq: "monthly",
      priority: "0.8",
    },
  ];

  // Generate the XML sitemap with the pages data
  const sitemap = generateSiteMap(pages);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;

