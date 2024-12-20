import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
} from '@mui/material';
import { Person, AttachMoney } from '@mui/icons-material';

const AddSalary = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [salesmanName, setSalesmanName] = useState('');
  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleAddSalesman = async () => {
    if (!salesmanName.trim() || !salary.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: salesmanName,
        salary: parseFloat(salary),
      };

      const response = await axios.post('/api/salesmen', payload); // Replace with your API endpoint
      alert(`Salesman ${response.data.name} added successfully with ID: ${response.data.id}`);
      setSalesmanName('');
      setSalary('');
    } catch (error) {
      console.error('Error adding salesman:', error);
      alert('Failed to add salesman. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeSidebar = () => setSidebarOpen(false);

  const handleNavigation = (href) => {
    console.log(`Navigating to: ${href}`);
    closeSidebar();
  };

  return (
    <div className="flex h-full">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onNavigate={handleNavigation} />

      {/* Main Content */}
      <div
        className={`flex-1 bg-gray-100 transition-transform duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-8">
          <Typography variant="h4" className="text-center mb-8 text-gray-800">
            Add Salesman Salary
          </Typography>

          <Paper elevation={3} className="p-6 w-full max-w-md mx-auto">
            <Box className="mb-6">
              <Typography variant="subtitle1" className="mb-2">
                Salesman Name
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Salesman Name"
                value={salesmanName}
                onChange={(e) => setSalesmanName(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Person className="mr-2 text-gray-500" />
                  ),
                }}
              />
            </Box>

            <Box className="mb-6">
              <Typography variant="subtitle1" className="mb-2">
                Salary
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Salary Amount"
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <AttachMoney className="mr-2 text-gray-500" />
                  ),
                }}
              />
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleAddSalesman}
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add Salesman'}
            </Button>
          </Paper>
        </main>
      </div>
    </div>
  );
};

export default AddSalary;
