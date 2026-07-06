import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { useAuth } from "./AuthContext";

/** A form that allows users to log into an existing account. */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const onLogin = async (formData) => {
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      await login({ username, password });
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };
  return (
    <section className="auth-page">
      <h1>Log in to your account</h1>
      <form action={onLogin}>
        <label>
          Username
          <input type="username" name="username" required />
        </label>
        <label>
          Password
          <input type="password" name="password" required />
        </label>
        <div className="form-actions">
          <button>Login</button>
          <Link to="/register" className="form-secondary-link">
            Need an account? Register here.
          </Link>
        </div>
        {error && <output>{error}</output>}
      </form>
    </section>
  );
}
