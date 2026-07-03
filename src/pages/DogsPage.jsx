import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useParams, useNavigate } from "react-router";
import MessagePopup from "../components/MessagePopup";
import PlaydateRequestPopup from "../components/PlaydateRequestPopup";
import {
  loadDogById,
  loadDogPhotos,
  uploadDogPhoto,
  deleteDogPhoto,
} from "../api/dogs";
import { loadMyProfile } from "../api/users";

export default function DogPage() {
  const { dogId } = useParams();
  const goToPage = useNavigate();
  const { token } = useAuth();

  const [dog, setDog] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [myUserId, setMyUserId] = useState(null);
  const [myDogs, setMyDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [showPlaydateRequest, setShowPlaydateRequest] = useState(false);

  useEffect(() => {
    async function fetchDog() {
      const data = await loadDogById(token, dogId);
      setDog(data);
      setLoading(false);
    }
    async function fetchPhotos() {
      const data = await loadDogPhotos(token, dogId);
      setPhotos(data);
    }
    async function fetchMe() {
      const data = await loadMyProfile(token);
      setMyUserId(data.id);
      setMyDogs(data.dogs || []);
    }
    fetchDog();
    fetchPhotos();
    fetchMe();
  }, [token, dogId]);

  function clickMessage() {
    setShowMessage(true);
  }

  function closeMessage() {
    setShowMessage(false);
  }

  function clickPlaydateRequest() {
    setShowPlaydateRequest(true);
  }

  function closePlaydateRequest() {
    setShowPlaydateRequest(false);
  }

  function clickOwner() {
    goToPage(`/users/${dog.owner.id}`);
  }

  function clickRating() {
    document.getElementById("reviews").scrollIntoView();
  }

  async function tryUploadPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await uploadDogPhoto(token, dogId, file);
      const data = await loadDogPhotos(token, dogId);
      setPhotos(data);
    } catch (err) {
      alert(err.message);
    }
  }

  async function tryDeletePhoto(photoId) {
    try {
      await deleteDogPhoto(token, dogId, photoId);
      const data = await loadDogPhotos(token, dogId);
      setPhotos(data);
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <div className="dog-header">
        <div className="dog-pfp">
          {dog.profile_pic && (
            <img
              src={import.meta.env.VITE_API + dog.profile_pic}
              alt={dog.name}
            />
          )}
        </div>

        <div className="dog-info">
          <h1>{dog.name}</h1>
          <p>
            {dog.breed}, {dog.age} yrs
          </p>

          <button onClick={clickRating}>{dog.ratings} paws</button>

          <p>{dog.description}</p>

          {dog.owner.id !== myUserId && (
            <>
              <button onClick={clickMessage}>Message</button>
              <button onClick={clickPlaydateRequest}>Request Playdate</button>
            </>
          )}
          {dog.owner.id === myUserId && (
            <button onClick={() => goToPage("/dogs/" + dog.id + "/edit")}>
              Edit Dog
            </button>
          )}
        </div>
      </div>

      <h2>Owner</h2>
      <div className="owner-info" onClick={clickOwner}>
        {dog.owner.profilePic && (
          <img
            src={import.meta.env.VITE_API + dog.owner.profilePic}
            alt={dog.owner.username}
          />
        )}
        <p>{dog.owner.username}</p>
      </div>

      <div className="dog-photos">
        <h2>Photos</h2>
        {dog.owner.id === myUserId && (
          <label>
            Add Photo
            <input type="file" accept="image/*" onChange={tryUploadPhoto} />
          </label>
        )}
        {photos.map((photo) => (
          <div key={photo.id} className="dog-photo">
            <img
              src={import.meta.env.VITE_API + photo.image_url}
              alt={dog.name}
            />
            {dog.owner.id === myUserId && (
              <button onClick={() => tryDeletePhoto(photo.id)}>Delete</button>
            )}
          </div>
        ))}
      </div>

      <div id="reviews">
        <h2>Reviews</h2>
        <p>Reviews coming soon.</p>
      </div>

      {showMessage && (
        <MessagePopup
          receiverId={dog.owner.id}
          messages={[]}
          onClose={closeMessage}
        />
      )}
      {showPlaydateRequest && (
        <PlaydateRequestPopup
          myDogs={myDogs}
          recipientDogId={dog.id}
          onClose={closePlaydateRequest}
        />
      )}
    </section>
  );
}
