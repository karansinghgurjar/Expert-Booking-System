import { useParams } from "react-router-dom";

function ExpertDetailPage() {
  const { id } = useParams();

  return (
    <section className="page-section">
      <h1>Expert Detail</h1>
      <p className="page-intro">Expert detail page placeholder for {id}</p>
    </section>
  );
}

export default ExpertDetailPage;
