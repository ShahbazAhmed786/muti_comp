import React, { useState } from 'react';
import Sidebar from '../../components/AdminSidebar';
import Header from '../../components/AdminHeader';
import {
  Edit,
  Delete,
  Visibility,
  Search,
 
} from '@mui/icons-material';
import {
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';

const ManageCompanies = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [editCompany, setEditCompany] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [deleteCompany, setDeleteCompany] = useState(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const rowsPerPage = 8;

  const [companies, setCompanies] = useState([
    {
      id: 1,
      name: 'TechCorp',
      address: '123 Tech Lane, Silicon Valley, CA',
      phone: '+1-234-567-8900',
      details: 'Leading provider of tech solutions.',
      logo: 'https://via.placeholder.com/150',
      access: true,
    },
    {
      id: 2,
      name: 'HealthFirst',
      address: '456 Wellness Blvd, Austin, TX',
      phone: '+1-987-654-3210',
      details: 'Healthcare solutions and services.',
      logo: 'https://via.placeholder.com/150',
      access: false,
    },
    {
      id: 3,
      name: 'EduWorld',
      address: '789 Learning St, Boston, MA',
      phone: '+1-555-123-4567',
      details: 'Educational services provider.',
      logo: 'https://via.placeholder.com/150',
      access: true,
    },
  ]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalRows = filteredCompanies.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, endIndex);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleView = (company) => {
    setSelectedCompany(company);
    setViewModalOpen(true);
  };

  const handleEdit = (company) => {
    setEditCompany(company);
    setEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditCompany((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setCompanies((prev) =>
      prev.map((company) =>
        company.id === editCompany.id ? { ...editCompany } : company
      )
    );
    setEditModalOpen(false);
  };

  const handleDelete = (company) => {
    setDeleteCompany(company);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setCompanies((prev) =>
      prev.filter((company) => company.id !== deleteCompany.id)
    );
    setDeleteModalOpen(false);
  };

  const toggleAccess = (company) => {
    setCompanies((prev) =>
      prev.map((comp) =>
        comp.id === company.id ? { ...comp, access: !comp.access } : comp
      )
    );
  };

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
                className={`flex-1 bg-gray-100 transition-transform duration-300 ${
                  isSidebarOpen ? 'lg:ml-64' : ''
                }`}
              >
                <Header toggleSidebar={toggleSidebar} />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Manage Companies</h1>
            <TextField
              placeholder="Search companies..."
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

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Company</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Address</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Phone</th>
                  <th className="px-6 py-3 text-center text-sm font-medium">Access</th>
                  <th className="px-6 py-3 text-center text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedCompanies.map((company) => (
                  <tr key={company.id}>
                    <td className="px-6 py-4 flex items-center space-x-4">
                      <img
                        src={company.logo}
                        alt="Company Logo"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="text-gray-700">{company.name}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{company.address}</td>
                    <td className="px-6 py-4 text-gray-700">{company.phone}</td>
                    <td className="px-6 py-4 text-center">
                      <FormControlLabel
                        control={
                          <Switch
                            checked={company.access}
                            onChange={() => toggleAccess(company)}
                            color="primary"
                          />
                        }
                        label={company.access ? 'Allowed' : 'Blocked'}
                      />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-4">
                        <IconButton
                          color="primary"
                          onClick={() => handleView(company)}
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton
                          color="secondary"
                          onClick={() => handleEdit(company)}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(company)}
                        >
                          <Delete />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <Button
                key={index}
                onClick={() => handlePageChange(index + 1)}
                variant={currentPage === index + 1 ? 'contained' : 'outlined'}
                color="primary"
                size="small"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </main>

        {/* View Modal */}
        {isViewModalOpen && selectedCompany && (
          <Dialog open={isViewModalOpen} onClose={() => setViewModalOpen(false)}>
            <DialogTitle>{selectedCompany.name}</DialogTitle>
            <DialogContent>
              <img
                src={selectedCompany.logo}
                alt="Company Logo"
                className="w-32 h-32 rounded-full mx-auto mb-4"
              />
              <p>
                <strong>Address:</strong> {selectedCompany.address}
              </p>
              <p>
                <strong>Phone:</strong> {selectedCompany.phone}
              </p>
              <p>
                <strong>Details:</strong> {selectedCompany.details}
              </p>
              <p>
                <strong>Access:</strong>{' '}
                {selectedCompany.access ? 'Allowed' : 'Blocked'}
              </p>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewModalOpen(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Edit Modal */}
        {isEditModalOpen && editCompany && (
          <Dialog open={isEditModalOpen} onClose={() => setEditModalOpen(false)}>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogContent>
              <TextField
                label="Company Name"
                fullWidth
                margin="normal"
                name="name"
                value={editCompany.name}
                onChange={handleEditChange}
              />
              <TextField
                label="Address"
                fullWidth
                margin="normal"
                name="address"
                value={editCompany.address}
                onChange={handleEditChange}
              />
              <TextField
                label="Phone"
                fullWidth
                margin="normal"
                name="phone"
                value={editCompany.phone}
                onChange={handleEditChange}
              />
              <TextField
                label="Details"
                fullWidth
                margin="normal"
                name="details"
                value={editCompany.details}
                onChange={handleEditChange}
                multiline
                rows={3}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSave} color="primary">
                Save
              </Button>
              <Button onClick={() => setEditModalOpen(false)} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}

        {/* Delete Modal */}
        {isDeleteModalOpen && deleteCompany && (
          <Dialog open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              <p>Are you sure you want to delete {deleteCompany.name}?</p>
            </DialogContent>
            <DialogActions>
              <Button onClick={confirmDelete} color="error">
                Delete
              </Button>
              <Button onClick={() => setDeleteModalOpen(false)} color="secondary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default ManageCompanies;
