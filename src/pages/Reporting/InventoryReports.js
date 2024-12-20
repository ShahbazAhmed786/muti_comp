import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API requests
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const InventoryReport = () => {
  const [inventoryData, setInventoryData] = useState([]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Fetch inventory data from API
    const fetchInventoryData = async () => {
      try {
        const response = await axios.get('/api/inventory'); // Replace with your API endpoint
        setInventoryData(response.data);
      } catch (error) {
        console.error('Error fetching inventory data:', error);
      }
    };

    fetchInventoryData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      inventoryData.map((item) => ({
        Item: item.item,
        Quantity: item.quantity,
        Movement: item.movement,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventory Report');
    XLSX.writeFile(workbook, 'InventoryReport.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Inventory Report', 20, 10);
    doc.autoTable({
      head: [['Item', 'Quantity', 'Movement']],
      body: inventoryData.map((item) => [item.item, item.quantity, item.movement]),
    });
    doc.save('InventoryReport.pdf');
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Inventory Report</h1>
            <div className="flex space-x-4">
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                <span className="material-icons mr-2">table_view</span>
                Export to Excel
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <span className="material-icons mr-2">picture_as_pdf</span>
                Export to PDF
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Movement
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {inventoryData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{data.item}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{data.quantity}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{data.movement}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InventoryReport;
