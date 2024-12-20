import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API calls
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const PaymentsReport = () => {
  const [paymentData, setPaymentData] = useState([]); // State to hold payment data
  const [isLoading, setIsLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error handling

  // Fetch payment data from API
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const response = await axios.get('/api/payments'); // Replace with your API endpoint
        setPaymentData(response.data);
      } catch (err) {
        setError('Failed to fetch payment data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      paymentData.map((item) => ({
        Name: item.name,
        Outstanding: item.outstanding,
        Balance: item.balance,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments Report');
    XLSX.writeFile(workbook, 'PaymentsReport.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Payments Report', 20, 10);
    doc.autoTable({
      head: [['Name', 'Outstanding', 'Balance']],
      body: paymentData.map((item) => [
        item.name,
        `$${item.outstanding}`,
        `$${item.balance}`,
      ]),
    });
    doc.save('PaymentsReport.pdf');
  };

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

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
            <h1 className="text-3xl font-semibold text-gray-800">Payments Report</h1>
            <div className="flex space-x-4">
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={isLoading || error}
              >
                <span className="material-icons mr-2">table_view</span>
                Export to Excel
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={isLoading || error}
              >
                <span className="material-icons mr-2">picture_as_pdf</span>
                Export to PDF
              </button>
            </div>
          </div>

          {isLoading ? (
            <p>Loading payment data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="bg-white rounded-lg shadow p-6">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Outstanding
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">{data.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">${data.outstanding}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">${data.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default PaymentsReport;
