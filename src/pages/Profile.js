import React, { useState, useEffect } from 'react';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Business, LocationOn, Phone, Email, Save, Lock } from '@mui/icons-material';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CompanyProfilePage = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [companyData, setCompanyData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    logo: null,
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);

  const { companyId } = useParams(); // Assuming we're passing companyId in the URL

  // Fetch the company data based on companyId from the API
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`/api/companies/${companyId}`);
        const company = response.data;
        setCompanyData(company);
        setLogoPreview(company.logo); // Assuming logo is a URL
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyData();
  }, [companyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyData({ ...companyData, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCompanyData({ ...companyData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', companyData.name);
      formData.append('address', companyData.address);
      formData.append('phone', companyData.phone);
      formData.append('email', companyData.email);
      formData.append('description', companyData.description);
      formData.append('password', companyData.password);
      if (companyData.logo) {
        formData.append('logo', companyData.logo);
      }

      const response = await axios.put(`/api/companies/${companyId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Company profile updated!');
      }
    } catch (error) {
      console.error('Error saving company data:', error);
      alert('Failed to update company profile!');
    }
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

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
        className={`flex-1 bg-gray-100 transition-transform duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Company Profile</h1>

          {/* Company Information Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-lg shadow-lg">
            {/* Left side - Logo */}
            <div className="flex flex-col items-center justify-center">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Company Logo</h2>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="mb-4 block w-full max-w-xs text-sm text-gray-500 border border-gray-300 rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="w-32 h-32 object-cover rounded-full shadow-lg border" />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex justify-center items-center text-gray-500 shadow-lg">
                  No Preview
                </div>
              )}
            </div>

            {/* Right side - Form */}
            <div className="space-y-6">
              {/* Company Name */}
              <TextField
                label="Company Name"
                variant="outlined"
                fullWidth
                name="name"
                value={companyData.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Address */}
              <TextField
                label="Address"
                variant="outlined"
                fullWidth
                name="address"
                value={companyData.address}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Phone */}
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                name="phone"
                type="tel"
                value={companyData.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Email */}
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                type="email"
                value={companyData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Description */}
              <TextField
                label="Description"
                variant="outlined"
                fullWidth
                name="description"
                value={companyData.description}
                onChange={handleChange}
                multiline
                rows={4}
                placeholder="Enter a brief description of your company"
              />

              {/* Password */}
              <TextField
                label="Password"
                variant="outlined"
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={companyData.password}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <div className="flex justify-end">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                  startIcon={<Save />}
                  className="w-full max-w-xs"
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CompanyProfilePage;
