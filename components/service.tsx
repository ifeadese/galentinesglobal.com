import React, { useState } from "react";
import { useRouter } from "next/router";
import MuiButton from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Button from "components/button";
import CustomImage from "components/custom-image";
import Price from "components/price";
import { Business, Service } from "types";
import styles from "./service.module.scss";
import SubServicesCarousel from "components/sub-services-carousel";
import { PopupModal } from "react-calendly";
import PriceList from "components/price-list";
import { getPriceSuffix, useScreenSizeDetector } from "helpers";

interface Props {
  business: Business;
  service: Service;
  returnRoute?: {
    path: string;
    name: string;
  };
}
const PRICE_LIST_MAX = 5;

const Service = ({
  business,
  service,
  returnRoute
}: Props) => {
  const router = useRouter();
  const [showPriceListModal, setShowPriceListModal] = useState(false)
  const { isMobile } = useScreenSizeDetector()
  const { name, description, featuredImage, price, prices, calendlyEventURL } = service;
  const [isBookingAppointment, setIsBookingAppointment] = useState(false);
  const showPrices = () => {
    if (price) return <Price price={price} />;
    if (prices?.length < PRICE_LIST_MAX) {
      return (
        <ul style={{ padding: '0 0 0 1rem', alignItems: 'center', margin: 'unset' }}>
          {prices.map((price, idx) => (
            <li key={idx} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <p>{price.name} (${price.value}{getPriceSuffix(price.type)})</p>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  }
  const showPriceListButton = () => {
    if (prices?.length >= PRICE_LIST_MAX || (price && prices)) {
      return (
        <Button variant="secondary" onClick={() => setShowPriceListModal(true)}>
          See Price List
        </Button>
      );
    }
  }
  const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setShowPriceListModal(!showPriceListModal);
  };

  return (
    <section>
      <div className={styles["profile-container"]}>
        <div>
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
          <h1>{name}</h1>
          <p>{description}</p>
          <div className={styles.priceInfoContainer}>
            {showPrices()}
          </div>
          <div className={styles.buttonGroup}>
            <Button
              variant="primary"
              onClick={calendlyEventURL && (() => setIsBookingAppointment(true))}
            >
              Book This Service
            </Button>
            {showPriceListButton()}
          </div>
        </div>
        <CustomImage image={featuredImage} height={isMobile ? 400 : 650} width={1000} />
      </div>
      <SubServicesCarousel business={business} />
      {
        typeof window !== 'undefined' &&
        <PopupModal
          open={isBookingAppointment}
          onModalClose={() => setIsBookingAppointment(false)}
          url={calendlyEventURL}
          pageSettings={{
            primaryColor: "a57b21",
            // hideEventTypeDetails: true,
            backgroundColor: "282826",
            textColor: "ffffff",
          }}
          rootElement={typeof window !== "undefined" ? document.getElementById("__next") : null}
        />

      }
      {
        (prices && showPriceListModal) &&
        <PriceList open={showPriceListModal} onClose={toggleDrawer} prices={prices} serviceName={name} />
      }
    </section>
  );
};

export default Service;
