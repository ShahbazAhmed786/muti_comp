import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  IconButton,
} from '@mui/material';
import { Edit, Delete, Search, Visibility } from '@mui/icons-material';

const SectorView = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [selectedSector, setSelectedSector] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    // Fetch sectors from API
    const fetchSectors = async () => {
      try {
        const response = await axios.get('/api/sectors');
        setSectors(response.data);
      } catch (error) {
        console.error('Error fetching sectors:', error);
      }
    };
    fetchSectors();
  }, []);

  const handleEditSector = (sector) => {
    setSelectedSector(sector);
    setEditModalOpen(true);
  };

  const handleDeleteSector = (sector) => {
    setSelectedSector(sector);
    setDeleteModalOpen(true);
  };

  const handleViewSector = (sector) => {
    setSelectedSector(sector);
    setViewModalOpen(true);
  };

  const saveEditedSector = async () => {
    try {
      const response = await axios.put(`/api/sectors/${selectedSector.id}`, {
        name: selectedSector.name,
      });
      setSectors((prev) =>
        prev.map((sector) =>
          sector.id === selectedSector.id ? { ...selectedSector } : sector
        )
      );
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error saving edited sector:', error);
    }
  };

  const confirmDeleteSector = async () => {
    try {
      await axios.delete(`/api/sectors/${selectedSector.id}`);
      setSectors((prev) => prev.filter((sector) => sector.id !== selectedSector.id));
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting sector:', error);
    }
  };

  const filteredSectors = sectors.filter((sector) =>
    sector.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Sector Management</h1>
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search sectors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Search fontSize="small" style={{ marginRight: '8px' }} />
                ),
              }}
            />
          </div>

          <Paper elevation={3} className="p-4">
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow style={{ backgroundColor: '#222' }}>
                    <TableCell style={{ color: 'white' }}>ID</TableCell>
                    <TableCell style={{ color: 'white' }}>Name</TableCell>
                    <TableCell style={{ color: 'white' }}>Shops</TableCell>
                    <TableCell align="center" style={{ color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                {filteredSectors.length > 0 ? (
                  filteredSectors.map((sector) => (
                    <TableRow key={sector.id} hover>
                      <TableCell>{sector.id}</TableCell>
                      <TableCell>{sector.name}</TableCell>
                      <TableCell>{sector.shops.join(', ')}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => handleViewSector(sector)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="primary"
                          onClick={() => handleEditSector(sector)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteSector(sector)}
                        >
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                        No items found
                      </td>
                    </tr>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </main>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onClose={() => setViewModalOpen(false)}>
          <DialogTitle>Sector Details</DialogTitle>
          <DialogContent>
            <p><strong>ID:</strong> {selectedSector?.id}</p>
            <p><strong>Name:</strong> {selectedSector?.name}</p>
            <p><strong>Shops:</strong> {selectedSector?.shops.join(', ')}</p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setViewModalOpen(false)}
              variant="outlined"
              color="primary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
          <DialogTitle>Edit Sector</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={selectedSector?.name || ''}
              onChange={(e) =>
                setSelectedSector((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={saveEditedSector} variant="contained" color="primary">
              Save
            </Button>
            <Button onClick={() => setEditModalOpen(false)} variant="outlined" color="secondary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Modal */}
        <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <p>
              Are you sure you want to delete <strong>{selectedSector?.name}</strong>?
            </p>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={confirmDeleteSector}
              variant="contained"
              color="error"
            >
              Delete
            </Button>
            <Button
              onClick={() => setDeleteModalOpen(false)}
              variant="outlined"
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default SectorView;
