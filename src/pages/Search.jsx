import { useState, useEffect } from "react";
import { getDogs } from "../api/dogs"; // AL's api helper — change the import if the export name differs
import DogCard from "../components/DogCard"; // AL's reusable card (the dog version of BookListItem)

export default function Search() {
  const [dogs, setDogs] = useState([]);

  const [search, setSearch] = useState("");
  const [breed, setBreed] = useState("all");
  const [maxDistance, setMaxDistance] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");

  //used to filter, updated on search click
  const [appliedSearch, setAppliedSearch] = useState("");
  const [appliedBreed, setAppliedBreed] = useState("all");
  const [appliedMaxDistance, setAppliedMaxDistance] = useState("");
  const [appliedMinAge, setAppliedMinAge] = useState("");
  const [appliedMaxAge, setAppliedMaxAge] = useState("");

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

  function runSearch() {
    setAppliedSearch(search);
    setAppliedBreed(breed);
    setAppliedMaxDistance(maxDistance);
    setAppliedMinAge(minAge);
    setAppliedMaxAge(maxAge);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") runSearch();
  }

  const visibleDogs = dogs
    .filter((dog) => {
      const query = appliedSearch.toLowerCase().trim();
      const matchesSearch = !query || dog.name?.toLowerCase().includes(query);
      const matchesBreed = appliedBreed === "all" || dog.breed === appliedBreed;
      const matchesDistance =
        appliedMaxDistance === "" || dog.distance <= Number(appliedMaxDistance);
      const matchesMinAge =
        appliedMinAge === "" || dog.age >= Number(appliedMinAge);
      const matchesMaxAge =
        appliedMaxAge === "" || dog.age <= Number(appliedMaxAge);
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
        onKeyDown={handleKeyDown}
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
          onKeyDown={handleKeyDown}
        />
        <input
          type="number"
          placeholder="Min age"
          value={minAge}
          onChange={(e) => setMinAge(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="number"
          placeholder="Max age"
          value={maxAge}
          onChange={(e) => setMaxAge(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={runSearch}>Search</button>
      </div>

      <ul className="dog-list">
        {visibleDogs.map((dog) => (
          <DogCard key={dog.id} dog={dog} />
        ))}
      </ul>
    </>
  );
}
