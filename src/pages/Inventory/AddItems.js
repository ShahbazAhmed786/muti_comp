import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { TextField, Button, InputAdornment } from '@mui/material';
import { Inventory, CalendarToday, LocalShipping, PriceCheck } from '@mui/icons-material';

const InventoryForm = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    quantity: '',
    price: '',
    supplier: '',
    purchaseDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/Inventory', formData);
      console.log('Form submitted successfully:', response.data);
  
      // Reset form after successful submission
      setFormData({
        itemName: '',
        description: '',
        quantity: '',
        price: '',
        supplier: '',
        purchaseDate: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error.response || error.message);
    }
  };



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

        {/* Main Section */}
        <div className="flex justify-center items-start flex-1 p-6 overflow-y-auto bg-gray-50">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Add Inventory Item
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Item Name */}
              <TextField
                label="Item Name"
                name="itemName"
                variant="outlined"
                fullWidth
                value={formData.itemName}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Inventory />
                    </InputAdornment>
                  ),
                }}
                placeholder="Enter item name"
                required
              />

              {/* Description */}
              <TextField
                label="Description"
                name="description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter item description"
              />

              {/* Quantity and Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <TextField
                  label="Quantity"
                  name="quantity"
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalShipping />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter quantity"
                  required
                />
                <TextField
                  label="Price (Rs)"
                  name="price"
                  variant="outlined"
                  fullWidth
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PriceCheck />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Enter price"
                  required
                />
              </div>

              {/* Supplier */}
              <TextField
                label="Supplier"
                name="supplier"
                variant="outlined"
                fullWidth
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Enter supplier name"
              />

              {/* Purchase Date */}
              <TextField
                label="Purchase Date"
                name="purchaseDate"
                variant="outlined"
                fullWidth
                type="date"
                value={formData.purchaseDate}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarToday />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                className="py-3 text-lg"
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

export default InventoryForm;
