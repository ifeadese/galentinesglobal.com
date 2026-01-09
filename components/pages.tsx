/* eslint-disable jsx-a11y/alt-image */
import { HomeRounded, BallotRounded, CropOriginalRounded, InfoRounded, HelpRounded, EventAvailableRounded, PeopleRounded, HandshakeRounded } from '@mui/icons-material';

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
    name: "Team",
    url: `/team`,
    disabled: false,
    icon: <PeopleRounded sx={{ color: 'lightgray' }} />,
  },
  {
    name: "Partners",
    url: `/partners`,
    disabled: false,
    icon: <HandshakeRounded sx={{ color: 'lightgray' }} />,
  },
  {
    name: "RSVP",
    url: `/rsvp`,
    disabled: false,
    icon: <EventAvailableRounded sx={{ color: 'lightgray' }} />,
  },

];
