import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Chart from 'react-apexcharts';
import axios from 'axios';

function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [salesData, setSalesData] = useState(null);
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleNavigation = (href) => {
    console.log(`Navigating to: ${href}`);
    closeSidebar();
  };

  // Fetch sales data and top selling products from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sales chart data
        const salesResponse = await axios.get('/api/sales');
        setSalesData(salesResponse.data);

        // Fetch top-selling products data
        const productsResponse = await axios.get('/api/top-selling-products');
        setTopSellingProducts(productsResponse.data);

        setLoading(false);
      } catch (err) {
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle chart data structure
  const chartOptions = {
    chart: {
      id: 'sales-chart',
      type: 'line',
    },
    xaxis: {
      categories: salesData ? salesData.months : [], // Dynamically use months from API
    },
  };

  const chartSeries = salesData
    ? [
        {
          name: 'Product Sales',
          data: salesData.sales, // Dynamically use sales data from API
        },
      ]
    : [];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onNavigate={handleNavigation} />

      {/* Main Content */}
      <div
        className={`flex-1 bg-gray-100 transition-transform duration-300 ${isSidebarOpen ? 'lg:ml-64' : ''}`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to My Dashboard</h2>

          {/* Loading State */}
          {loading && <p>Loading...</p>}

          {/* Error Message */}
          {error && <p className="text-red-600">{error}</p>}

          {/* Statistics Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium">Total Sales</h3>
              <p className="text-2xl font-bold text-blue-600">{salesData ? salesData.totalSales : 'Loading'}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium">Products Sold</h3>
              <p className="text-2xl font-bold text-green-600">{salesData ? salesData.totalProductsSold : 'Loading'}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium">Active Customers</h3>
              <p className="text-2xl font-bold text-purple-600">{salesData ? salesData.activeCustomers : 'Loading'}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium">Revenue</h3>
              <p className="text-2xl font-bold text-yellow-600">{salesData ? salesData.revenue : 'Loading'}</p>
            </div>
          </div>

          {/* Chart and Top Selling Products */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sales Chart */}
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Product Sales Over Time</h3>
              {salesData ? (
                <Chart options={chartOptions} series={chartSeries} type="line" height={300} />
              ) : (
                <p>Loading chart...</p>
              )}
            </div>

            {/* Top Selling Products */}
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium mb-4">Top Selling Products</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="border-b p-2">Product Name</th>
                    <th className="border-b p-2">Units Sold</th>
                    <th className="border-b p-2">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.map((product, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2">{product.name}</td>
                      <td className="p-2">{product.unitsSold}</td>
                      <td className="p-2">{product.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;
