import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API calls
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const AttendanceReport = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const fetchAttendanceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/attendance'); // Replace with your API endpoint
      setAttendanceData(response.data);
    } catch (err) {
      setError('Failed to fetch attendance data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      attendanceData.map((item) => ({
        Employee: item.employee,
        Attendance: item.attendance,
        Performance: item.performance,
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');
    XLSX.writeFile(workbook, 'AttendanceReport.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Attendance Report', 20, 10);
    doc.autoTable({
      head: [['Employee', 'Attendance', 'Performance']],
      body: attendanceData.map((item) => [
        item.employee,
        item.attendance,
        item.performance,
      ]),
    });
    doc.save('AttendanceReport.pdf');
  };

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
            <h1 className="text-3xl font-semibold text-gray-800">Attendance Report</h1>
            <div className="flex space-x-4">
              <button
                onClick={exportToExcel}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={loading || error}
              >
                <span className="material-icons mr-2">table_view</span>
                Export to Excel
              </button>
              <button
                onClick={exportToPDF}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={loading || error}
              >
                <span className="material-icons mr-2">picture_as_pdf</span>
                Export to PDF
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading attendance data...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Employee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Attendance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((data, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">{data.employee}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{data.attendance}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{data.performance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AttendanceReport;
