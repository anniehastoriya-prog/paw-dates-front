import { Link } from "react-router";
import { useAuth } from "../auth/AuthContext";
//if youre logged in you wont see login/register
export default function WelcomePage() {
  const { token } = useAuth();
  return (
    <main className="welcome">
      {/* Put logo in the public/ folder as logo.png — Vite serves public at "/" */}
      <img src="/logo.png" alt="Paw Dates logo" className="welcome-logo" />

      <h1 className="welcome-title">Paw Dates</h1>
      <p className="welcome-tagline">Playdates for your pup.</p>

      <section className="welcome-description">
        <p>
          Paw Dates helps dog owners find each other and set up playdates.
          Browse pups nearby, send a playdate request, and message owners to
          plan the details. After each meetup, leave a rating so the best
          matches rise to the top.
        </p>
      </section>

      {!token && (
        <div className="welcome-actions">
          <Link to="/login" className="btn btn-primary">
            Log in
          </Link>
          <Link to="/register" className="btn btn-secondary">
            Register
          </Link>
        </div>
      )}
    </main>
  );
}
