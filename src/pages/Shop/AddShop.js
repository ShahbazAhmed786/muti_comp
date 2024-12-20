import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { TextField, Button, Paper, Typography, InputAdornment } from '@mui/material';
import { Add, Edit, Store, LocationOn, Phone, AccountBalance } from '@mui/icons-material';

const ShopForm = ({ match }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    balance: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const closeSidebar = () => setSidebarOpen(false);

  const handleNavigation = (href) => {
    console.log(`Navigating to: ${href}`);
    closeSidebar();
  };

  // Fetch shop data if we are in edit mode
  useEffect(() => {
    const fetchShopData = async () => {
      const shopId = match?.params?.id; // Get shop ID from route params

      if (shopId) {
        try {
          const response = await axios.get(`/api/shops/${shopId}`);
          setFormData(response.data);
          setIsEditing(true);
        } catch (error) {
          console.error('Error fetching shop data:', error);
        }
      }
    };
    fetchShopData();
  }, [match]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.contact || formData.balance === '') {
      alert('Please fill in all fields.');
      return;
    }

    const shopData = { ...formData };

    try {
      if (isEditing) {
        await axios.put(`/api/shops/${formData.id}`, shopData); // Update existing shop
        alert('Shop details updated successfully!');
      } else {
        await axios.post('/api/shops', shopData); // Create new shop
        alert('Shop details submitted successfully!');
      }
      setFormData({ name: '', address: '', contact: '', balance: '' }); // Reset form
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting the form.');
    }
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
          <Typography variant="h4" component="h1" className="text-center mb-8 text-gray-800">
            {isEditing ? 'Edit Shop' : 'Add Shop'}
          </Typography>

          <Paper elevation={3} className="p-6 w-full max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                margin="normal"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter shop name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Store />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                margin="normal"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter shop address"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Contact Info"
                variant="outlined"
                fullWidth
                margin="normal"
                name="contact"
                value={formData.contact}
                onChange={handleInputChange}
                placeholder="Enter contact info"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Balance"
                variant="outlined"
                fullWidth
                margin="normal"
                name="balance"
                type="number"
                value={formData.balance}
                onChange={handleInputChange}
                placeholder="Enter balance amount"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccountBalance />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
                startIcon={isEditing ? <Edit /> : <Add />}
                className="mt-4"
              >
                {isEditing ? 'Update Shop' : 'Add Shop'}
              </Button>
            </form>
          </Paper>
        </main>
      </div>
    </div>
  );
};

export default ShopForm;
