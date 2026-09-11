import { Navigate, Route, Routes } from "react-router-dom";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OwnerDashboard from "./pages/OwnerDashboard";
import StaffDashboard from "./pages/StaffDashboard";
import UnitListingsPage from "./pages/unit-listings/UnitListings";
import AddUnitPage from "./pages/unit-listings/AddUnitPage";
import EditUnitPage from "./pages/unit-listings/EditUnitPage";
import UnitDetailsPage from "./pages/unit-listings/UnitDetailsPage";
import GuestHomePage from "./pages/guests/GuestHomePage";
import GuestUnitDetailsPage from "./pages/guests/GuestUnitDetailsPage";
import GuestBookingPage from "./pages/guests/GuestBookingPage";
import BookingConfirmationPage from "./pages/guests/BookingConfirmationPage";
import GuestBookingsPage from "./pages/guests/GuestBookingsPage";
import GuestProfilePage from "./pages/guests/GuestProfilePage";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<AuthenticatedLayout />}>
        <Route path="/" element={<Navigate to="/unit-listings" replace />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/unit-listings" element={<UnitListingsPage />} />
        <Route path="/unit-listings/new" element={<AddUnitPage />} />
        <Route path="/unit-listings/:unitId" element={<UnitDetailsPage />} />
        <Route path="/unit-listings/:unitId/edit" element={<EditUnitPage />} />
        <Route path="/guest" element={<GuestHomePage />} />
        <Route path="/guest/unit-listings/:unitId" element={<GuestUnitDetailsPage />} />
        <Route path="/guest/book/:unitId" element={<GuestBookingPage />} />
        <Route path="/guest/booking-confirmation" element={<BookingConfirmationPage />} />
        <Route path="/guest/bookings" element={<GuestBookingsPage />} />
        <Route path="/guest/profile" element={<GuestProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;