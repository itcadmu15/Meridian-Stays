import { Navigate, Route, Routes } from "react-router-dom";
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerBookingsPage from "./pages/OwnerBookingsPage";
import OwnerReportsPage from "./pages/OwnerReportsPage";
import StaffDashboard from "./pages/StaffDashboard";
import StaffTurnoversPage from "./pages/staff/StaffTurnoversPage";
import StaffCleaningPage from "./pages/staff/StaffCleaningPage";
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
import AssistantPage from "./pages/guests/AssistantPage";
import GuestsPage from "./pages/guests/GuestsPage";
import GuestDetailsPage from "./pages/guests/GuestDetailsPage";
import OwnerAccountPage from "./pages/OwnerAccountPage";

function App() {
  return (
    <Routes>
      {/* Simple separate login experiences (no roles / no RBAC) */}
      <Route path="/" element={<Navigate to="/owner/login" replace />} />
      <Route path="/login" element={<Login key="owner" area="owner" />} />
      <Route path="/owner/login" element={<Login key="owner" area="owner" />} />
      <Route path="/guest/login" element={<Login key="guest" area="guest" />} />
      <Route path="/signup" element={<Signup />} />

      {/* ================= OWNER AREA ================= */}
      <Route element={<AuthenticatedLayout area="owner" />}>
        <Route path="/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner/account" element={<OwnerAccountPage />} />
        <Route path="/unit-listings" element={<UnitListingsPage />} />
        <Route path="/unit-listings/new" element={<AddUnitPage />} />
        <Route path="/unit-listings/:unitId" element={<UnitDetailsPage />} />
        <Route path="/unit-listings/:unitId/edit" element={<EditUnitPage />} />
        <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
        <Route path="/owner/reports" element={<OwnerReportsPage />} />
        <Route path="/guests" element={<GuestsPage />} />
        <Route path="/guests/:guestId" element={<GuestDetailsPage />} />
      </Route>

      {/* ================= STAFF / OPERATIONS AREA ================= */}
      <Route element={<AuthenticatedLayout area="staff" />}>
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/turnovers" element={<StaffTurnoversPage />} />
        <Route path="/staff/cleaning" element={<StaffCleaningPage />} />
      </Route>

      {/* ================= GUEST AREA ================= */}
      <Route element={<AuthenticatedLayout area="guest" />}>
        <Route path="/guest" element={<GuestHomePage />} />
        <Route path="/guest/unit-listings/:unitId" element={<GuestUnitDetailsPage />} />
        <Route path="/guest/book/:unitId" element={<GuestBookingPage />} />
        <Route path="/guest/booking-confirmation" element={<BookingConfirmationPage />} />
        <Route path="/guest/bookings" element={<GuestBookingsPage />} />
        <Route path="/guest/profile" element={<GuestProfilePage />} />
        <Route path="/guest/assistant" element={<AssistantPage />} />
        <Route path="/guest/assistant/:unitId" element={<AssistantPage />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/owner/login" replace />} />
    </Routes>
  );
}

export default App;
