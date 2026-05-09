import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  date: "",
  time: "",
  notes: "",
};

const emailRegex = /^\S+@\S+\.\S+$/;
const phoneRegex = /^\d{10}$/;

function BookingPage() {
  const { expertId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedDate = searchParams.get("date") || "";
  const selectedTime = searchParams.get("time") || "";

  const [expert, setExpert] = useState(null);
  const [formData, setFormData] = useState({
    ...initialFormState,
    date: selectedDate,
    time: selectedTime,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    setFormData((currentData) => ({
      ...currentData,
      date: selectedDate,
      time: selectedTime,
    }));
  }, [selectedDate, selectedTime]);

  useEffect(() => {
    let isActive = true;

    const fetchExpert = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.get(`/experts/${expertId}`);

        if (!isActive) return;

        setExpert(response.data.data);
      } catch (err) {
        if (!isActive) return;

        setExpert(null);
        setError(
          err.response?.data?.message ||
            "Unable to load expert details. Please try again."
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchExpert();

    return () => {
      isActive = false;
    };
  }, [expertId]);

  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedDate = formData.date.trim();
    const trimmedTime = formData.time.trim();

    if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!trimmedEmail) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = "Please enter a valid email";
    }

    if (!trimmedPhone) {
      errors.phone = "Phone is required";
    } else if (!phoneRegex.test(trimmedPhone)) {
      errors.phone = "Phone must be exactly 10 digits";
    }

    if (!trimmedDate) {
      errors.date = "Date is required";
    }

    if (!trimmedTime) {
      errors.time = "Time is required";
    }

    if (formData.notes.length > 500) {
      errors.notes = "Notes cannot exceed 500 characters";
    }

    return errors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting || success) return;

    const errors = validateForm();
    setFieldErrors(errors);
    setError("");

    if (Object.keys(errors).length > 0) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await apiClient.post("/bookings", {
        expertId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        date: formData.date.trim(),
        time: formData.time.trim(),
        notes: formData.notes.trim(),
      });

      setSuccess(response.data);
      setFormData((currentData) => ({
        ...currentData,
        name: "",
        phone: "",
        notes: "",
      }));
    } catch (err) {
      if (err.response?.status === 409) {
        setError("This slot is already booked. Please choose another slot.");
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to create booking. Please try again."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  const dateReadOnly = Boolean(selectedDate);
  const timeReadOnly = Boolean(selectedTime);

  return (
    <section className="page-section booking-page">
      <Link className="back-link" to={`/experts/${expertId}`}>
        Back to Expert Details
      </Link>

      {loading && <Loading message="Loading booking details..." />}
      <ErrorMessage message={error} />

      {!loading && expert && (
        <>
          <div className="booking-layout">
            <aside className="card booking-summary">
              <p className="eyebrow">{expert.category}</p>
              <h1>{expert.name}</h1>
              <dl className="summary-list">
                <div>
                  <dt>Price</dt>
                  <dd>Rs. {expert.price}</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>{formData.date || "Not selected"}</dd>
                </div>
                <div>
                  <dt>Time</dt>
                  <dd>{formData.time || "Not selected"}</dd>
                </div>
              </dl>
            </aside>

            <form className="card booking-form" onSubmit={handleSubmit} noValidate>
              <div>
                <h2>Book Session</h2>
                <p className="page-intro">
                  Enter your details to reserve this expert session.
                </p>
              </div>

              {success && (
                <div className="success-message" role="status">
                  <h3>{success.message}</h3>
                  <p>Status: {success.data.status}</p>
                  <div className="success-actions">
                    <Link className="button" to="/my-bookings">
                      My Bookings
                    </Link>
                    <Link className="button secondary" to={`/experts/${expertId}`}>
                      Expert Details
                    </Link>
                  </div>
                </div>
              )}

              <div className="form-grid two-column">
                <label className="form-field">
                  <span>Name</span>
                  <input
                    name="name"
                    onChange={handleChange}
                    placeholder="Aman Verma"
                    value={formData.name}
                  />
                  {fieldErrors.name && (
                    <span className="field-error">{fieldErrors.name}</span>
                  )}
                </label>

                <label className="form-field">
                  <span>Email</span>
                  <input
                    autoComplete="email"
                    inputMode="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="aman@example.com"
                    value={formData.email}
                  />
                  {fieldErrors.email && (
                    <span className="field-error">{fieldErrors.email}</span>
                  )}
                </label>

                <label className="form-field">
                  <span>Phone</span>
                  <input
                    name="phone"
                    onChange={handleChange}
                    placeholder="9876543210"
                    value={formData.phone}
                  />
                  {fieldErrors.phone && (
                    <span className="field-error">{fieldErrors.phone}</span>
                  )}
                </label>

                <label className="form-field">
                  <span>Date</span>
                  <input
                    name="date"
                    onChange={handleChange}
                    readOnly={dateReadOnly}
                    value={formData.date}
                  />
                  {fieldErrors.date && (
                    <span className="field-error">{fieldErrors.date}</span>
                  )}
                </label>

                <label className="form-field">
                  <span>Time</span>
                  <input
                    name="time"
                    onChange={handleChange}
                    readOnly={timeReadOnly}
                    value={formData.time}
                  />
                  {fieldErrors.time && (
                    <span className="field-error">{fieldErrors.time}</span>
                  )}
                </label>

                <label className="form-field full-width">
                  <span>Notes</span>
                  <textarea
                    maxLength="520"
                    name="notes"
                    onChange={handleChange}
                    placeholder="Share anything that helps the expert prepare."
                    rows="5"
                    value={formData.notes}
                  />
                  <span className="field-hint">{formData.notes.length}/500</span>
                  {fieldErrors.notes && (
                    <span className="field-error">{fieldErrors.notes}</span>
                  )}
                </label>
              </div>

              <button disabled={submitting || Boolean(success)} type="submit">
                {submitting ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>
        </>
      )}
    </section>
  );
}

export default BookingPage;
