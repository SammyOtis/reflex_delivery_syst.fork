import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const RiderDashboard = () => {
  const { user, logout } = useAuth();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [proof, setProof] = useState({});

  /*
   * Get rider's assigned deliveries
   */
  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/deliveries/assigned");

      const data = response.data.data || response.data;

      setDeliveries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load your assigned deliveries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  /*
   * Update proof input
   */
  const handleProofChange = (deliveryId, value) => {
    setProof({
      ...proof,
      [deliveryId]: value,
    });
  };

  /*
   * Update delivery status
   */
  const updateStatus = async (deliveryId, status) => {
    setUpdating(true);
    setError("");
    setMessage("");

    try {
      const requestData = {
        status,
      };

      /*
       * Proof is required when marking
       * a delivery as Delivered.
       */
      if (status === "Delivered") {
        const deliveryProof = proof[deliveryId];

        if (!deliveryProof || !deliveryProof.trim()) {
          setError(
            "Please provide proof of delivery before marking the delivery as Delivered."
          );

          setUpdating(false);
          return;
        }

        requestData.proofOfDelivery = deliveryProof;
      }

      await api.patch(
        `/deliveries/${deliveryId}/status`,
        requestData
      );

      setMessage(
        status === "Picked Up"
          ? "Delivery marked as picked up."
          : "Delivery marked as delivered."
      );

      await fetchDeliveries();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to update delivery status."
      );
    } finally {
      setUpdating(false);
    }
  };

  /*
   * Count deliveries
   */
  const assignedCount = deliveries.filter(
    (delivery) => delivery.status === "Assigned"
  ).length;

  const pickedUpCount = deliveries.filter(
    (delivery) => delivery.status === "Picked Up"
  ).length;

  const deliveredCount = deliveries.filter(
    (delivery) => delivery.status === "Delivered"
  ).length;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          Reflex Delivery
        </div>

        <div className="user-info">
          <span>Rider</span>

          <strong>
            {user?.name || "Rider"}
          </strong>
        </div>

        <nav>

          <a href="#overview">
            Overview
          </a>

          <a href="#assigned-deliveries">
            Assigned Deliveries
          </a>

        </nav>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}

      <main className="dashboard-content">

        <header className="dashboard-header">

          <div>

            <h1>
              Rider Dashboard
            </h1>

            <p>
              View and manage your assigned deliveries.
            </p>

          </div>

        </header>

        {/* MESSAGES */}

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {/* OVERVIEW */}

        <section id="overview">

          <h2>
            Overview
          </h2>

          <div className="stats-grid">

            <div className="stat-card">

              <span>
                Assigned
              </span>

              <strong>
                {assignedCount}
              </strong>

            </div>

            <div className="stat-card">

              <span>
                Picked Up
              </span>

              <strong>
                {pickedUpCount}
              </strong>

            </div>

            <div className="stat-card">

              <span>
                Delivered
              </span>

              <strong>
                {deliveredCount}
              </strong>

            </div>

            <div className="stat-card">

              <span>
                Total
              </span>

              <strong>
                {deliveries.length}
              </strong>

            </div>

          </div>

        </section>

        {/* ASSIGNED DELIVERIES */}

        <section
          id="assigned-deliveries"
          className="dashboard-section"
        >

          <div className="section-heading">

            <div>

              <h2>
                Assigned Deliveries
              </h2>

              <p className="section-description">
                Manage deliveries assigned to you.
              </p>

            </div>

            <button
              className="refresh-btn"
              onClick={fetchDeliveries}
            >
              Refresh
            </button>

          </div>

          {loading ? (

            <div className="loading">
              Loading assigned deliveries...
            </div>

          ) : deliveries.length === 0 ? (

            <div className="empty-state">

              <h3>
                No assigned deliveries
              </h3>

              <p>
                Deliveries assigned to you will appear here.
              </p>

            </div>

          ) : (

            <div className="delivery-list">

              {deliveries.map((delivery) => {

                const deliveryId =
                  delivery._id || delivery.id;

                const status =
                  delivery.status || "Assigned";

                return (

                  <div
                    className="rider-delivery-card"
                    key={deliveryId}
                  >

                    {/* HEADER */}

                    <div className="delivery-card-header">

                      <div>

                        <h3>
                          {delivery.productCategory ||
                            "Electronics Delivery"}
                        </h3>

                        <span className="delivery-id">
                          Delivery ID: {deliveryId}
                        </span>

                      </div>

                      <span
                        className={`status ${
                          status
                            .toLowerCase()
                            .replace(" ", "-")
                        }`}
                      >
                        {status}
                      </span>

                    </div>

                    {/* DETAILS */}

                    <div className="delivery-details">

                      <div>

                        <span>
                          Customer
                        </span>

                        <strong>
                          {delivery.customerName || "—"}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Phone
                        </span>

                        <strong>
                          {delivery.customerPhone || "—"}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Address
                        </span>

                        <strong>
                          {delivery.deliveryAddress || "—"}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Product
                        </span>

                        <strong>
                          {delivery.productDescription || delivery.itemDescription || "—"}
                        </strong>

                      </div>

                    </div>

                    {/* ACTIONS */}

                    <div className="rider-actions">

                      {status === "Assigned" && (

                        <button
                          className="action-btn pickup-btn"
                          disabled={updating}
                          onClick={() =>
                            updateStatus(
                              deliveryId,
                              "Picked Up"
                            )
                          }
                        >
                          {updating
                            ? "Updating..."
                            : "Mark Picked Up"}
                        </button>

                      )}

                      {status === "Picked Up" && (

                        <div className="delivery-completion">

                          <label>
                            Proof of Delivery
                          </label>

                          <textarea
                            rows="3"
                            value={
                              proof[deliveryId] || ""
                            }
                            onChange={(e) =>
                              handleProofChange(
                                deliveryId,
                                e.target.value
                              )
                            }
                            placeholder="Enter proof of delivery, confirmation details, or proof reference"
                          />

                          <button
                            className="action-btn delivered-btn"
                            disabled={updating}
                            onClick={() =>
                              updateStatus(
                                deliveryId,
                                "Delivered"
                              )
                            }
                          >
                            {updating
                              ? "Updating..."
                              : "Mark Delivered"}
                          </button>

                        </div>

                      )}

                      {status === "Delivered" && (

                        <div className="completed-message">

                          <strong>
                            ✓ Delivery Completed
                          </strong>

                          <span>
                            This delivery has been successfully delivered.
                          </span>

                        </div>

                      )}

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default RiderDashboard;