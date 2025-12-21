import React from "react";
import { useRouter } from "next/router";
import Image from "next/legacy/image";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import { pages } from "./pages";

interface MobileDrawerProps {
  isDrawerOpen: boolean;
  showDrawer: (state: boolean) => void;
  businessName: string;
}

const MobileDrawer = ({ isDrawerOpen, showDrawer, businessName }: MobileDrawerProps) => {
  const router = useRouter();
  return (
    <Drawer
      anchor="right"
      open={isDrawerOpen}
      onClose={() => showDrawer(false)}
    >
      <Box
        role="presentation"
        onClick={() => showDrawer(false)}
        onKeyDown={() => showDrawer(false)}
        sx={{ backgroundColor: '#151515', color: 'lightgray', height: '100%' }}
      >
        <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Image 
            src="/images/galentines-gradient-logo.svg" 
            alt={businessName}
            width={150}
            height={50}
            style={{ maxHeight: '50px', width: 'auto', height: 'auto' }}
          />
        </div>

        <List>
          {pages.map((page, _index) => {
            if (!page.disabled)
              return (
                <ListItem
                  key={page.name}
                  disablePadding
                  style={{ padding: "0 1rem", height: "4rem" }}
                  onClick={() => router.push(page.url)}
                >
                  <ListItemButton>
                    <ListItemIcon>{page.icon}</ListItemIcon>
                    {page.name}
                  </ListItemButton>
                </ListItem>
              );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default MobileDrawer;
