import React, { useState } from "react";
import Head from "next/head";
import MenuBar from "components/layout/menu-bar";
import MenuBarDrawer from "components/layout/menu-bar-drawer";
import { FacebookMessengerChat } from "components/chat-button";
import styles from "components/layout/index.module.scss";
import { Business } from "types";
import { getBusinessLogo } from "helpers";
import Footer from "components/footer";

interface Props {
  business: Business;
  children: React.ReactNode;
}

const Layout = ({ business, children }: Props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const showDrawer = (state) => setIsDrawerOpen(state);
  const { name, description, facebookPageId, facebookPageUrl, instagramPageUrl, contactEmailAddress } = business;
  const Logo = getBusinessLogo(business.id);
  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>{name}</title>
          <meta name="description" content={description} />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <MenuBar
          isDrawerOpen={isDrawerOpen}
          showDrawer={showDrawer}
          logo={<Logo width={100} height={100} />}
        />

        <main>
          {children}
          <FacebookMessengerChat facebookPageId={facebookPageId} />
        </main>

        <Footer contactEmailAddress={contactEmailAddress} facebookPageUrl={facebookPageUrl} instagramPageUrl={instagramPageUrl} />
      </div>
      {isDrawerOpen && (
        <MenuBarDrawer isDrawerOpen={isDrawerOpen} showDrawer={showDrawer} logo={<Logo />} />
      )}
    </>
  );
};

export default Layout;
