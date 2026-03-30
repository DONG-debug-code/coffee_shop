import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom";


export const AdminRoute = ({ children}) => {
    const {user, role, loading} = useAuth();
    if(loading) return <div>Loading...</div>
    if(!user || role !== "admin") return <Navigate to="/login"/>
    return children; 
}

export const StaffRoute = ({children}) => {
    const{ user, role, loading } = useAuth();
    if(loading) return <div>Loading...</div>
    if(!user || role !== "staff") return <Navigate to="/login"/>
    return children;
}