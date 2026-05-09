import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import BookingPage from "./pages/BookingPage";
import ExpertDetailPage from "./pages/ExpertDetailPage";
import ExpertListPage from "./pages/ExpertListPage";
import MyBookingsPage from "./pages/MyBookingsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <header className="navbar">
          <div className="navbar-inner">
            <NavLink className="brand" to="/">
              Expert Booking
            </NavLink>
            <nav className="nav-links" aria-label="Primary navigation">
              <NavLink className="nav-link" to="/">
                Experts
              </NavLink>
              <NavLink className="nav-link" to="/my-bookings">
                My Bookings
              </NavLink>
            </nav>
          </div>
        </header>

        <main className="container">
          <Routes>
            <Route path="/" element={<ExpertListPage />} />
            <Route path="/experts/:id" element={<ExpertDetailPage />} />
            <Route path="/book/:expertId" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
