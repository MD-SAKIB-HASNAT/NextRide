import React from "react";
import MainLayout from "./Layout/MainLayout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Feature/Page/home/container/Home";
import AuthLayout from "./Layout/AuthLayout";
import Login from "./Auth/Page/Login";
import Register from "./Auth/Page/Register";
import ForgotPassword from "./Auth/Page/ForgotPassword";
import Dashboard from "./Feature/Page/Dashboard/Dashboard";
import SellVehicle from "./Feature/Page/SellVehicle/SellVehicle";
import MyListings from "./Feature/Page/Dashboard/MyListings";
import PendingPayments from "./Feature/Page/Dashboard/PendingPayments";
import EditProfile from "./Feature/Page/Dashboard/EditProfile";
import BuyCars from "./Feature/Page/BuyCars/BuyCars";
import BuyBikes from "./Feature/Page/BuyBikes/BuyBikes";
import VehicleDetails from "./Feature/Page/VehicleDetails/VehicleDetails";
import SellerProfile from "./Feature/Page/SellerProfile/SellerProfile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/pending-payments" element={<PendingPayments />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/sell" element={<SellVehicle />} />
          <Route path="/cars" element={<BuyCars />} />
          <Route path="/bikes" element={<BuyBikes />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/seller/:sellerId" element={<SellerProfile />} />
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
