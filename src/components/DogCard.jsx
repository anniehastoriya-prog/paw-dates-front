import { useNavigate } from "react-router";

export default function DogCard({ dog }) {
  const goToPage = useNavigate();

  function clickDog() {
    goToPage(`/dogs/${dog.id}`);
  }

  return (
    <div className="dog-card" onClick={clickDog}>
      <img src={dog.profilePic} alt={dog.name} />
      <p>{dog.name}</p>
      <p>
        {dog.breed}, {dog.age} yrs, {dog.distance} mi away
      </p>
    </div>
  );
}
