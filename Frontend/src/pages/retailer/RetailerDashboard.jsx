import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const categories = [
  "Refrigerator",
  "Television",
  "Sound Bar",
  "Laptop",
  "Other Electronics",
];

const RetailerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    deliveryAddress: "",
    productCategory: "",
    productDescription: "",
    notes: "",
  });

  const fetchDeliveries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/deliveries");

      const data = response.data.data || response.data;

      setDeliveries(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to load your deliveries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitting(true);
    setError("");
    setMessage("");

    try {
      const payload = {
        ...formData,
        itemDescription: formData.productDescription,
      };

      await api.post("/deliveries", payload);

      setMessage("Delivery request created successfully.");

      setFormData({
        customerName: "",
        customerPhone: "",
        deliveryAddress: "",
        productCategory: "",
        productDescription: "",
        notes: "",
      });

      await fetchDeliveries();

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Unable to create delivery request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Requested":
        return "status requested";

      case "Assigned":
        return "status assigned";

      case "Picked Up":
        return "status picked-up";

      case "Delivered":
        return "status delivered";

      default:
        return "status";
    }
  };

  const totalDeliveries = deliveries.length;

  const requested = deliveries.filter(
    (delivery) => delivery.status === "Requested"
  ).length;

  const inTransit = deliveries.filter(
    (delivery) =>
      delivery.status === "Assigned" ||
      delivery.status === "Picked Up"
  ).length;

  const delivered = deliveries.filter(
    (delivery) => delivery.status === "Delivered"
  ).length;

  return (
    <div className="dashboard">

      {/* Sidebar */}
      <aside className="sidebar">

        <div className="brand">
          Reflex Delivery
        </div>

        <div className="user-info">
          <span>Retailer</span>
          <strong>{user?.name || "Retailer"}</strong>
        </div>

        <nav>
          <a href="#overview">Overview</a>
          <a href="#create-delivery">Create Delivery</a>
          <a href="#my-deliveries">My Deliveries</a>
        </nav>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      {/* Main Content */}
      <main className="dashboard-content">

        <header className="dashboard-header">
          <div>
            <h1>Retailer Dashboard</h1>
            <p>
              Manage your electronics delivery requests
            </p>
          </div>
        </header>

        {/* Messages */}

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

        {/* Overview */}

        <section id="overview">

          <h2>Overview</h2>

          <div className="stats-grid">

            <div className="stat-card">
              <span>Total Deliveries</span>
              <strong>{totalDeliveries}</strong>
            </div>

            <div className="stat-card">
              <span>Requested</span>
              <strong>{requested}</strong>
            </div>

            <div className="stat-card">
              <span>In Transit</span>
              <strong>{inTransit}</strong>
            </div>

            <div className="stat-card">
              <span>Delivered</span>
              <strong>{delivered}</strong>
            </div>

          </div>

        </section>

        {/* Create Delivery */}

        <section
          id="create-delivery"
          className="dashboard-section"
        >

          <h2>Create Delivery Request</h2>

          <p className="section-description">
            Enter the customer and electronics delivery details.
          </p>

          <form
            className="delivery-form"
            onSubmit={handleSubmit}
          >

            <div className="form-section">

              <h3>Customer Information</h3>

              <div className="form-grid">

                <div className="form-field">

                  <label>
                    Customer Name
                  </label>

                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    placeholder="Enter customer name"
                    required
                  />

                </div>

                <div className="form-field">

                  <label>
                    Customer Phone
                  </label>

                  <input
                    type="tel"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleChange}
                    placeholder="e.g. 0712345678"
                    required
                  />

                </div>

              </div>

              <div className="form-field">

                <label>
                  Delivery Address
                </label>

                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Enter complete delivery address"
                  rows="3"
                  required
                />

              </div>

            </div>

            <div className="form-section">

              <h3>Product Information</h3>

              <div className="form-grid">

                <div className="form-field">

                  <label>
                    Product Category
                  </label>

                  <select
                    name="productCategory"
                    value={formData.productCategory}
                    onChange={handleChange}
                    required
                  >

                    <option value="">
                      Select product
                    </option>

                    {categories.map((category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    ))}

                  </select>

                </div>

                <div className="form-field">

                  <label>
                    Product Description
                  </label>

                  <input
                    type="text"
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleChange}
                    placeholder="e.g. Samsung 55 inch TV"
                    required
                  />

                </div>

              </div>

              <div className="form-field">

                <label>
                  Additional Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Optional delivery instructions"
                  rows="3"
                />

              </div>

            </div>

            <button
              type="submit"
              className="submit-delivery-btn"
              disabled={submitting}
            >
              {submitting
                ? "Submitting..."
                : "Submit Delivery Request"}
            </button>

          </form>

        </section>

        {/* Deliveries */}

        <section
          id="my-deliveries"
          className="dashboard-section"
        >

          <div className="section-heading">

            <div>
              <h2>My Deliveries</h2>

              <p className="section-description">
                Track the status of your delivery requests.
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
              Loading deliveries...
            </div>
          ) : deliveries.length === 0 ? (
            <div className="empty-state">
              <h3>No deliveries yet</h3>
              <p>
                Create your first delivery request above.
              </p>
            </div>
          ) : (
            <div className="delivery-list">

              {deliveries.map((delivery) => (

                <div
                  className="delivery-card"
                  key={delivery._id || delivery.id}
                >

                  <div className="delivery-card-header">

                    <div>
                      <h3>
                        {delivery.productCategory ||
                          "Electronics Delivery"}
                      </h3>

                      <span className="delivery-id">
                        Delivery ID:{" "}
                        {delivery._id || delivery.id}
                      </span>
                    </div>

                    <span
                      className={getStatusClass(
                        delivery.status
                      )}
                    >
                      {delivery.status || "Requested"}
                    </span>

                  </div>

                  <div className="delivery-details">

                    <div>
                      <span>Customer</span>
                      <strong>
                        {delivery.customerName || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Phone</span>
                      <strong>
                        {delivery.customerPhone || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Address</span>
                      <strong>
                        {delivery.deliveryAddress || "—"}
                      </strong>
                    </div>

                    <div>
                      <span>Product</span>
                      <strong>
                        {delivery.productDescription || "—"}
                      </strong>
                    </div>

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

export default RetailerDashboard;