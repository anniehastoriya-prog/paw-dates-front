import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { loadMyProfile, updateMyProfile, uploadProfilePic } from "../api/users";
import { createDog, deleteDog } from "../api/dogs";

export default function EditProfile() {
  const { token } = useAuth();
  const goToPage = useNavigate();

  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dogName, setDogName] = useState("");
  const [dogBreed, setDogBreed] = useState("");
  const [dogAge, setDogAge] = useState("");

  const syncProfile = async () => {
    const data = await loadMyProfile(token);
    setDescription(data.description || "");
    setProfilePic(data.profile_pic || "");
    setDogs(data.dogs || []);
    setLoading(false);
  };

  useEffect(() => {
    syncProfile();
  }, [token]);

  const trySaveProfile = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateMyProfile(token, {
        description,
        profile_pic: profilePic,
      });
      goToPage("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  const tryUploadProfilePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);
    try {
      const data = await uploadProfilePic(token, file);
      setProfilePic(data.profile_pic);
    } catch (err) {
      setError(err.message);
    }
  };

  const tryAddDog = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await createDog(token, {
        name: dogName,
        breed: dogBreed,
        age: Number(dogAge),
      });
      setDogName("");
      setDogBreed("");
      setDogAge("");
      await syncProfile();
    } catch (err) {
      setError(err.message);
    }
  };

  //user clicks delete, confirm before removing the dog from their profile
  const tryDeleteDog = async (dog) => {
    const confirmDelete = window.confirm("Remove " + dog.name + "?");
    if (!confirmDelete) return;
    setError(null);
    try {
      await deleteDog(token, dog.id);
      const updatedDogs = dogs.filter((d) => d.id !== dog.id);
      setDogs(updatedDogs);
    } catch (e) {
      setError(e.message);
    }
  };
  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <h1>Edit Profile</h1>
      {error && <p role="alert">{error}</p>}

      <form onSubmit={trySaveProfile}>
        {profilePic && (
          <img src={import.meta.env.VITE_API + profilePic} alt="Profile" />
        )}
        <label>
          Profile Picture
          <input type="file" accept="image/*" onChange={tryUploadProfilePic} />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <button type="submit">Save</button>
        <button type="button" onClick={() => goToPage("/profile")}>
          Cancel
        </button>
      </form>

      <h2>My Dogs</h2>
      {dogs.length > 0 ? (
        <div className="dogs-list">
          {dogs.map((dog) => (
            <div key={dog.id} className="dog-card">
              <div className="dog-pfp">
                {dog.profile_pic ? (
                  <img
                    src={import.meta.env.VITE_API + dog.profile_pic}
                    alt={dog.name}
                  />
                ) : (
                  <span>{dog.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <p className="dog-name">{dog.name}</p>
              <p className="dog-age">{dog.age} yrs</p>
              <button onClick={() => tryDeleteDog(dog)}>Delete</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No dogs added yet.</p>
      )}

      <h2>Add a Dog</h2>
      <form onSubmit={tryAddDog}>
        <label>
          Name
          <input
            type="text"
            value={dogName}
            onChange={(e) => setDogName(e.target.value)}
            required
          />
        </label>

        <label>
          Breed
          <input
            type="text"
            value={dogBreed}
            onChange={(e) => setDogBreed(e.target.value)}
            required
          />
        </label>

        <label>
          Age
          <input
            type="number"
            value={dogAge}
            onChange={(e) => setDogAge(e.target.value)}
            required
          />
        </label>

        <button type="submit">Add Dog</button>
      </form>
    </section>
  );
}
