import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="page-center">
      <div className="auth-card">

        <h1>Reflex Delivery</h1>

        <p>
          Electronics Delivery Management System
        </p>

        <div className="button-group">

          <Link
            to="/retailer/register"
            className="btn primary"
          >
            Register as Retailer
          </Link>

          <Link
            to="/retailer/login"
            className="btn secondary"
          >
            Retailer Login
          </Link>

          <Link
            to="/dispatcher/login"
            className="btn secondary"
          >
            Dispatcher Login
          </Link>

          <Link
            to="/rider/login"
            className="btn secondary"
          >
            Rider Login
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Home;