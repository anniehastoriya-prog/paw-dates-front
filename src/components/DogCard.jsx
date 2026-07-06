import { useNavigate } from "react-router";

export default function DogCard({ dog }) {
  const goToPage = useNavigate();

  function clickDog() {
    goToPage("/dogs/" + dog.id);
  }

  //show the dog's photo if they have one, otherwise show the default paw icon
  return (
    <div className="dog-card" onClick={clickDog}>
      <img
        className="dog-pfp"
        src={
          dog.profile_pic
            ? import.meta.env.VITE_API + dog.profile_pic
            : "/nopfp.png"
        }
        alt={dog.name}
      />
      <div className="dog-card-info">
        <p>{dog.name}</p>
        <p>
          {dog.breed}, {dog.age} yrs
        </p>
      </div>
    </div>
  );
}
