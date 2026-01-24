import React from 'react';
import { HomeRounded, InfoRounded, EventAvailableRounded, PeopleRounded, HandshakeRounded, EmailRounded, VolunteerActivismRounded } from '@mui/icons-material';

export interface Page {
  name: string;
  url: string;
  disabled: boolean;
  icon: React.ReactNode;
  isButton?: boolean;
}

export const pages: Page[] = [
  {
    name: "Home",
    url: `/`,
    disabled: false,
    icon: <HomeRounded sx={{ color: 'lightgray' }} />,
  },
  {
    name: "About",
    url: `/about`,
    disabled: false,
    icon: <InfoRounded sx={{ color: 'lightgray' }} />,
  },
  {
    name: "Team",
    url: `/team`,
    disabled: false,
    icon: <PeopleRounded sx={{ color: 'lightgray' }} />,
  },
  {
    name: "Support",
    url: `/support`,
    disabled: false,
    icon: <HandshakeRounded sx={{ color: 'lightgray' }} />,
  },
  {
    name: "Contact",
    url: `/contact`,
    disabled: false,
    icon: <EmailRounded sx={{ color: 'lightgray' }} />,
  },
  {
    name: "RSVP",
    url: `/rsvp`,
    disabled: false,
    icon: <EventAvailableRounded sx={{ color: 'lightgray' }} />,
    isButton: true,
  },
];
