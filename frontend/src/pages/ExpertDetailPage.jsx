import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../api/apiClient";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";
import socket from "../socket/socketClient";

function ExpertDetailPage() {
  const { id } = useParams();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchExpert = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.get(`/experts/${id}`);

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
  }, [id]);

  useEffect(() => {
    if (!id) return undefined;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinExpertRoom", { expertId: id });

    const handleSlotBooked = (payload) => {
      if (payload.expertId !== id) return;

      setExpert((currentExpert) => {
        if (!currentExpert) return currentExpert;

        return {
          ...currentExpert,
          availableSlots: currentExpert.availableSlots.map((slot) =>
            slot.date === payload.date && slot.time === payload.time
              ? { ...slot, isBooked: true }
              : slot
          ),
        };
      });
    };

    socket.on("slotBooked", handleSlotBooked);

    return () => {
      socket.off("slotBooked", handleSlotBooked);
    };
  }, [id]);

  const groupedSlots = useMemo(() => {
    if (!expert?.availableSlots?.length) return [];

    const groups = expert.availableSlots.reduce((acc, slot) => {
      if (!acc[slot.date]) {
        acc[slot.date] = [];
      }

      acc[slot.date].push(slot);
      return acc;
    }, {});

    return Object.entries(groups).sort(([dateA], [dateB]) =>
      dateA.localeCompare(dateB)
    );
  }, [expert]);

  return (
    <section className="page-section expert-detail-page">
      <Link className="back-link" to="/">
        Back to Experts
      </Link>

      {loading && <Loading message="Loading expert details..." />}
      <ErrorMessage message={error} />

      {!loading && !error && expert && (
        <>
          <div className="expert-detail-hero">
            <div>
              <p className="eyebrow">{expert.category}</p>
              <h1>{expert.name}</h1>
              <p className="page-intro">{expert.bio}</p>
            </div>

            <dl className="detail-stats card">
              <div>
                <dt>Experience</dt>
                <dd>{expert.experience} years</dd>
              </div>
              <div>
                <dt>Rating</dt>
                <dd>{expert.rating.toFixed(1)}</dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>Rs. {expert.price}</dd>
              </div>
            </dl>
          </div>

          <div className="slots-section">
            <div>
              <h2>Available Slots</h2>
              <p className="page-intro">
                Choose an available time to continue to the booking form.
              </p>
            </div>

            {groupedSlots.length === 0 ? (
              <div className="empty-state">
                <h2>No slots available</h2>
                <p>This expert has not published any slots yet.</p>
              </div>
            ) : (
              <div className="slot-groups">
                {groupedSlots.map(([date, slots]) => (
                  <section className="slot-group card" key={date}>
                    <h3>{date}</h3>
                    <div className="slot-list">
                      {slots.map((slot) =>
                        slot.isBooked ? (
                          <button
                            className="slot-button booked"
                            disabled
                            key={slot._id}
                            type="button"
                          >
                            {slot.time} Booked
                          </button>
                        ) : (
                          <Link
                            className="slot-button available"
                            key={slot._id}
                            to={`/book/${expert._id}?date=${slot.date}&time=${encodeURIComponent(
                              slot.time
                            )}`}
                          >
                            {slot.time} Available
                          </Link>
                        )
                      )}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

export default ExpertDetailPage;
