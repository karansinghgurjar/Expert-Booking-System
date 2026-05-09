import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import { useState } from "react";

const emailPattern = /^\S+@\S+\.\S+$/;

function MyBookingsPage() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  function validateEmail() {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return "Email is required.";
    }

    if (!emailPattern.test(trimmedEmail)) {
      return "Please enter a valid email address.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateEmail();

    if (validationError) {
      setError(validationError);
      setBookings([]);
      setSearched(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await apiClient.get(
        `/bookings?email=${encodeURIComponent(email.trim())}`,
      );

      setBookings(response.data.data || []);
      setSearched(true);
    } catch (apiError) {
      setBookings([]);
      setSearched(true);
      setError(
        apiError.response?.data?.message ||
          "Unable to fetch bookings. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="page-section bookings-page">
      <Link className="back-link" to="/">
        Back to Experts
      </Link>

      <div className="page-header">
        <div>
          <h1>My Bookings</h1>
          <p className="page-intro">
            Search with the email you used while booking to view your sessions.
          </p>
        </div>
      </div>

      <form className="card booking-search-form" onSubmit={handleSubmit}>
        <label className="form-field" htmlFor="booking-email">
          <span>Email</span>
          <input
            id="booking-email"
            inputMode="email"
            name="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="aman@example.com"
            type="text"
            value={email}
          />
        </label>

        <button disabled={loading} type="submit">
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {loading ? <Loading message="Fetching your bookings..." /> : null}

      {error ? <ErrorMessage message={error} /> : null}

      {!loading && searched && bookings.length === 0 && !error ? (
        <div className="empty-state">
          <h2>No bookings found</h2>
          <p>No bookings are linked to this email address yet.</p>
        </div>
      ) : null}

      {!loading && bookings.length > 0 ? (
        <div className="booking-card-list">
          {bookings.map((booking) => (
            <article className="card booking-card" key={booking._id}>
              <div className="booking-card-header">
                <div>
                  <p className="eyebrow">Expert</p>
                  <h2>{booking.expertName}</h2>
                </div>
                <span
                  className={`status-badge status-${booking.status.toLowerCase()}`}
                >
                  {booking.status}
                </span>
              </div>

              <dl className="booking-details">
                <div>
                  <dt>User</dt>
                  <dd>{booking.name}</dd>
                </div>
                <div>
                  <dt>Email</dt>
                  <dd>{booking.email}</dd>
                </div>
                <div>
                  <dt>Phone</dt>
                  <dd>{booking.phone}</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>{booking.date}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{booking.time}</dd>
                </div>
                <div className="full-width">
                  <dt>Notes</dt>
                  <dd>{booking.notes || "No notes added."}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export default MyBookingsPage;
