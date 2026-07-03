import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { sendMessage } from "../api/messages";

//popup that lets user send a message from any page
export default function MessagePopup({ receiverId, messages, onClose }) {
  const { token } = useAuth();
  const goToPage = useNavigate();
  const [error, setError] = useState(null);
  const [minimized, setMinimized] = useState(false);

  const trySendMessage = async (formData) => {
    setError(null);
    const content = formData.get("message");
    try {
      await sendMessage(token, { content, receiverId });
    } catch (e) {
      setError(e.message);
    }
  };

  //if popup is minimized, show only minimize and close buttons
  if (minimized) {
    return (
      <article>
        <button onClick={() => setMinimized(false)}>_</button>
        <button onClick={onClose}>X</button>
      </article>
    );
  }

  //render full popup with message history and send form
  return (
    <article>
      <button onClick={() => setMinimized(true)}>_</button>
      <button onClick={onClose}>X</button>
      <button onClick={() => goToPage("/messages")}>✉</button>

      <h2>Message</h2>
      <div>
        {messages.map((m) => (
          <p key={m.id}>
            {m.content}
            <small>{new Date(m.createdAt).toLocaleTimeString()}</small>
          </p>
        ))}
      </div>
      <form action={trySendMessage}>
        <textarea name="message" required />
        <button>Send</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </article>
  );
}
