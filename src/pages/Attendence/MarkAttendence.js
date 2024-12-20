import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  Button,
  TextField,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Download } from '@mui/icons-material';
import * as XLSX from 'xlsx'; // For Excel export
import axios from 'axios';

const AttendanceManagement = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const closeSidebar = () => setSidebarOpen(false);

  const handleNavigation = (href) => {
    console.log(`Navigating to: ${href}`);
    closeSidebar();
  };

  // Fetch attendance data from the API
  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/attendance');
      if (response.data.success) {
        setAttendanceData(response.data.attendance);
      } else {
        console.error('Error fetching attendance data');
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData(); // Fetch data when component mounts
  }, []);

  const handleAttendanceChange = async (id, status) => {
    try {
      const response = await axios.put(`/api/attendance/${id}`, {
        status,
        date: currentDate,
      });
      if (response.data.success) {
        setAttendanceData((prev) =>
          prev.map((record) =>
            record.id === id ? { ...record, status, date: currentDate } : record
          )
        );
      } else {
        console.error('Error updating attendance status');
      }
    } catch (error) {
      console.error('Error updating attendance status:', error);
    }
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(attendanceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, 'AttendanceReport.xlsx');
  };

  return (
    <div className="flex h-full">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onNavigate={handleNavigation} />

      <div className={`flex-1 bg-gray-100 transition-transform duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}>
        <Header toggleSidebar={toggleSidebar} />

        <main className="p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Attendance Management</h1>

          <div className="flex justify-between items-center mb-6">
            <TextField
              label="Date"
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              size="small"
              className="mr-4"
            />
            <Button
              onClick={exportToExcel}
              variant="contained"
              color="success"
              startIcon={<Download />}
            >
              Export Report
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <CircularProgress />
            </div>
          ) : (
            <Paper elevation={3} className="bg-white rounded-lg shadow p-6">
              <table className="min-w-full border-collapse border border-gray-200">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Attendance Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendanceData.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{record.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.status || 'Not Marked'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {record.date || 'Not Marked'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant={record.status === 'Present' ? 'contained' : 'outlined'}
                            color="success"
                            onClick={() => handleAttendanceChange(record.id, 'Present')}
                          >
                            Present
                          </Button>
                          <Button
                            variant={record.status === 'Absent' ? 'contained' : 'outlined'}
                            color="error"
                            onClick={() => handleAttendanceChange(record.id, 'Absent')}
                          >
                            Absent
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Paper>
          )}
        </main>
      </div>
    </div>
  );
};

export default AttendanceManagement;
