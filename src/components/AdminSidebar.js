import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Business,
  
  ExpandMore,
  ExpandLess,
 
} from '@mui/icons-material';
import { Drawer,  List, ListItem, ListItemIcon, ListItemText, Collapse, createTheme, ThemeProvider } from '@mui/material';
import PropTypes from 'prop-types';


const navItems = [
  { label: 'Home', icon: <Home />, path: '/admin' },
 
  {
    label: 'Company',
    icon: <Business />,
    path: '/company-management',
    children: [
      { label: 'Create', path: '/company-management/create' },
      { label: 'Manage', path: '/company-management/manage' },
    ],
  },
  
]

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#222',
      paper: '#222',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    action: {
      hover: '#333333',
    },
  },
});

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItem, setExpandedItem] = useState(null);

  const toggleExpand = (item) => {
    setExpandedItem(expandedItem === item ? null : item);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <ThemeProvider theme={darkTheme}>
      <Drawer
        variant="persistent"
        anchor="left"
        open={isOpen}
        sx={{
          '& .MuiDrawer-paper': {
            width:'250px',
            backgroundColor: darkTheme.palette.background.paper,
            color: darkTheme.palette.text.primary,
          },
        }}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between">
          <span className="text-xl font-semibold text-white">TechCorp</span>
          {/* <IconButton
            onClick={onClose}
            aria-label="Close Sidebar"
            sx={{ color: darkTheme.palette.text.secondary }}
          >
            ✕
          </IconButton> */}
        </div>

        {/* Navigation Menu */}
        <List>
          {navItems.map(({ label, icon, path, children }) => (
            <React.Fragment key={path}>
              <ListItem
                button
                onClick={() => (children ? toggleExpand(label) : navigate(path))}
                sx={{
                  backgroundColor: isActive(path) || expandedItem === label ? darkTheme.palette.action.hover : undefined,
                  '&:hover': { backgroundColor: darkTheme.palette.action.hover },
                }}
              >
                <ListItemIcon sx={{ color: darkTheme.palette.text.secondary }}>{icon}</ListItemIcon>
                <ListItemText primary={label} />
                {children && (expandedItem === label ? <ExpandLess /> : <ExpandMore />)}
              </ListItem>

              {/* Nested Menu Items */}
              {children && (
                <Collapse in={expandedItem === label} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {children.map((child) => (
                      <ListItem
                        key={child.path}
                        button
                        onClick={() => navigate(child.path)}
                        sx={{
                          pl: 4,
                          color: isActive(child.path)
                            ? darkTheme.palette.text.primary
                            : darkTheme.palette.text.secondary,
                          backgroundColor: isActive(child.path) ? darkTheme.palette.action.hover : undefined,
                          '&:hover': { backgroundColor: darkTheme.palette.action.hover },
                        }}
                      >
                        <ListItemText primary={child.label} />
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </ThemeProvider>
  );
};

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Sidebar;
