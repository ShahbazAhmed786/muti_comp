import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { TextField, Button } from '@mui/material';
import { Person, Email, Phone, Home, Event } from '@mui/icons-material';

const AddSalesmanForm = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    hireDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false); // Track submission state
  const [errorMessage, setErrorMessage] = useState(''); // Error message handling
  const [successMessage, setSuccessMessage] = useState(''); // Success message handling

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await axios.post('/api/salesmen', formData);
      setSuccessMessage('Salesman added successfully!');
      console.log('API Response:', response.data);
      setFormData({ name: '', email: '', phone: '', address: '', hireDate: '' }); // Reset the form
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(
        error.response?.data?.message || 'Failed to add salesman. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigation = (href) => {
    console.log(`Navigating to: ${href}`);
    closeSidebar();
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

        <div className="flex justify-center items-start flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Add Salesman
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <TextField
                label="Name"
                variant="outlined"
                fullWidth
                name="name"
                value={formData.name}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Person className="text-gray-400 mr-2" />,
                }}
                required
              />

              {/* Email */}
              <TextField
                label="Email"
                variant="outlined"
                fullWidth
                name="email"
                value={formData.email}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Email className="text-gray-400 mr-2" />,
                }}
                required
              />

              {/* Phone */}
              <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <Phone className="text-gray-400 mr-2" />,
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
                  startAdornment: <Home className="text-gray-400 mr-2" />,
                }}
                multiline
                rows={3}
                placeholder="Enter salesman's address"
              />

              {/* Hire Date */}
              <TextField
                label="Hire Date"
                variant="outlined"
                fullWidth
                name="hireDate"
                type="date"
                value={formData.hireDate}
                onChange={handleChange}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  startAdornment: <Event className="text-gray-400 mr-2" />,
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white py-3"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>

              {/* Success Message */}
              {successMessage && (
                <p className="text-green-600 text-center mt-4">{successMessage}</p>
              )}

              {/* Error Message */}
              {errorMessage && (
                <p className="text-red-600 text-center mt-4">{errorMessage}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSalesmanForm;
