import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const DispatcherDashboard = () => {
  const { user, logout } = useAuth();

  const [deliveries, setDeliveries] = useState([]);
  const [riders, setRiders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const [selectedRiders, setSelectedRiders] = useState({});

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
    Load requested deliveries
  */
  const fetchDeliveries = async () => {
    try {
      const response = await api.get("/deliveries");

      const data = response.data.data || response.data;

      setDeliveries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load requested deliveries."
      );
    }
  };

  /*
    Load available riders
  */
  const fetchRiders = async () => {
    try {
      const response = await api.get("/deliveries/riders");

      const data = response.data.data || response.data;

      setRiders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load riders."
      );
    }
  };

  /*
    Load dashboard data
  */
  const loadDashboard = async () => {
    setLoading(true);
    setError("");

    await Promise.all([
      fetchDeliveries(),
      fetchRiders(),
    ]);

    setLoading(false);
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  /*
    Select rider for a delivery
  */
  const handleRiderChange = (deliveryId, riderId) => {
    setSelectedRiders({
      ...selectedRiders,
      [deliveryId]: riderId,
    });
  };

  /*
    Assign rider
  */
  const handleAssignRider = async (deliveryId) => {
    const riderId = selectedRiders[deliveryId];

    if (!riderId) {
      setError("Please select a rider first.");
      return;
    }

    setAssigning(true);
    setError("");
    setMessage("");

    try {
      await api.patch(
        `/deliveries/${deliveryId}/assign`,
        {
          riderId,
        }
      );

      setMessage("Rider assigned successfully.");

      await fetchDeliveries();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to assign rider."
      );
    } finally {
      setAssigning(false);
    }
  };

  /*
    Statistics
  */
  const requestedCount = deliveries.length;

  const availableRiders = riders.length;

  return (
    <div className="dashboard">

      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="brand">
          Reflex Delivery
        </div>

        <div className="user-info">

          <span>
            Dispatcher
          </span>

          <strong>
            {user?.name || "Dispatcher"}
          </strong>

        </div>

        <nav>

          <a href="#overview">
            Overview
          </a>

          <a href="#requested-deliveries">
            Requested Deliveries
          </a>

          <a href="#available-riders">
            Available Riders
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
              Dispatcher Dashboard
            </h1>

            <p>
              Manage delivery requests and assign riders.
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
                Requested Deliveries
              </span>

              <strong>
                {requestedCount}
              </strong>

            </div>

            <div className="stat-card">

              <span>
                Available Riders
              </span>

              <strong>
                {availableRiders}
              </strong>

            </div>

            <div className="stat-card">

              <span>
                Assignments Pending
              </span>

              <strong>
                {requestedCount}
              </strong>

            </div>

            <div className="stat-card">

              <span>
                System Status
              </span>

              <strong className="online-status">
                Online
              </strong>

            </div>

          </div>

        </section>

        {/* REQUESTED DELIVERIES */}

        <section
          id="requested-deliveries"
          className="dashboard-section"
        >

          <div className="section-heading">

            <div>

              <h2>
                Requested Deliveries
              </h2>

              <p className="section-description">
                Review delivery requests and assign an available rider.
              </p>

            </div>

            <button
              className="refresh-btn"
              onClick={loadDashboard}
            >
              Refresh
            </button>

          </div>

          {loading ? (

            <div className="loading">
              Loading delivery requests...
            </div>

          ) : deliveries.length === 0 ? (

            <div className="empty-state">

              <h3>
                No requested deliveries
              </h3>

              <p>
                New retailer delivery requests will appear here.
              </p>

            </div>

          ) : (

            <div className="delivery-list">

              {deliveries.map((delivery) => {

                const deliveryId =
                  delivery._id || delivery.id;

                return (

                  <div
                    className="dispatcher-delivery-card"
                    key={deliveryId}
                  >

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

                      <span className="status requested">
                        {delivery.status || "Requested"}
                      </span>

                    </div>

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

                    {/* ASSIGN RIDER */}

                    <div className="assign-rider-area">

                      <label>
                        Assign Rider
                      </label>

                      <div className="assign-controls">

                        <select
                          value={
                            selectedRiders[deliveryId] || ""
                          }
                          onChange={(e) =>
                            handleRiderChange(
                              deliveryId,
                              e.target.value
                            )
                          }
                        >

                          <option value="">
                            Select a rider
                          </option>

                          {riders.map((rider) => (

                            <option
                              key={rider._id || rider.id}
                              value={rider._id || rider.id}
                            >
                              {rider.name ||
                                rider.fullName ||
                                rider.email}
                            </option>

                          ))}

                        </select>

                        <button
                          className="assign-btn"
                          disabled={assigning}
                          onClick={() =>
                            handleAssignRider(deliveryId)
                          }
                        >
                          {assigning
                            ? "Assigning..."
                            : "Assign Rider"}
                        </button>

                      </div>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>

        {/* AVAILABLE RIDERS */}

        <section
          id="available-riders"
          className="dashboard-section"
        >

          <h2>
            Available Riders
          </h2>

          <p className="section-description">
            Riders available for delivery assignments.
          </p>

          {riders.length === 0 ? (

            <div className="empty-state">

              <h3>
                No riders available
              </h3>

              <p>
                No rider accounts were returned by the backend.
              </p>

            </div>

          ) : (

            <div className="riders-grid">

              {riders.map((rider) => (

                <div
                  className="rider-card"
                  key={rider._id || rider.id}
                >

                  <div className="rider-avatar">
                    {(rider.name ||
                      rider.fullName ||
                      "R")[0].toUpperCase()}
                  </div>

                  <div className="rider-info">

                    <h3>
                      {rider.name ||
                        rider.fullName ||
                        "Rider"}
                    </h3>

                    <p>
                      {rider.email || "No email"}
                    </p>

                    <span className="rider-status">
                      Available
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>
  );
};

export default DispatcherDashboard;