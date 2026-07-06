import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import {
  loadDogById,
  updateDog,
  uploadDogProfilePic,
  deleteDog,
} from "../api/dogs";

export default function EditDog() {
  const { dogId } = useParams();
  const { token } = useAuth();
  const goToPage = useNavigate();

  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [description, setDescription] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncDog = async () => {
      const data = await loadDogById(token, dogId);
      setName(data.name || "");
      setBreed(data.breed || "");
      setAge(data.age || "");
      setDescription(data.description || "");
      setProfilePic(data.profile_pic || "");
      setLoading(false);
    };
    syncDog();
  }, [token, dogId]);

  //save the dog's name, breed, age, and description
  const trySaveDog = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await updateDog(token, dogId, {
        name,
        breed,
        age: Number(age),
        description,
        profile_pic: profilePic,
      });
      goToPage("/dogs/" + dogId);
    } catch (err) {
      setError(err.message);
    }
  };

  //upload a profile pic for the dog from the user's device
  const tryUploadProfilePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);
    try {
      const data = await uploadDogProfilePic(token, dogId, file);
      setProfilePic(data.profile_pic);
    } catch (err) {
      setError(err.message);
    }
  };

  const tryDeleteDog = async () => {
    const confirmed = window.confirm("Delete " + name + "?");
    if (!confirmed) return;
    setError(null);
    try {
      await deleteDog(token, dogId);
      goToPage("/profile");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <h1>Edit Dog</h1>
      {error && <p role="alert">{error}</p>}

      <form onSubmit={trySaveDog}>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Breed
          <input
            type="text"
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            required
          />
        </label>

        <label>
          Age
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </label>

        {profilePic && (
          <img src={import.meta.env.VITE_API + profilePic} alt={name} />
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

        <div className="form-actions">
          <button type="button" onClick={() => goToPage("/dogs/" + dogId)}>
            Cancel
          </button>
          <button onClick={tryDeleteDog}>Delete Dog</button>
          <button type="submit">Save</button>
        </div>
      </form>
    </section>
  );
}
