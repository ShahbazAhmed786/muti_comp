import React, { useState } from 'react';
import { Visibility, VisibilityOff, Business, LocationOn, Phone, Email, Save, Lock } from '@mui/icons-material';
import { TextField, Button, IconButton, InputAdornment } from '@mui/material';
import { motion } from 'framer-motion';
import Logo from '../Asset/images/Logo.jpg'
const CompanyRegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    password: '',
    logo: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [loading, setLoading] = useState(false); // For loading state
  const [error, setError] = useState(null); // For error handling
  const [success, setSuccess] = useState(false); // For success handling

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error state
    setSuccess(false); // Reset success state

    const formDataToSubmit = new FormData();
    formDataToSubmit.append('name', formData.name);
    formDataToSubmit.append('address', formData.address);
    formDataToSubmit.append('phone', formData.phone);
    formDataToSubmit.append('email', formData.email);
    formDataToSubmit.append('description', formData.description);
    formDataToSubmit.append('password', formData.password);
    if (formData.logo) {
      formDataToSubmit.append('logo', formData.logo);
    }

    try {
      const response = await fetch('/api/companies/register', {
        method: 'POST',
        body: formDataToSubmit,
      });

      if (!response.ok) {
        throw new Error('Something went wrong. Please try again.');
      }

      const data = await response.json();
      setSuccess(true); // Show success message
      console.log('Company Registered:', data);

      // Reset the form
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        description: '',
        password: '',
        logo: null,
      });
      setLogoPreview(null);
    } catch (err) {
      setError(err.message); // Show error message
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  return (
    <motion.div
      className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-800"
      style={{
        backgroundImage: `url(${Logo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >

<div
        className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-500 opacity-75"
      />
      <motion.div
        className="relative bg-white rounded-3xl mt-5 mb-5 shadow-xl w-full max-w-4xl grid grid-cols-1 md:grid-cols-2"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo Section */}
        <motion.div
          className="bg-gray-100 p-8 rounded-l-lg flex flex-col justify-center items-center"
          initial={{ x: -50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Company Logo</h2>
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="mb-4 block w-full max-w-xs text-sm text-gray-500 border border-gray-300 rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {logoPreview ? (
            <motion.img
              src={logoPreview}
              alt="Logo Preview"
              className="w-32 h-32 object-cover rounded-full shadow-lg border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
          ) : (
            <motion.div
              className="w-32 h-32 bg-gray-200 rounded-full flex justify-center items-center text-gray-500 shadow-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              No Preview
            </motion.div>
          )}
        </motion.div>

        {/* Form Section */}
        <motion.div
          className="p-8"
          initial={{ x: 50 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Register Company</h2>
          <p className="text-center text-gray-500 mb-8">
            Fill out the form below to register your company.
          </p>

          {/* Success or Error Messages */}
          {success && <div className="text-green-500 text-center mb-4">Company registered successfully!</div>}
          {error && <div className="text-red-500 text-center mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Name */}
            <TextField
              label="Company Name"
              variant="outlined"
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Business />
                  </InputAdornment>
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
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
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
                  <InputAdornment position="start">
                    <Phone />
                  </InputAdornment>
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
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
              required
            />

            {/* Password */}
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
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
              required
            />

            {/* Description */}
            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              name="description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={4}
              placeholder="Enter a brief description of your company"
            />

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(to right, #4facfe, #00f2fe)',
                color: 'white',
                py: 1.5,
                fontSize: '1rem',
                ':hover': {
                  background: 'linear-gradient(to right, #00c6ff, #0072ff)',
                },
              }}
              className="transition-transform transform hover:scale-105 duration-300 flex items-center justify-center"
            >
              <Save className="mr-2" />
              {loading ? 'Registering...' : 'Register Company'}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CompanyRegisterPage;
