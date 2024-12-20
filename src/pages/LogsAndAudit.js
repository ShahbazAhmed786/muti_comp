import React, { useState } from 'react';
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const LogsAndAudit = () => {
  const [logs] = useState([
    { action: 'Data Upload', description: 'Uploaded sales data', timestamp: '2024-12-10 10:00 AM' },
    { action: 'Attendance', description: 'Marked attendance for Team A', timestamp: '2024-12-10 10:15 AM' },
    { action: 'Payment', description: 'Processed payment for Shop B', timestamp: '2024-12-10 11:00 AM' },
  ]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      logs.map((log) => ({
        Action: log.action,
        Description: log.description,
        Timestamp: log.timestamp,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs and Audit');
    XLSX.writeFile(workbook, 'LogsAndAudit.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Logs and Audit', 20, 10);
    doc.autoTable({
      head: [['Action', 'Description', 'Timestamp']],
      body: logs.map((log) => [log.action, log.description, log.timestamp]),
    });
    doc.save('LogsAndAudit.pdf');
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
            <h1 className="text-3xl font-semibold text-gray-800">Logs and Audit</h1>
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
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-700">{log.action}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{log.description}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{log.timestamp}</td>
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

export default LogsAndAudit;
