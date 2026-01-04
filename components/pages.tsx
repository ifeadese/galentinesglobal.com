/* eslint-disable jsx-a11y/alt-text */
import { HomeRounded, BallotRounded, CropOriginalRounded, InfoRounded, HelpRounded, EventAvailableRounded, PeopleRounded } from '@mui/icons-material';

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
    name: "RSVP",
    url: `/rsvp`,
    disabled: false,
    icon: <EventAvailableRounded sx={{ color: 'lightgray' }} />,
  },
];
