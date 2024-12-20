import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  Button,
  TextField,
  Paper,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
} from '@mui/material';
import { TableView, PictureAsPdf, Edit, Search } from '@mui/icons-material';
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF

const SalaryManagement = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [salesmen, setSalesmen] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSalesman, setSelectedSalesman] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [newSalary, setNewSalary] = useState('');

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const fetchSalesmen = async () => {
    try {
      const response = await axios.get('/api/salesmen'); // Replace with your API endpoint
      setSalesmen(response.data);
    } catch (error) {
      console.error('Error fetching salesmen:', error);
    }
  };

  useEffect(() => {
    fetchSalesmen();
  }, []);

  const handleUpdateSalary = (salesman) => {
    setSelectedSalesman(salesman);
    setNewSalary(salesman.salary);
    setModalOpen(true);
  };

  const saveUpdatedSalary = async () => {
    try {
      const updatedSalesman = { ...selectedSalesman, salary: parseFloat(newSalary) };
      await axios.put(`/api/salesmen/${selectedSalesman.id}`, updatedSalesman); // Replace with your API endpoint
      setSalesmen((prev) =>
        prev.map((salesman) =>
          salesman.id === selectedSalesman.id ? updatedSalesman : salesman
        )
      );
      setModalOpen(false);
    } catch (error) {
      console.error('Error updating salary:', error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(salesmen);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Salaries');
    XLSX.writeFile(workbook, 'SalaryRecords.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Salary Records', 20, 10);
    doc.autoTable({
      head: [['ID', 'Name', 'Salary']],
      body: salesmen.map((salesman) => [
        salesman.id,
        salesman.name,
        `$${salesman.salary.toFixed(2)}`,
      ]),
    });
    doc.save('SalaryRecords.pdf');
  };

  const filteredSalesmen = salesmen.filter((salesman) =>
    salesman.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            <Typography variant="h4" className="text-gray-800">
              Salary Management
            </Typography>
            <div className="flex-grow mx-6">
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
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

          <Paper elevation={3} className="rounded-lg">
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Salary
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSalesmen.map((salesman) => (
                  <tr key={salesman.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {salesman.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {salesman.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      ${salesman.salary.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <IconButton
                        color="primary"
                        onClick={() => handleUpdateSalary(salesman)}
                      >
                        <Edit />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        </main>

        {/* Update Salary Modal */}
        <Dialog open={isModalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>Update Salary</DialogTitle>
          <DialogContent>
            <Typography variant="body1" className="mb-4">
              Update Salary for {selectedSalesman?.name}
            </Typography>
            <TextField
              label="New Salary"
              type="number"
              fullWidth
              variant="outlined"
              value={newSalary}
              onChange={(e) => setNewSalary(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={saveUpdatedSalary}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
            <Button
              onClick={() => setModalOpen(false)}
              variant="contained"
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

export default SalaryManagement;
