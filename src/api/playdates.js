//handles all communication with the backend for playdate operations.
const API = import.meta.env.VITE_API;

//user loads all playdate requests when they open messages page
export async function getPlaydates(token) {
  try {
    const response = await fetch(API + "/playdates", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    const result = await response.json();
    return result;
  } catch (e) {
    console.error(e);
    return [];
  }
}

//user sends a playdate request to another users dog
//stored in the database for the recipient to see
export async function createPlaydate(
  token,
  { requestDogId, recipientDogId, timeslot },
) {
  const response = await fetch(API + "/playdates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ requestDogId, recipientDogId, timeslot }),
  });
  
  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}

//user can accept or decline a playdate request
//updates the status in the database so both users see the decision
export async function updatePlaydateStatus(token, id, status) {
  const response = await fetch(API + "/playdates/" + id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}