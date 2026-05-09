import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";
import ErrorMessage from "../components/ErrorMessage";
import Loading from "../components/Loading";

const categories = [
  "All",
  "Career Coach",
  "Software Engineering",
  "Finance",
  "Design",
  "Marketing",
];

function ExpertListPage() {
  const [experts, setExperts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchExperts = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await apiClient.get("/experts", {
          params: {
            page,
            limit: 6,
            search: search.trim(),
            category,
          },
        });

        if (!isActive) return;

        setExperts(response.data.data || []);
        setPagination(response.data.pagination || null);
      } catch (err) {
        if (!isActive) return;

        setExperts([]);
        setPagination(null);
        setError(
          err.response?.data?.message ||
            "Unable to load experts. Please try again."
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchExperts();

    return () => {
      isActive = false;
    };
  }, [page, search, category]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setPage(1);
  };

  const totalPages = pagination?.totalPages || 1;

  return (
    <section className="page-section expert-list-page">
      <div className="page-header">
        <div>
          <h1>Find an Expert</h1>
          <p className="page-intro">
            Browse mentors by category, compare experience, and choose the right
            session for your goals.
          </p>
        </div>
      </div>

      <div className="filters-bar" aria-label="Expert filters">
        <label className="filter-field">
          <span>Search by name</span>
          <input
            type="search"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search experts"
          />
        </label>

        <label className="filter-field">
          <span>Category</span>
          <select value={category} onChange={handleCategoryChange}>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading && <Loading message="Loading experts..." />}
      <ErrorMessage message={error} />

      {!loading && !error && experts.length === 0 && (
        <div className="empty-state">
          <h2>No experts found</h2>
          <p>Try a different search term or category.</p>
        </div>
      )}

      {!error && experts.length > 0 && (
        <>
          <div className="expert-grid">
            {experts.map((expert) => (
              <article className="card expert-card" key={expert._id}>
                <div className="expert-card-header">
                  <div>
                    <h2>{expert.name}</h2>
                    <p>{expert.category}</p>
                  </div>
                  <span className="rating-badge">{expert.rating.toFixed(1)}</span>
                </div>

                <dl className="expert-meta">
                  <div>
                    <dt>Experience</dt>
                    <dd>{expert.experience} years</dd>
                  </div>
                  <div>
                    <dt>Price</dt>
                    <dd>Rs. {expert.price}</dd>
                  </div>
                </dl>

                <Link className="button view-details-button" to={`/experts/${expert._id}`}>
                  View Details
                </Link>
              </article>
            ))}
          </div>

          <div className="pagination-bar">
            <button
              type="button"
              onClick={() => setPage((currentPage) => Math.max(currentPage - 1, 1))}
              disabled={page <= 1 || loading}
            >
              Previous
            </button>
            <span>
              Page {pagination?.page || page} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setPage((currentPage) => Math.min(currentPage + 1, totalPages))
              }
              disabled={page >= totalPages || loading}
            >
              Next
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default ExpertListPage;
