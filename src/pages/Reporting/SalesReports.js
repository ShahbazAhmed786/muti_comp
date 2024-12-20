import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API requests
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Paper,
} from '@mui/material';
import { TableView, PictureAsPdf, DateRange } from '@mui/icons-material';

const SalesReport = () => {
  const [salesData, setSalesData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get('/api/sales-report'); // Replace with your API endpoint
        setSalesData(response.data);
        setFilteredData(response.data);
      } catch (error) {
        console.error('Error fetching sales data:', error);
        alert('Failed to fetch sales data.');
      }
    };
    fetchSalesData();
  }, []);

  const filterByDate = () => {
    const filtered = salesData.filter((item) => {
      const itemDate = new Date(item.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      return (
        (!start || itemDate >= start) &&
        (!end || itemDate <= end)
      );
    });
    setFilteredData(filtered);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      filteredData.map((item) => ({
        Category: item.category,
        Sales: item.sales,
        Date: item.date,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sales Report');
    XLSX.writeFile(workbook, 'SalesReport.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Sales Report', 20, 10);
    doc.autoTable({
      head: [['Category', 'Sales', 'Date']],
      body: filteredData.map((item) => [item.category, `$${item.sales}`, item.date]),
    });
    doc.save('SalesReport.pdf');
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800 mb-4 sm:mb-0">Sales Report</h1>
            <div className="flex space-x-4">
              <TextField
                label="Start Date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
              />
              <TextField
                label="End Date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
                variant="outlined"
                size="small"
              />
              <Button
                onClick={filterByDate}
                variant="contained"
                color="primary"
                startIcon={<DateRange />}
              >
                Filter
              </Button>
            </div>
          </div>

          <div className="flex justify-end mb-4">
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
            <TableContainer>
              <Table>
                <TableHead className="bg-gray-800">
                  <TableRow>
                    <TableCell className="text-white font-bold">Category</TableCell>
                    <TableCell className="text-white font-bold">Sales</TableCell>
                    <TableCell className="text-white font-bold">Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((data, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell>{data.category}</TableCell>
                      <TableCell>${data.sales}</TableCell>
                      <TableCell>{data.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </main>
      </div>
    </div>
  );
};

export default SalesReport;
