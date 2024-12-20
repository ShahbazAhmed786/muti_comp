import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for API calls
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Add, Remove } from '@mui/icons-material';

const AddOrder = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    shop: '',
    salesman: '',
    sector: '',
    date: '',
    time: '',
    status: 'Pending',
    items: [{ name: '', quantity: '', price: '' }],
  });

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = newOrder.items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setNewOrder((prev) => ({ ...prev, items: updatedItems }));
  };

  const addItem = () => {
    setNewOrder((prev) => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: '', price: '' }],
    }));
  };

  const removeItem = (index) => {
    setNewOrder((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      // Send POST request to the API
      const response = await axios.post('/api/orders', newOrder);

      // Show success message and reset form
      alert('Order saved successfully!');
      console.log('Saved Order:', response.data);
      setNewOrder({
        shop: '',
        salesman: '',
        sector: '',
        date: '',
        time: '',
        status: 'Pending',
        items: [{ name: '', quantity: '', price: '' }],
      });
    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please try again.');
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

      <div
        className={`flex-1 bg-gray-100 transition-transform duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />

        <main className="p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Add New Order</h1>

          <div className="bg-white rounded-lg shadow p-6">
            <form>
              <TextField
                label="Shop"
                fullWidth
                margin="normal"
                name="shop"
                value={newOrder.shop}
                onChange={handleInputChange}
              />
              <TextField
                label="Salesman"
                fullWidth
                margin="normal"
                name="salesman"
                value={newOrder.salesman}
                onChange={handleInputChange}
              />
              <TextField
                label="Sector"
                fullWidth
                margin="normal"
                name="sector"
                value={newOrder.sector}
                onChange={handleInputChange}
              />
              <TextField
                label="Date"
                fullWidth
                margin="normal"
                name="date"
                type="date"
                value={newOrder.date}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Time"
                fullWidth
                margin="normal"
                name="time"
                type="time"
                value={newOrder.time}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={newOrder.status}
                  onChange={handleInputChange}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>

              <h3 className="text-lg font-semibold mt-6 mb-4">Items</h3>
              {newOrder.items.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 mb-4">
                  <TextField
                    label="Item Name"
                    fullWidth
                    value={item.name}
                    onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                  />
                  <TextField
                    label="Quantity"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                  <TextField
                    label="Price"
                    type="number"
                    value={item.price}
                    onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                  />
                  <IconButton color="error" onClick={() => removeItem(index)}>
                    <Remove />
                  </IconButton>
                </div>
              ))}
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                onClick={addItem}
              >
                Add Item
              </Button>

              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save Order
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => console.log('Cancel Adding Order')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddOrder;
