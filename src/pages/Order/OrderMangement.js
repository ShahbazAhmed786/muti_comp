import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Edit, Delete, Search, Visibility } from '@mui/icons-material';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const OrderManagement = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/orders');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.shop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.salesman.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open edit modal
  const handleEdit = (order) => {
    setSelectedOrder(order);
    setEditModalOpen(true);
  };

  // Handle input changes in the edit modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setSelectedOrder((prev) => ({ ...prev, [name]: value }));
  };

  // Save edited order to the API
  const handleSaveEdit = async () => {
    try {
      await axios.put(`/api/orders/${selectedOrder.id}`, selectedOrder);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id ? selectedOrder : order
        )
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  // Open delete modal
  const handleDelete = (order) => {
    setSelectedOrder(order);
    setDeleteModalOpen(true);
  };

  // Confirm delete and update API
  const confirmDelete = async () => {
    try {
      await axios.delete(`/api/orders/${selectedOrder.id}`);
      setOrders((prev) => prev.filter((order) => order.id !== selectedOrder.id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  // Open view modal
  const handleView = (order) => {
    setSelectedOrder(order);
    setViewModalOpen(true);
  };

  return (
    <div className="flex h-full">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div
        className={`flex-1 bg-gray-100 transition-transform duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              Order Management
            </h1>
            <TextField
              placeholder="Search by shop or salesman..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3">Shop</th>
                  <th className="px-6 py-3">Salesman</th>
                  <th className="px-6 py-3">Sector</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Time</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4">{order.shop}</td>
                    <td className="px-6 py-4">{order.salesman}</td>
                    <td className="px-6 py-4">{order.sector}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4">{order.time}</td>
                    <td className="px-6 py-4">{order.status}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-4">
                        <IconButton
                          color="primary"
                          onClick={() => handleView(order)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleEdit(order)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(order)}
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-500">
                      No data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
        {/* Modals */}
        {/* View Modal */}
        {isViewModalOpen && selectedOrder && (
          <Dialog open={isViewModalOpen} onClose={() => setViewModalOpen(false)}>
            <DialogTitle>Order Details</DialogTitle>
            <DialogContent>
              <p><strong>Shop:</strong> {selectedOrder.shop}</p>
              <p><strong>Salesman:</strong> {selectedOrder.salesman}</p>
              <p><strong>Sector:</strong> {selectedOrder.sector}</p>
              <p><strong>Date:</strong> {selectedOrder.date}</p>
              <p><strong>Time:</strong> {selectedOrder.time}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              <ul>
                {selectedOrder.items.map((item, index) => (
                  <li key={index}>{item.name} - {item.quantity} x ${item.price}</li>
                ))}
              </ul>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewModalOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}
        {/* Edit Modal */}
        {isEditModalOpen && selectedOrder && (
          <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogContent>
              <TextField
                label="Shop"
                fullWidth
                margin="normal"
                name="shop"
                value={selectedOrder.shop}
                onChange={handleEditChange}
              />
              {/* Add similar fields for other editable properties */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSaveEdit}>Save</Button>
              <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
        )}
        {/* Delete Modal */}
        {isDeleteModalOpen && selectedOrder && (
          <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete this order?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={confirmDelete} color="error">Delete</Button>
              <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
