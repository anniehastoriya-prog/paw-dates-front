import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";

/** Grab the token so we can make an authorized request to the API*/
import { useAuth } from "../auth/AuthContext";

/** API helper function that fetches the logged in user's profile*/
import { loadMyProfile, loadUserById } from "../api/users";

/** MessagePopup is handled by another team member, we show and hide it.*/
import MessagePopup from "../components/MessagePopup";

export default function UserPage() {
  // Grab the token to check if someone is logged in
  const { token } = useAuth();

  // Set up navigate so we can go to the other pages
  const goToPage = useNavigate();

  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // showMessage controls whether the message popup is open or closed
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  // useEffect runs this once when the page first loads
  useEffect(() => {
    /** If there's an id in the url, load that user; otherwise load our own profile*/
    async function getProfile() {
      const data = id
        ? await loadUserById(token, id)
        : await loadMyProfile(token);
      // Save the profile so we can show it on screen
      setUser(data);
      // We are done loading
      setLoading(false);
    }
    getProfile();
  }, [token, id]);

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
  const clickDog = (dogId) => {
    goToPage("/dogs/" + dogId);
  };

  // While waiting for the profile, show a loading message
  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <div className="profile-header">
        <div className="profile-header-top">
          <div className="user-pfp-name">
            <div className="user-pfp">
              <img
                src={
                  user.profile_pic
                    ? import.meta.env.VITE_API + user.profile_pic
                    : "/nopfphooman.jpg"
                }
                alt={user.username}
              />
            </div>
            <h1>{user.username}</h1>
          </div>

          <button onClick={clickEditProfile}>Edit Profile</button>
        </div>

        <div className="profile-info">
          <div className="section-box">
            {/* User's bio/description */}
            <p className="user-description">
              {user.description || "No description yet."}
            </p>
          </div>

          <button onClick={clickMessage}>Message</button>
        </div>
      </div>

      {/* ── DOGS LIST ── */}
      <div className="dogs-section section-box">
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
                  <img
                    src={
                      dog.profile_pic
                        ? import.meta.env.VITE_API + dog.profile_pic
                        : "/nopfp.png"
                    }
                    alt={dog.name}
                  />
                </div>

                {/* Dog details below the picture */}
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
          receiverId={user.id}
          messages={[]}
          onClose={closeMessagePopup}
        />
      )}
    </section>
  );
}
