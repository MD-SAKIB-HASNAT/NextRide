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
import AdminPaymentHistory from "./Admin/Pages/AdminPaymentHistory";
import AdminBikePosts from "./Admin/Pages/AdminBikePosts";
import AdminCarPosts from "./Admin/Pages/AdminCarPosts";
import AdminOrganizations from "./Admin/Pages/AdminOrganizations";
import SellVehicle from "./Feature/Page/SellVehicle/SellVehicle";
import MyListings from "./Feature/Page/Dashboard/MyListings";
import MyRentListings from "./Feature/Page/Dashboard/MyRentListings";
import PendingPayments from "./Feature/Page/Dashboard/PendingPayments";
import PendingUpdates from "./Feature/Page/Dashboard/PendingUpdates";
import PaymentHistory from "./Feature/Page/Dashboard/PaymentHistory";
import Analytics from "./Feature/Page/Dashboard/Analytics";
import EditProfile from "./Feature/Page/Dashboard/EditProfile";
import BuyCars from "./Feature/Page/BuyCars/BuyCars";
import BuyBikes from "./Feature/Page/BuyBikes/BuyBikes";
import SellerProfile from "./Feature/Page/SellerProfile/SellerProfile";
import Payment from "./Feature/Page/Payment/Payment";
import PaymentSuccess from "./Feature/Page/Payment/PaymentSuccess";
import PaymentFail from "./Feature/Page/Payment/PaymentFail";
import PaymentCancel from "./Feature/Page/Payment/PaymentCancel";
import VehicleDetails from "./Public/Pages/VehicleDetails/VehicleDetails";
import AdminVehicleUpdateRequests from "./Admin/Pages/AdminVehicleUpdateRequests";
import Subscription from "./Feature/Page/Subscription/Subscription";
import About from "./Feature/Page/About/About";
import RentVehicles from "./Feature/Page/RentVehicles/RentVehicles";
import AddRentVehicle from "./Feature/Page/RentVehicles/AddRentVehicle";
import AdminRentVehicles from "./Admin/Pages/AdminRentVehicles";
import RentVehicleDetails from "./Public/Pages/RentVehicles/RentVehicleDetails";
import OrganizationDetails from "./Public/Pages/Organizations/OrganizationDetails";
import OrganizationList from "./Feature/Page/Organizations/OrganizationList";



export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminDashboard />}> 
          <Route index element={<AdminOverview />} />
          <Route path="bike-posts" element={<AdminBikePosts />} />
          <Route path="car-posts" element={<AdminCarPosts />} />
          <Route path="organizations" element={<AdminOrganizations />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="rent-vehicles" element={<AdminRentVehicles />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="payment-history" element={<AdminPaymentHistory />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="vehicle-update-requests" element={<AdminVehicleUpdateRequests />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/my-rent-listings" element={<MyRentListings />} />
          <Route path="/pending-payments" element={<PendingPayments />} />
          <Route path="/pending-updates" element={<PendingUpdates />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/sell" element={<SellVehicle />} />
          <Route path="/sell/:id" element={<SellVehicle />} />
          <Route path="/cars" element={<BuyCars />} />
          <Route path="/bikes" element={<BuyBikes />} />
          <Route path="/subscriptions" element={<Subscription />} />
          <Route path="/about" element={<About />} />
          <Route path="/rent/add" element={<AddRentVehicle />} />
          <Route path="/rent" element={<RentVehicles />} />
          <Route path="/rent/vehicle/:id" element={<RentVehicleDetails />} />
          <Route path="/organizations" element={<OrganizationList />} />
          <Route path="/organizations/:id" element={<OrganizationDetails />} />
          <Route path="/vehicles/:id" element={<VehicleDetails />} />
          <Route path="/seller/:sellerId" element={<SellerProfile />} />
          <Route path="/payment/:id" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/fail" element={<PaymentFail />} />
          <Route path="/payment/cancel" element={<PaymentCancel />} />
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
