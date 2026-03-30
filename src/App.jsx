import { useState } from 'react';
import './App.css'
import { AdminLayout } from './layout/AdminLayout'
import { POSLayout } from './layout/POSLayout'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './layout/Login';
import { AdminRoute, StaffRoute } from './components/ProtectedRoute';


function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login/>}/>

        <Route path='admin/*' element={
          <AdminRoute>
            <AdminLayout/>
          </AdminRoute>
        }/>

        <Route path='/pos/*' element={
          <StaffRoute>
            <POSLayout/>
          </StaffRoute>
        }/>

        <Route path='/' element={<Navigate to='/login' replace/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
