/** useNavigate lets us send the user to another page when they click a card*/
import { useNavigate } from "react-router";

export default function UserCard({ user }) {
  // Set up navigate so we can go to the user's profile when clicked
  const goToPage = useNavigate();

  /** This runs when someone clicks on a user card*/
  function clickUserCard() {
    // Send them to that user's profile page
    goToPage(`/users/${user.id}`);
  }

  return (
    <div className="user-card" onClick={clickUserCard}>
      {/* Circular profile picture */}
      <div className="user-pfp">
        {user.profilePic ? (
          <img src={user.profilePic} alt={user.username} />
        ) : (
          // Show the first letter of the username if there is no photo
          <span>{user.username.charAt(0).toUpperCase()}</span>
        )}
      </div>

      {/* Username below the picture */}
      <p className="user-card-name">{user.username}</p>
    </div>
  );
}
