import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API calls
import * as XLSX from 'xlsx'; // For Excel export
import jsPDF from 'jspdf'; // For PDF export
import 'jspdf-autotable'; // For table formatting in PDF
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const BalanceSheet = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [balanceSheetData, setBalanceSheetData] = useState({
    income: [],
    expenses: [],
    credits: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const closeSidebar = () => setSidebarOpen(false);

  const handleNavigation = (href) => {
    console.log(`Navigating to: ${href}`);
    closeSidebar();
  };

  const calculateTotal = (items) => items.reduce((total, item) => total + item.amount, 0);

  const fetchBalanceSheetData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/balance-sheet'); // Replace with your API endpoint
      setBalanceSheetData(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch balance sheet data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceSheetData();
  }, []);

  const totalIncome = calculateTotal(balanceSheetData.income);
  const totalExpenses = calculateTotal(balanceSheetData.expenses);
  const totalCredits = calculateTotal(balanceSheetData.credits);

  const netBalance = totalIncome - totalExpenses;

  const downloadAsExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet([
      ...balanceSheetData.income.map((item) => ({
        Type: 'Income',
        Detail: item.source,
        Amount: item.amount,
      })),
      ...balanceSheetData.expenses.map((item) => ({
        Type: 'Expense',
        Detail: item.category,
        Amount: item.amount,
      })),
      ...balanceSheetData.credits.map((item) => ({
        Type: 'Credit',
        Detail: item.name,
        Amount: item.balance,
      })),
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Balance Sheet');
    XLSX.writeFile(workbook, 'BalanceSheet.xlsx');
  };

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    doc.text('Balance Sheet', 20, 10);

    doc.autoTable({
      head: [['Type', 'Detail', 'Amount']],
      body: [
        ...balanceSheetData.income.map((item) => ['Income', item.source, `$${item.amount}`]),
        ...balanceSheetData.expenses.map((item) => ['Expense', item.category, `$${item.amount}`]),
        ...balanceSheetData.credits.map((item) => ['Credit', item.name, `$${item.balance}`]),
      ],
    });

    doc.text(`Total Income: $${totalIncome}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Expenses: $${totalExpenses}`, 14, doc.lastAutoTable.finalY + 20);
    doc.text(
      `Net Balance: $${netBalance} (${netBalance >= 0 ? 'Positive' : 'Negative'})`,
      14,
      doc.lastAutoTable.finalY + 30
    );

    doc.save('BalanceSheet.pdf');
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
            <h1 className="text-3xl font-semibold text-gray-800">Balance Sheet</h1>
            <div className="flex space-x-4">
              <button
                onClick={downloadAsExcel}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                disabled={loading || error}
              >
                <span className="material-icons mr-2">table_view</span>
                Download Excel
              </button>
              <button
                onClick={downloadAsPDF}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={loading || error}
              >
                <span className="material-icons mr-2">picture_as_pdf</span>
                Download PDF
              </button>
            </div>
          </div>
          {loading ? (
            <p className="text-center text-gray-500">Loading balance sheet data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <>
              {/* Income Section */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Income</h2>
                <div className="bg-white rounded-lg shadow p-6">
                  <table className="min-w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Source
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {balanceSheetData.income.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-700">{item.source}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">${item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 text-right text-lg font-semibold">
                    Total Income: ${totalIncome}
                  </div>
                </div>
              </section>

              {/* Expenses Section */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Expenses</h2>
                <div className="bg-white rounded-lg shadow p-6">
                  <table className="min-w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {balanceSheetData.expenses.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-700">{item.category}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">${item.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 text-right text-lg font-semibold">
                    Total Expenses: ${totalExpenses}
                  </div>
                </div>
              </section>

              {/* Credits Section */}
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Credits</h2>
                <div className="bg-white rounded-lg shadow p-6">
                  <table className="min-w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-800">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                          Balance
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {balanceSheetData.credits.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-700">{item.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">${item.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 text-right text-lg font-semibold">
                    Total Credits: ${totalCredits}
                  </div>
                </div>
              </section>

              {/* Summary Section */}
              <section className="mt-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Summary</h2>
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-lg">
                    <p className="mb-2">
                      <strong>Net Balance:</strong> ${netBalance}{' '}
                      <span
                        className={`${
                          netBalance >= 0 ? 'text-green-500' : 'text-red-500'
                        } font-bold`}
                      >
                        ({netBalance >= 0 ? 'Positive' : 'Negative'})
                      </span>
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default BalanceSheet;
