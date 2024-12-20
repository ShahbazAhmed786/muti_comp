import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  Button,
  TextField,
  Paper,
  Typography,
  InputAdornment,
} from '@mui/material';
import { Business } from '@mui/icons-material';

const AddSector = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '' });
  const [loading, setLoading] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleNavigation = (href) => {
    console.log(`Navigating to: ${href}`);
    closeSidebar();
  };

  const handleSubmit = async () => {
    if (!formState.name.trim()) {
      alert('Sector name is required.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('/api/sectors', { name: formState.name });
      console.log('Sector added:', response.data);
      alert('Sector added successfully!');
      setFormState({ name: '' }); // Reset the form
    } catch (error) {
      console.error('Error adding sector:', error);
      alert('Failed to add sector. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onNavigate={handleNavigation} />

      <div
        className={`flex-1 bg-gray-100 transition-transform duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-8">
          <Typography variant="h4" className="text-gray-800 mb-6">
            Add Sector
          </Typography>
          <Paper elevation={3} className="p-6 w-full max-w-md mx-auto">
            <Typography variant="subtitle1" className="mb-4">
              Enter the details below to add a new sector.
            </Typography>
            <TextField
              label="Sector Name"
              name="name"
              value={formState.name}
              onChange={handleFormChange}
              variant="outlined"
              fullWidth
              className="mb-4 mt-4"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business />
                  </InputAdornment>
                ),
              }}
            />
            <div className="flex justify-end mt-5">
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Paper>
        </main>
      </div>
    </div>
  );
};

export default AddSector;
