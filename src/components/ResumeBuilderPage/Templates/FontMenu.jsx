// components/FontMenu.js
import React from "react";
import { Menu, MenuItem, Typography } from "@mui/material";

export const FontMenu = ({ fontMenu, handleFontMenuClose, changeFontFamily, FONTS }) => {
  return (
    <Menu
      anchorEl={fontMenu}
      open={Boolean(fontMenu)}
      onClose={handleFontMenuClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
    >
      <MenuItem onClick={() => changeFontFamily(FONTS.POPPINS)}>
        <Typography sx={{ fontFamily: FONTS.POPPINS }}>Poppins</Typography>
      </MenuItem>
      <MenuItem onClick={() => changeFontFamily(FONTS.ROBOTO)}>
        <Typography sx={{ fontFamily: FONTS.ROBOTO }}>Roboto</Typography>
      </MenuItem>
      <MenuItem onClick={() => changeFontFamily(FONTS.OPEN_SANS)}>
        <Typography sx={{ fontFamily: FONTS.OPEN_SANS }}>
          Open Sans
        </Typography>
      </MenuItem>
      <MenuItem onClick={() => changeFontFamily(FONTS.MONTSERRAT)}>
        <Typography sx={{ fontFamily: FONTS.MONTSERRAT }}>
          Montserrat
        </Typography>
      </MenuItem>
      <MenuItem onClick={() => changeFontFamily(FONTS.RALEWAY)}>
        <Typography sx={{ fontFamily: FONTS.RALEWAY }}>Raleway</Typography>
      </MenuItem>
    </Menu>
  );
};