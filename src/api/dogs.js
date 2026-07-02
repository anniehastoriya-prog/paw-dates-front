import { API } from "./config";

export async function loadDogById(token, id) {
  const response = await fetch(`${API}/dogs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
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
