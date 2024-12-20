import React, { useState } from 'react';
import Sidebar from '../../components/AdminSidebar';
import Header from '../../components/AdminHeader';
import { TextField, Button, Typography } from '@mui/material';
import { Business, Info, Lock, LocationOn, Phone, Email } from '@mui/icons-material';

const CreateCompany = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    address: '',
    phone: '',
    email: '',
    companyDetails: '',
    password: '',
  });

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleNavigation = (href) => {
    console.log(`Navigating to: ${href}`);
    closeSidebar();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    // Add API integration or other logic here
    setFormData({ companyName: '', address: '', phone: '', email: '', companyDetails: '', password: '' }); // Reset form
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

        <div className="flex justify-center items-center flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
            <Typography variant="h4" className="text-gray-800 mb-6 text-center font-bold">
              Create Company
            </Typography>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Company Name */}
              <TextField
                label="Company Name"
                variant="outlined"
                fullWidth
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <Business className="text-gray-500 mr-2" />
                  ),
                }}
                required
              />

              {/* Address */}
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                name="address"
                value={formData.address}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <LocationOn className="text-gray-500 mr-2" />
                  ),
                }}
                required
              />

              {/* Phone */}
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <Phone className="text-gray-500 mr-2" />
                  ),
                }}
                required
              />

              {/* Email */}
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <Email className="text-gray-500 mr-2" />
                  ),
                }}
                required
              />

              {/* Company Details */}
              <TextField
                label="Company Details"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                name="companyDetails"
                value={formData.companyDetails}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <Info className="text-gray-500 mr-2" />
                  ),
                }}
              />

              {/* Password */}
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <Lock className="text-gray-500 mr-2" />
                  ),
                }}
                required
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ bgcolor: '#1976d2', ':hover': { bgcolor: '#1565c0' } }}
              >
                Submit
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCompany;
