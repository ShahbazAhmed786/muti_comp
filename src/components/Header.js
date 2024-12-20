import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { Menu, MenuItem, IconButton, Typography } from '@mui/material';

const Header = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <header className="bg-gray-100 shadow p-4 flex justify-between items-center z-10">
      {/* Sidebar Toggle Button */}
      <IconButton
        className="lg:hidden text-gray-700"
        onClick={toggleSidebar}
        aria-label="Open Sidebar"
      >
        <MenuIcon fontSize="large" />
      </IconButton>

      {/* Page Title */}
      <Typography variant="h6" className="font-semibold">
        Dashboard
      </Typography>

      {/* User Dropdown */}
      <div>
        <IconButton
          className="text-gray-700"
          onClick={handleMenuOpen}
          aria-label="User Menu"
        >
          <AccountCircleIcon fontSize="large" />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleMenuClose} className="flex items-center space-x-2">
            <PersonIcon />
            <a href="/profile" className="text-gray-700 no-underline">Profile</a>
          </MenuItem>
          <MenuItem onClick={handleMenuClose} className="flex items-center space-x-2">
            <LogoutIcon />
            <a href="/" className="text-gray-700 no-underline">Logout</a>
          </MenuItem>
        </Menu>
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Header;
