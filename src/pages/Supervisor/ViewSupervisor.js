import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Edit, Delete, Visibility } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from '@mui/material';

const SupervisorManagement = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const fetchSupervisors = async () => {
    try {
      const response = await axios.get('/api/supervisors');
      setSupervisors(response.data);
    } catch (error) {
      console.error('Error fetching supervisors:', error);
    }
  };

  const handleEditSupervisor = async () => {
    try {
      await axios.put(`/api/supervisors/${selectedSupervisor.id}`, selectedSupervisor);
      setSupervisors((prev) =>
        prev.map((sup) => (sup.id === selectedSupervisor.id ? { ...selectedSupervisor } : sup))
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating supervisor:', error);
    }
  };

  const handleDeleteSupervisor = async () => {
    try {
      await axios.delete(`/api/supervisors/${selectedSupervisor.id}`);
      setSupervisors((prev) => prev.filter((sup) => sup.id !== selectedSupervisor.id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting supervisor:', error);
    }
  };

  const filteredSupervisors = supervisors.filter((sup) =>
    sup.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-3xl font-semibold text-gray-800">Supervisor Management</h1>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search supervisors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              {filteredSupervisors.length > 0 ? (
                filteredSupervisors.map((supervisor) => (
                  <tr key={supervisor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{supervisor.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{supervisor.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{supervisor.phone}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-4">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setSelectedSupervisor(supervisor);
                            setViewModalOpen(true);
                          }}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => {
                            setSelectedSupervisor(supervisor);
                            setEditModalOpen(true);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => {
                            setSelectedSupervisor(supervisor);
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
          <DialogTitle>Supervisor Details</DialogTitle>
          <DialogContent>
            {selectedSupervisor && (
              <div>
                <p>
                  <strong>Name:</strong> {selectedSupervisor.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedSupervisor.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedSupervisor.phone}
                </p>
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
          <DialogTitle>Edit Supervisor</DialogTitle>
          <DialogContent>
            {selectedSupervisor && (
              <form className="space-y-4">
                <TextField
                  label="Name"
                  fullWidth
                  variant="outlined"
                  value={selectedSupervisor.name}
                  onChange={(e) =>
                    setSelectedSupervisor({ ...selectedSupervisor, name: e.target.value })
                  }
                />
                <TextField
                  label="Email"
                  fullWidth
                  variant="outlined"
                  value={selectedSupervisor.email}
                  onChange={(e) =>
                    setSelectedSupervisor({ ...selectedSupervisor, email: e.target.value })
                  }
                />
                <TextField
                  label="Phone"
                  fullWidth
                  variant="outlined"
                  value={selectedSupervisor.phone}
                  onChange={(e) =>
                    setSelectedSupervisor({ ...selectedSupervisor, phone: e.target.value })
                  }
                />
              </form>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleEditSupervisor} color="primary">
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
            {selectedSupervisor && (
              <p>
                Are you sure you want to delete <strong>{selectedSupervisor.name}</strong>?
              </p>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteSupervisor} color="error">
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

export default SupervisorManagement;
