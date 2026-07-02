import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

/** Grab the token so we can make an authorized request to the API*/
import { useAuth } from "../auth/AuthContext";

/** API helper function that fetches the logged in user's profile*/
import { loadMyProfile } from "../api/users";

/** MessagePopup is handled by another team member, we show and hide it.*/
import MessagePopup from "../components/MessagePopup";

export default function UserPage() {
  // Grab the token to check if someone is logged in
  const { token } = useAuth();

  // Set up navigate so we can go to the other pages
  const goToPage = useNavigate();

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // showMessage controls whether the message popup is open or closed
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  // useEffect runs this once when the page first loads
  useEffect(() => {
    /** Go get the logged in user's profile from the API*/
    async function getMyProfile() {
      const data = await loadMyProfile(token);
      // Save the profile so we can show it on screen
      setUser(data);
      // We are done loading
      setLoading(false);
    }
    getMyProfile();
  }, [token]);

  /** This runs when the user clicks Edit Profile*/
  function clickEditProfile() {
    goToPage("/profile/edit");
  }

  /** This runs when the user clicks Message, opens the popup*/
  function clickMessage() {
    setShowMessagePopup(true);
  }

  /** This runs when the popup asks to be closed*/
  function closeMessagePopup() {
    setShowMessagePopup(false);
  }

  /** This runs when clicking a dog card, goes to that dog's profile page*/
  function clickDog(dogId) {
    goToPage(`/dogs/${dogId}`);
  }

  // While waiting for the profile, show a loading message
  if (loading) return <p>Loading...</p>;

  return (
    <section>
      {/* ── PROFILE HEADER: pic, description, buttons ── */}
      <div className="profile-header">
        {/* Circular profile picture */}
        <div className="user-pfp">
          {user.profilePic ? (
            <img src={user.profilePic} alt={user.username} />
          ) : (
            // Show the first letter of the username if there is no photo
            <span>{user.username.charAt(0).toUpperCase()}</span>
          )}
        </div>

        <div className="profile-info">
          <h1>{user.username}</h1>

          {/* User's bio/description */}
          <p className="user-description">
            {user.description || "No description yet."}
          </p>

          {/* Edit Profile sends the user to the edit page */}
          <button onClick={clickEditProfile}>Edit Profile</button>

          {/* Message opens the popup — MessagePopup handles the rest */}
          <button onClick={clickMessage}>Message</button>
        </div>
      </div>

      {/* ── DOGS LIST ── */}
      <div className="dogs-section">
        <h2>My Dogs</h2>

        {user.dogs && user.dogs.length > 0 ? (
          <div className="dogs-list">
            {user.dogs.map((dog) => (
              // Clicking a dog card goes to that dog's profile page
              <div
                key={dog.id}
                className="dog-card"
                onClick={() => clickDog(dog.id)}
              >
                {/* Circular dog profile picture */}
                <div className="dog-pfp">
                  {dog.profilePic ? (
                    <img src={dog.profilePic} alt={dog.name} />
                  ) : (
                    // Show the first letter of the dog's name if there is no photo
                    <span>{dog.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>

                {/* Dog details below the picture */}
                <p className="dog-name">{dog.name}</p>
                <p className="dog-age">{dog.age} yrs</p>
                <p className="dog-description">{dog.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No dogs added yet.</p>
        )}
      </div>

      {/* ── MESSAGE POPUP ── */}
      {/* Only shows when the Message button is clicked */}
      {/* MessagePopup implementation is handled by another team member */}
      {showMessagePopup && (
        <MessagePopup
          recipientId={user.id}
          recipientName={user.username}
          onClose={closeMessagePopup}
        />
      )}
    </section>
  );
}
