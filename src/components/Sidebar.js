import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Business,
  Settings,
  Store,
  People,
  Payment,
  Report,
  Inventory,
  NoteAdd,
  ExpandMore,
  ExpandLess,
  Person,
} from '@mui/icons-material';
import { Drawer,  List, ListItem, ListItemIcon, ListItemText, Collapse, createTheme, ThemeProvider } from '@mui/material';
import PropTypes from 'prop-types';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const navItems = [
  { label: 'Home', icon: <Home />, path: '/home' },
  {
    label: 'Order',
    icon: <AddShoppingCartIcon />,
    path: '/order-mangement',
    children: [
      { label: 'Add Order', path: '/order-management/add' },
      { label: 'View Orders', path: '/order-management/view' },
    ],
  },
  {
    label: 'Inventory',
    icon: <Inventory />,
    path: '/inventory',
    children: [
      { label: 'Add Item', path: '/inventory/add' },
      { label: 'View Items', path: '/inventory/view' },
    ],
  },
  {
    label: 'Saleman',
    icon: <Person />,
    path: '/saleman',
    children: [
      { label: 'Add Saleman', path: '/saleman/add' },
      { label: 'View Salemans', path: '/saleman/view' },
    ],
  },
  {
    label: 'Supervisor',
    icon: <SupervisorAccountIcon />,
    path: '/supervisor',
    children: [
      { label: 'Add Supervisor', path: '/supervisor/add' },
      { label: 'View Supervisor', path: '/supervisor/view' },
    ],
  },
  {
    label: 'Sector',
    icon: <AddLocationAltIcon />,
    path: '/sector',
    children: [
      { label: 'Add', path: '/sector/add' },
      { label: 'View', path: '/sector/view' },
      { label: 'Assign Shops', path: '/sector/assign' },
    ],
  },
  {
    label: 'Shop',
    icon: <Store />,
    path: '/shop',
    children: [
      { label: 'Add', path: '/shop/add' },
      { label: 'View Balances', path: '/shop/balances' },
    ],
  },
  {
    label: 'Attendance',
    icon: <People />,
    path: '/attendance',
    children: [
      { label: 'Mark Attendance', path: '/attendance/mark' },
    ],
  },
  {
    label: 'Salary',
    icon: <Payment />,
    path: '/salary',
    children: [
      { label: 'Add', path: '/salary/add' },
      { label: 'View', path: '/salary/view' },
    ],
  },
  {
    label: 'Payment',
    icon: <Payment />,
    path: '/payment',
  },
  {
    label: 'Reporting',
    icon: <Report />,
    path: '/reporting',
    children: [
      { label: 'Sales Reports', path: '/reporting/sales' },
      { label: 'Inventory Reports', path: '/reporting/inventory' },
      { label: 'Attendance Reports', path: '/reporting/attendance' },
      { label: 'Payment Reports', path: '/reporting/payments' },
    ],
  },
  {
    label: 'Balance Sheet',
    icon: <NoteAdd />,
    path: '/balance-sheet',
  },
  {
    label: 'Logs and Audit',
    icon: <Settings />,
    path: '/logs-and-audit',
  },
];

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
