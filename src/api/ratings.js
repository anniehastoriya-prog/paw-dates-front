const API = import.meta.env.VITE_API;

export async function loadDogRatings(dogId) {
  const response = await fetch(API + "/ratings/dog/" + dogId);
  const data = await response.json();
  return data;
}

export async function submitRating(token, dogId, paws, comments) {
  if (paws < 1 || paws > 5) {
    throw new Error("Rating must be between 1 and 5 paws");
  }
  const response = await fetch(API + "/ratings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ dog_id: dogId, paws, comments }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw Error(data.message);
  }
  return data;
}

export async function deleteRating(token, id) {
  const response = await fetch(API + "/ratings/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  if (!response.ok) {
    const data = await response.json();
    throw Error(data.message);
  }
}
