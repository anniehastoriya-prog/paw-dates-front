import { useState, useEffect } from "react";
import { getDogs } from "../api/dogs"; // AL's api helper — change the import if the export name differs
import DogCard from "../components/DogCard"; // AL's reusable card (the dog version of BookListItem)

export default function Search() {
  const [dogs, setDogs] = useState([]);

  // search + filter controls — 10 mile radius
  const [search, setSearch] = useState("");
  const [breed, setBreed] = useState("all");
  const [maxDistance, setMaxDistance] = useState("10");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  const syncDogs = async () => {
    const data = await getDogs();
    setDogs(data);
  };

  useEffect(() => {
    syncDogs();
  }, []);

  // breed dropdown options, built from whatever dogs came back
  const breeds = [
    "all",
    ...new Set(dogs.map((dog) => dog.breed).filter(Boolean)),
  ];

  // apply the search box + each filter, then sort closest first
  const visibleDogs = dogs
    .filter((dog) => {
      const query = search.toLowerCase().trim();
      const matchesSearch = !query || dog.name?.toLowerCase().includes(query);
      const matchesBreed = breed === "all" || dog.breed === breed;
      const matchesDistance =
        maxDistance === "" || dog.distance <= Number(maxDistance);
      const matchesMinAge = minAge === "" || dog.age >= Number(minAge);
      const matchesMaxAge = maxAge === "" || dog.age <= Number(maxAge);
      return (
        matchesSearch &&
        matchesBreed &&
        matchesDistance &&
        matchesMinAge &&
        matchesMaxAge
      );
    })
    .sort((a, b) => a.distance - b.distance);

  return (
    <>
      <h1>Meet the doggos</h1>

      <input
        className="search-bar"
        type="text"
        placeholder="Search dogs by name…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="filters">
        <select value={breed} onChange={(e) => setBreed(e.target.value)}>
          {breeds.map((b) => (
            <option key={b} value={b}>
              {b === "all" ? "All breeds" : b}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Within (mi)"
          value={maxDistance}
          onChange={(e) => setMaxDistance(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min age"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max age"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
        />
      </div>

      <ul className="dog-list">
        {visibleDogs.map((dog) => (
          <DogCard key={dog.id} dog={dog} />
        ))}
      </ul>
    </>
  );
}
