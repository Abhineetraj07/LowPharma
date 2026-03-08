import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

import Home from './pages/customer/Home';
import SearchResults from './pages/customer/SearchResults';
import MedicineDetail from './pages/customer/MedicineDetail';
import Cart from './pages/customer/Cart';
import PrescriptionUpload from './pages/customer/PrescriptionUpload';
import Checkout from './pages/customer/Checkout';
import ThankYou from './pages/customer/ThankYou';
import Profile from './pages/customer/Profile';
import AddAddress from './pages/customer/AddAddress';

import Inventory from './pages/pharmacist/Inventory';
import MedicineList from './pages/pharmacist/MedicineList';
import AddStock from './pages/pharmacist/AddStock';
import Prescriptions from './pages/pharmacist/Prescriptions';
import Orders from './pages/pharmacist/Orders';
import Dashboard from './pages/pharmacist/Dashboard';
import Transactions from './pages/pharmacist/Transactions';
import PharmacistProfile from './pages/pharmacist/PharmacistProfile';

function ProtectedLayout({ allowedRole }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/" />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ flex: 1 }}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={user ? <Navigate to={user.role === 'customer' ? '/home' : '/pharmacist/inventory'} /> : <Landing />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/signup/:role" element={<Signup />} />

      {/* Customer */}
      <Route element={<ProtectedLayout allowedRole="customer" />}>
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/medicine/:id" element={<MedicineDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/prescription" element={<PrescriptionUpload />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-address" element={<AddAddress />} />
      </Route>

      {/* Pharmacist */}
      <Route element={<ProtectedLayout allowedRole="pharmacist" />}>
        <Route path="/pharmacist/inventory" element={<Inventory />} />
        <Route path="/pharmacist/medicine-list" element={<MedicineList />} />
        <Route path="/pharmacist/add-stock" element={<AddStock />} />
        <Route path="/pharmacist/prescriptions" element={<Prescriptions />} />
        <Route path="/pharmacist/orders" element={<Orders />} />
        <Route path="/pharmacist/dashboard" element={<Dashboard />} />
        <Route path="/pharmacist/transactions" element={<Transactions />} />
        <Route path="/pharmacist/profile" element={<PharmacistProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
