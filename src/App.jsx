import { useState } from 'react';
import './App.css'
import { AdminLayout } from './layout/AdminLayout'
import { POSLayout } from './layout/POSLayout'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './layout/Login';
import { AdminRoute, StaffRoute } from './components/ProtectedRoute';
import { Dashboard } from './page/admin/Dashboard';
import { Staff } from './page/admin/Staff';
import { User } from './page/admin/User';
import { Menu } from './page/admin/Menu';
import { Order } from './page/admin/Order';
import { Table } from './page/admin/Table';
import { AuthProvider } from './context/AuthContext';
import { POSPage } from './page/pos/POSPage';
import { POSOrdersPage } from './page/pos/POSOrdersPage';
import { SchedulePage } from './page/admin/SchedulePage';
import { SalaryPage } from './page/admin/SalaryPage';


function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />

          <Route path='admin/*' element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path='staff' element={<Staff />} />
            <Route path='schedule' element={<SchedulePage />} />
            <Route path='salary' element={<SalaryPage />} />
            <Route path='user' element={<User />} />
            <Route path='menu' element={<Menu />} />
            <Route path='order' element={<Order />} />
            <Route path='table' element={<Table />} />
          </Route>

          <Route path='/pos/*' element={
            <StaffRoute>
              <POSLayout />
            </StaffRoute>
          }>
            <Route index element={<POSPage />} />
            <Route path='orders' element={<POSOrdersPage />} />
          </Route>

          <Route path='/' element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
