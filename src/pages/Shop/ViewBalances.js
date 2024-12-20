import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  Button,
  TextField,
  Paper,
  Typography,
} from '@mui/material';
import {
  Edit,
  Delete,
  Save,
  Cancel,
  PictureAsPdf,
  TableView,
} from '@mui/icons-material';
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF

const ShopManagement = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formState, setFormState] = useState({ name: '', address: '', contact: '', balance: '' });

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const closeSidebar = () => setSidebarOpen(false);

  const handleNavigation = (href) => {
    console.log(`Navigating to: ${href}`);
    closeSidebar();
  };

  // Fetch shops from API
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await axios.get('/api/shops'); // Replace with your API endpoint
        setShops(response.data);
      } catch (error) {
        console.error('Error fetching shops:', error);
      }
    };
    fetchShops();
  }, []);

  const handleEditShop = (shop) => {
    setSelectedShop(shop);
    setFormState({ ...shop });
    setModalOpen(true);
  };

  const handleAddShop = () => {
    setSelectedShop(null);
    setFormState({ name: '', address: '', contact: '', balance: '' });
    setModalOpen(true);
  };

  const handleDeleteShop = (shop) => {
    setSelectedShop(shop);
    setDeleteModalOpen(true);
  };

  const confirmDeleteShop = async () => {
    try {
      await axios.delete(`/api/shops/${selectedShop.id}`); // Replace with your API endpoint
      setShops((prev) => prev.filter((shop) => shop.id !== selectedShop.id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting shop:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const saveShop = async () => {
    if (!formState.name || !formState.address || !formState.contact || formState.balance === '') {
      alert('Please fill in all fields.');
      return;
    }

    try {
      if (selectedShop) {
        // Update shop
        await axios.put(`/api/shops/${selectedShop.id}`, formState); // Replace with your API endpoint
        setShops((prev) =>
          prev.map((shop) => (shop.id === selectedShop.id ? { ...formState, id: shop.id } : shop))
        );
      } else {
        // Add new shop
        const response = await axios.post('/api/shops', formState); // Replace with your API endpoint
        setShops((prev) => [...prev, response.data]);
      }

      setModalOpen(false);
    } catch (error) {
      console.error('Error saving shop:', error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(shops);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Shops');
    XLSX.writeFile(workbook, 'ShopRecords.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Shop Records', 20, 10);
    doc.autoTable({
      head: [['ID', 'Name', 'Address', 'Contact', 'Balance']],
      body: shops.map((shop) => [
        shop.id,
        shop.name,
        shop.address,
        shop.contact,
        `$${shop.balance.toFixed(2)}`,
      ]),
    });
    doc.save('ShopRecords.pdf');
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
          <div className="flex justify-between items-center mb-6">
            <Typography variant="h4" className="text-gray-800">
              Shop Management
            </Typography>
            <div className="flex space-x-4">
              <Button
                onClick={exportToExcel}
                variant="contained"
                color="success"
                startIcon={<TableView />}
              >
                Export to Excel
              </Button>
              <Button
                onClick={exportToPDF}
                variant="contained"
                color="error"
                startIcon={<PictureAsPdf />}
              >
                Export to PDF
              </Button>
            </div>
          </div>

          <Paper elevation={3} className="bg-white rounded-lg shadow p-4">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Contact Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Balance
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {shops.map((shop) => (
                  <tr key={shop.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{shop.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{shop.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{shop.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{shop.contact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${shop.balance.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Button
                        onClick={() => handleEditShop(shop)}
                        color="secondary"
                        startIcon={<Edit />}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDeleteShop(shop)}
                        color="error"
                        startIcon={<Delete />}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </main>

        {/* Add/Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Paper elevation={3} className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <Typography variant="h5" className="space-y-4">
                {selectedShop ? 'Edit Shop' : 'Add Shop'}
              </Typography>
              <div className="space-y-5">
                <TextField
                  label="Name"
                  name="name"
                  value={formState.name}
                  onChange={handleFormChange}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  label="Address"
                  name="address"
                  value={formState.address}
                  onChange={handleFormChange}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  label="Contact Info"
                  name="contact"
                  value={formState.contact}
                  onChange={handleFormChange}
                  variant="outlined"
                  fullWidth
                />
                <TextField
                  label="Balance"
                  name="balance"
                  value={formState.balance}
                  onChange={handleFormChange}
                  type="number"
                  variant="outlined"
                  fullWidth
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  onClick={saveShop}
                  variant="contained"
                  color="primary"
                  startIcon={<Save />}
                >
                  Save
                </Button>
                <Button
                  onClick={() => setModalOpen(false)}
                  variant="contained"
                  color="secondary"
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
              </div>
            </Paper>
          </div>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <Paper elevation={3} className="bg-white rounded-lg shadow-lg p-6 w-1/3">
              <Typography variant="h5" className="mb-4">
                Confirm Delete
              </Typography>
              <Typography variant="body1" className="mb-4">
                Are you sure you want to delete <strong>{selectedShop?.name}</strong>?
              </Typography>
              <div className="flex justify-end gap-5">
                <Button
                  onClick={confirmDeleteShop}
                  variant="contained"
                  color="secondary"
                  startIcon={<Delete />}
                  className="mr-2"
                >
                  Delete
                </Button>
                <Button
                  onClick={() => setDeleteModalOpen(false)}
                  variant="contained"
                  color="default"
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
              </div>
            </Paper>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopManagement;
