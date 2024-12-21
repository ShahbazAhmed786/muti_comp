import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AddItems from './pages/Inventory/AddItems';
import ViewItems from './pages/Inventory/ViewItems';
import Home from './pages/Home';
import CreateCompany from './pages/company-management/CreateCompany';
import ManageCompanies from './pages/company-management/ManageCompanies';
import AddSector from './pages/Sector/AddSector';
import ViewSector from './pages/Sector/ViewSector';
import AssignShops from './pages/Sector/AssignShops';
import AddSalary from './pages/Salary/AddSalary';
import ViewSalary from './pages/Salary/ViewSalary';
import MarkAttendence from './pages/Attendence/MarkAttendence';
import AddShop from './pages/Shop/AddShop';
import ViewBalances from './pages/Shop/ViewBalances';
import AttendenceReport from './pages/Reporting/AttendenceReport';
import InventoryReports from './pages/Reporting/InventoryReports';
import PaymentsReport from './pages/Reporting/PaymentsReport';
import SalesReport from './pages/Reporting/SalesReports';
import Payments from './pages/Payments';
import BalanceSheet from './pages/BalanceSheet';
import LogsAndAudit from './pages/LogsAndAudit';
import AddSaleman from './pages/Saleman/AddSaleman';
import Saleman from './pages/Saleman/Saleman';
import AddSupervisor from './pages/Supervisor/AddSupervisor';
import ViewSupervisor from './pages/Supervisor/ViewSupervisor';
import LoginPage from './pages/Login';
import CompanyRegisterPage from './pages/Register';
import ForgetPasswordPage from './pages/Forget';
import Profile from './pages/Profile';
import OrderMangement from './pages/Order/OrderMangement';
import AddOrder from './pages/Order/AddOrder';
import Admin from './pages/Admin';
import AdminProfile from './pages/AdminProfile';

const App = () => {
  return (
    <div className="flex">
      <main className="flex-1">
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/company-management/create" element={<CreateCompany />} />
          <Route path="/company-management/manage" element={<ManageCompanies />} />
          <Route path="/Sector/add" element={<AddSector />} />
          <Route path="/Sector/view" element={<ViewSector />} />
          <Route path="/sector/assign" element={<AssignShops />} />
          <Route path="/inventory/add" element={<AddItems />} />
          <Route path="/inventory/view" element={<ViewItems />} />
          <Route path="/salary/add" element={<AddSalary />} />
          <Route path="/salary/view" element={<ViewSalary />} />
          <Route path="/attendance/mark" element={<MarkAttendence />} />
          <Route path="/shop/add" element={<AddShop />} />
          <Route path="/shop/balances" element={<ViewBalances />} />
          <Route path="/reporting/attendance" element={<AttendenceReport />} />
          <Route path="/reporting/inventory" element={<InventoryReports />} />
          <Route path="/reporting/sales" element={<SalesReport />} />
          <Route path="/reporting/payments" element={<PaymentsReport />} />
          <Route path="/payment" element={<Payments />} />
          <Route path="/balance-sheet" element={<BalanceSheet />} />
          <Route path="/logs-and-audit" element={<LogsAndAudit />} />
          <Route path="/saleman/add" element={<AddSaleman />} />
          <Route path="/saleman/view" element={<Saleman />} />
          <Route path="/supervisor/add" element={<AddSupervisor />} />
          <Route path="/supervisor/view" element={<ViewSupervisor />} />
          <Route path="/" element={<LoginPage />} />
          <Route path="/CompanyRegister" element={<CompanyRegisterPage />} />
          <Route path="/forgetpassword" element={<ForgetPasswordPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/order-management/view" element={<OrderMangement />} />
          <Route path="/order-management/add" element={<AddOrder />} />
          <Route path="/attendence/attendence-record" element={<MarkAttendence />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin_profile" element={<AdminProfile />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
