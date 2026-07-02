// Pull in the API URL from the .env file
const API = import.meta.env.VITE_API;

/** Go get the logged in user's own profile info */
// We send the token so the API knows who is asking
export async function loadMyProfile(token) {
  const response = await fetch(`${API}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data;
}

/** Go get one specific user's profile using their id*/
export async function loadUserById(token, id) {
  const response = await fetch(`${API}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  return data;
}

/** Send updated profile info to the API to save the changes*/
export async function updateMyProfile(token, updates) {
  const response = await fetch(`${API}/users/me`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      // Send token to prove the user is logged in
      Authorization: `Bearer ${token}`,
    },
    // Send the updated fields to the API
    body: JSON.stringify(updates),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data;
}
