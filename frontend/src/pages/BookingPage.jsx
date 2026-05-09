import { useParams } from "react-router-dom";

function BookingPage() {
  const { expertId } = useParams();

  return (
    <section className="page-section">
      <h1>Book Session</h1>
      <p className="page-intro">Booking page placeholder for {expertId}</p>
    </section>
  );
}

export default BookingPage;
