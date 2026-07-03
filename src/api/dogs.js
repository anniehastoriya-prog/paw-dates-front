const API = import.meta.env.VITE_API;

//user loads all dogs when they open the search page
export async function getDogs() {
  try {
    const response = await fetch(API + "/dogs");
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function createDog(token, { name, breed, age }) {
  const response = await fetch(API + "/dogs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ name, breed, age }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function loadDogById(token, id) {
  const response = await fetch(`${API}/dogs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data;
}

export async function loadDogPhotos(token, id) {
  const response = await fetch(`${API}/dogs/${id}/photos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data;
}

export async function updateDog(
  token,
  id,
  { name, breed, age, description, profile_pic },
) {
  const response = await fetch(`${API}/dogs/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, breed, age, description, profile_pic }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function sendDogMessage(token, dogId, message) {
  const response = await fetch(`${API}/dogs/${dogId}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function sendPlaydateRequest(token, dogId, message) {
  const response = await fetch(`${API}/dogs/${dogId}/playdate-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}

export async function uploadDogPhoto(token, dogId, file) {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch(API + "/dogs/" + dogId + "/photos", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) {
    throw Error(result.message);
  }
  return result;
}

export async function deleteDogPhoto(token, dogId, photoId) {
  const response = await fetch(API + "/dogs/" + dogId + "/photos/" + photoId, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}

export async function uploadDogProfilePic(token, dogId, file) {
  const formData = new FormData();
  formData.append("photo", file);

  const response = await fetch(API + "/dogs/" + dogId + "/profile-pic", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
    },
    body: formData,
  });
  const result = await response.json();
  if (!response.ok) {
    throw Error(result.message);
  }
  return result;
}

export async function deleteDog(token, id) {
  const response = await fetch(API + "/dogs/" + id, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}
