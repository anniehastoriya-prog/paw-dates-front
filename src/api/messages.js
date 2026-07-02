//handles all communication with the backend for message operations.
const API = import.meta.env.VITE_API;

//user loads all existing conversations when they open messages page
export async function getMessages(token) {
  try {
    const response = await fetch(API + "/messages", {
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

//user sends a message to another user
//stored in the database for the recipient to see
export async function sendMessage(token, { content, receiverId }) {
  const response = await fetch(API + "/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ content, receiverId }),
  });
  if (!response.ok) {
    const result = await response.json();
    throw Error(result.message);
  }
}

//user can delete a message they sent permanently
export async function deleteMessage(token, id) {
  const response = await fetch(API + "/messages/" + id, {
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