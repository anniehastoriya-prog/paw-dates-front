import { useNavigate } from "react-router";

export default function DogCard({ dog }) {
  const goToPage = useNavigate();

  function clickDog() {
    goToPage(`/dogs/${dog.id}`);
  }

  return (
    <div className="dog-card" onClick={clickDog}>
      {dog.profile_pic && (
        <img src={import.meta.env.VITE_API + dog.profile_pic} alt={dog.name} />
      )}
      <p>{dog.name}</p>
      <p>
        {dog.breed}, {dog.age} yrs
      </p>
    </div>
  );
}
