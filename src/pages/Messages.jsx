import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getMessages, getConversation, sendMessage } from "../api/messages";
import { getPlaydates, updatePlaydateStatus } from "../api/playdates";

export default function Messages() {
  const { token } = useAuth();

  //state to store conversations, playdates, selected item, and errors
  const [conversations, setConversations] = useState([]);
  const [playdates, setPlaydates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState(null);

  //when page loads, fetch all conversations and playdate requests from backend
  useEffect(() => {
    const syncMessages = async () => {
      const data = await getMessages(token);
      setConversations(data);
    };

    const syncPlaydates = async () => {
      const data = await getPlaydates(token);
      setPlaydates(data);
    };

    syncMessages();
    syncPlaydates();
  }, [token]);

  //user can accept or decline a playdate request
  //updates the status in the database
  const tryUpdatePlaydate = async (id, status) => {
    setError(null);
    try {
      await updatePlaydateStatus(token, id, status);
      const data = await getPlaydates(token);
      setPlaydates(data);
    } catch (e) {
      setError(e.message);
    }
  };

  //user clicks a conversation, loads the full message thread with that person
  const openConversation = async (c) => {
    const data = await getConversation(token, c.senderId);
    setSelected({ ...c, messages: data });
  };

  //user sends a message in the conversation
  //refreshes the conversation list so the message appears
  const trySendMessage = async (formData) => {
    setError(null);
    const content = formData.get("message");
    try {
      const date = new Date().toLocaleDateString("en-US");
      await sendMessage(token, {
        content,
        receiverId: selected.senderId,
        date,
      });
      const data = await getMessages(token);
      setConversations(data);
    } catch (e) {
      setError(e.message);
    }
  };

  //render the page with playdate requests, conversations, and selected detail
  return (
    <>
      <h1>Messages</h1>
      {error && <p role="alert">{error}</p>}

      <ul>
        {playdates.map((p) => (
          <PlaydateItem
            key={p.id}
            playdate={p}
            onClick={() => setSelected(p)}
          />
        ))}
      </ul>

      <ul>
        {conversations.map((c) => (
          <ConversationItem
            key={c.senderId}
            conversation={c}
            onClick={() => openConversation(c)}
          />
        ))}
      </ul>

      {selected && selected.messages && (
        <MessageDetail conversation={selected} onSendMessage={trySendMessage} />
      )}

      {selected && !selected.messages && (
        <PlaydateDetail
          playdate={selected}
          tryUpdatePlaydate={tryUpdatePlaydate}
        />
      )}
    </>
  );
}

//show a single playdate item that user can click to view details
function PlaydateItem({ playdate, onClick }) {
  return (
    <li onClick={onClick}>
      <p>{playdate.dogName}</p>
      <p>{playdate.status}</p>
    </li>
  );
}

//show a single conversation item that user can click to view message thread
function ConversationItem({ conversation, onClick }) {
  return (
    <li onClick={onClick}>
      <p>{conversation.senderName}</p>
      <p>{conversation.lastMessage}</p>
    </li>
  );
}

//display full message conversation and form to send new messages
function MessageDetail({ conversation, onSendMessage }) {
  return (
    <>
      <h2>{conversation.senderName}</h2>
      {conversation.messages.map((m) => (
        <p key={m.id}>{m.content}</p>
      ))}
      <form action={onSendMessage}>
        <textarea name="message" required />
        <button>Send</button>
      </form>
    </>
  );
}

//display playdate request status and accept/decline buttons
function PlaydateDetail({ playdate, tryUpdatePlaydate }) {
  return (
    <>
      <p>{playdate.status}</p>
      <button onClick={() => tryUpdatePlaydate(playdate.id, "confirmed")}>
        Accept
      </button>
      <button onClick={() => tryUpdatePlaydate(playdate.id, "declined")}>
        Decline
      </button>
    </>
  );
}
