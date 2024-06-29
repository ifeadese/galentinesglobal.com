/* eslint-disable jsx-a11y/alt-text */
import { HomeRounded, BallotRounded, CropOriginalRounded } from '@mui/icons-material';

export const pages = [
  {
    name: "Home",
    url: `/`,
    disabled: false,
    icon: <HomeRounded sx={{ color: 'lightgray' }} />,
  },
  {
    name: "Services",
    url: `/services`,
    disabled: false,
    icon: <BallotRounded sx={{ color: 'lightgray' }} />,
  },
  {
    name: "Photos",
    url: `/photos`,
    disabled: true,
    icon: <CropOriginalRounded sx={{ color: 'lightgray' }} />,
  },
];
