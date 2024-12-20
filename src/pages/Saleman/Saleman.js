import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import axios for API calls
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Edit, Delete, Visibility, Search } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';

const SalesmanManagement = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [salesmen, setSalesmen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  // Fetch salesmen from API
  useEffect(() => {
    const fetchSalesmen = async () => {
      try {
        const response = await axios.get('/api/salesmen');
        setSalesmen(response.data);
      } catch (error) {
        console.error('Error fetching salesmen:', error);
      }
    };
    fetchSalesmen();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleEditSalesman = async () => {
    try {
      const response = await axios.put(`/api/salesmen/${selectedSalesman.id}`, selectedSalesman);
      setSalesmen(
        salesmen.map((s) => (s.id === selectedSalesman.id ? response.data : s))
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating salesman:', error);
    }
  };

  const handleDeleteSalesman = async () => {
    try {
      await axios.delete(`/api/salesmen/${selectedSalesman.id}`);
      setSalesmen(salesmen.filter((s) => s.id !== selectedSalesman.id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting salesman:', error);
    }
  };

  const filteredSalesmen = salesmen.filter((salesman) =>
    salesman.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salesman.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Salesman Management</h1>
            <TextField
              placeholder="Search Salesmen..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredSalesmen.length > 0 ? (
                filteredSalesmen.map((salesman) => (
                  <tr key={salesman.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{salesman.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{salesman.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{salesman.phone}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-4">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedSalesman(salesman);
                            setViewModalOpen(true);
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => {
                            setSelectedSalesman(salesman);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setSelectedSalesman(salesman);
                            setDeleteModalOpen(true);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))) : (
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

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onClose={() => setViewModalOpen(false)}>
          <DialogTitle>Salesman Details</DialogTitle>
          <DialogContent>
            {selectedSalesman && (
              <div>
                <p><strong>Name:</strong> {selectedSalesman.name}</p>
                <p><strong>Email:</strong> {selectedSalesman.email}</p>
                <p><strong>Phone:</strong> {selectedSalesman.phone}</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewModalOpen(false)} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogTitle>Edit Salesman</DialogTitle>
          <DialogContent>
            {selectedSalesman && (
              <form className="space-y-4">
                <TextField
                  label="Name"
                  fullWidth
                  variant="outlined"
                  value={selectedSalesman.name}
                  onChange={(e) =>
                    setSelectedSalesman({ ...selectedSalesman, name: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  fullWidth
                  variant="outlined"
                  value={selectedSalesman.email}
                  onChange={(e) =>
                    setSelectedSalesman({ ...selectedSalesman, email: e.target.value })
                  }
                />
                <TextField
                  label="Phone"
                  fullWidth
                  variant="outlined"
                  value={selectedSalesman.phone}
                  onChange={(e) =>
                    setSelectedSalesman({ ...selectedSalesman, phone: e.target.value })
                  }
                />
              </form>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditSalesman} color="primary">
              Save
            </Button>
            <Button onClick={() => setEditModalOpen(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            {selectedSalesman && (
              <p>
                Are you sure you want to delete <strong>{selectedSalesman.name}</strong>?
              </p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteSalesman} color="error">
              Delete
            </Button>
            <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default SalesmanManagement;
