import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';


function Home() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const handleNavigation = (href) => {
    console.log(`Navigating to: ${href}`);
    closeSidebar();
  };


 

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={closeSidebar} onNavigate={handleNavigation} />

      {/* Main Content */}
      <div
        className={`flex-1 bg-gray-100 transition-transform duration-300 ${
          isSidebarOpen ? 'lg:ml-64' : ''
        }`}
      >
        <AdminHeader toggleSidebar={toggleSidebar} />
        <main className="p-6">
          <h2 className="text-2xl font-bold mb-4">Welcome to My Dashboard</h2>

          {/* Statistics Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium">Total Companies</h3>
              <p className="text-2xl font-bold text-blue-600">25,000</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium">Active Companies</h3>
              <p className="text-2xl font-bold text-green-600">1,234</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-medium">Blocked Companies</h3>
              <p className="text-2xl font-bold text-purple-600">560</p>
            </div>
            
          </div>
            
        </main>
      </div>
    </div>
  );
}

export default Home;
