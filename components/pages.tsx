/* eslint-disable jsx-a11y/alt-text */
import { HomeRounded, BallotRounded, CropOriginalRounded, InfoRounded, HelpRounded, EventAvailableRounded } from '@mui/icons-material';

export const pages = [
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
    name: "Support",
    url: `/support`,
    disabled: false,
    icon: <HelpRounded sx={{ color: 'lightgray' }} />,
  },
  {
    name: "RSVP",
    url: `/rsvp`,
    disabled: false,
    icon: <EventAvailableRounded sx={{ color: 'lightgray' }} />,
  },
];
