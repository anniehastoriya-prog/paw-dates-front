import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { loadDogById, updateDog } from "../api/dogs";

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
    async function fetchDog() {
      const data = await loadDogById(token, dogId);
      setName(data.name || "");
      setBreed(data.breed || "");
      setAge(data.age || "");
      setDescription(data.description || "");
      setProfilePic(data.profile_pic || "");
      setLoading(false);
    }
    fetchDog();
  }, [token, dogId]);

  async function trySaveDog(e) {
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
      goToPage(`/dogs/${dogId}`);
    } catch (err) {
      setError(err.message);
    }
  }

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

        <label>
          Profile picture URL
          <input
            type="text"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
          />
        </label>

        <label>
          Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <button type="submit">Save</button>
        <button type="button" onClick={() => goToPage(`/dogs/${dogId}`)}>
          Cancel
        </button>
      </form>
    </section>
  );
}
