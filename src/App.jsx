import React from "react";
import MainLayout from "./Layout/MainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Feature/Page/home/container/Home";
import AuthLayout from "./Layout/AuthLayout";
import Login from "./Auth/Page/Login";
import Register from "./Auth/Page/Register";
import ForgotPassword from "./Auth/Page/ForgotPassword";
import Dashboard from "./Feature/Page/Dashboard/Dashboard";
import AdminDashboard from "./Admin/Dashboard/AdminDashboard";
import AdminOverview from "./Admin/Dashboard/AdminOverview";
import AdminSettings from "./Admin/Settings/AdminSettings";
import AdminUsers from "./Admin/Pages/AdminUsers";
import AdminAnalytics from "./Admin/Pages/AdminAnalytics";
import AdminBikePosts from "./Admin/Pages/AdminBikePosts";
import AdminCarPosts from "./Admin/Pages/AdminCarPosts";
import SellVehicle from "./Feature/Page/SellVehicle/SellVehicle";
import MyListings from "./Feature/Page/Dashboard/MyListings";
import PendingPayments from "./Feature/Page/Dashboard/PendingPayments";
import PendingUpdates from "./Feature/Page/Dashboard/PendingUpdates";
import Analytics from "./Feature/Page/Dashboard/Analytics";
import EditProfile from "./Feature/Page/Dashboard/EditProfile";
import BuyCars from "./Feature/Page/BuyCars/BuyCars";
import BuyBikes from "./Feature/Page/BuyBikes/BuyBikes";
import VehicleDetails from "./Feature/Page/VehicleDetails/VehicleDetails";
import SellerProfile from "./Feature/Page/SellerProfile/SellerProfile";
import Payment from "./Feature/Page/Payment/Payment";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />}> 
          <Route index element={<AdminOverview />} />
          <Route path="bike-posts" element={<AdminBikePosts />} />
          <Route path="car-posts" element={<AdminCarPosts />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/pending-payments" element={<PendingPayments />} />
          <Route path="/pending-updates" element={<PendingUpdates />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/sell" element={<SellVehicle />} />
          <Route path="/sell/:id" element={<SellVehicle />} />
          <Route path="/cars" element={<BuyCars />} />
          <Route path="/bikes" element={<BuyBikes />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/seller/:sellerId" element={<SellerProfile />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route element={<AuthLayout/>}>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
