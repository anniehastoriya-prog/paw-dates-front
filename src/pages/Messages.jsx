import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getMessages, getConversation, sendMessage } from "../api/messages";
import { getPlaydates, updatePlaydateStatus } from "../api/playdates";
import { loadMyProfile } from "../api/users";

export default function Messages() {
  const { token } = useAuth();

  //state to store conversations, playdates, selected item, and errors
  const [conversations, setConversations] = useState([]);
  const [playdates, setPlaydates] = useState([]);
  const [myDogIds, setMyDogIds] = useState([]);
  const [myUserId, setMyUserId] = useState(null);
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

    const syncMe = async () => {
      const data = await loadMyProfile(token);
      const dogs = data.dogs || [];
      setMyDogIds(dogs.map((dog) => dog.id));
      setMyUserId(data.id);
    };

    syncMessages();
    syncPlaydates();
    syncMe();
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
      const conversationsData = await getMessages(token);
      setConversations(conversationsData);
      const threadData = await getConversation(token, selected.senderId);
      setSelected({ ...selected, messages: threadData });
    } catch (e) {
      setError(e.message);
    }
  };

  //render the page with playdate requests, conversations, and selected detail
  return (
    <section className="messages-page">
      <h1>Messages</h1>
      {error && <p role="alert">{error}</p>}

      <div className="messages-layout">
        <div className="messages-sidebar">
          <div className="messages-section">
            <h2>Playdate Requests</h2>
            <ul>
              {playdates.map((p) => (
                <PlaydateItem
                  key={p.id}
                  playdate={p}
                  onClick={() => setSelected(p)}
                />
              ))}
            </ul>
          </div>

          <div className="messages-section">
            <h2>Messages</h2>
            <ul>
              {conversations.map((c) => (
                <ConversationItem
                  key={c.senderId}
                  conversation={c}
                  onClick={() => openConversation(c)}
                />
              ))}
            </ul>
          </div>
        </div>

        <div className="messages-detail">
          {selected && selected.messages && (
            <MessageDetail
              conversation={selected}
              onSendMessage={trySendMessage}
              myUserId={myUserId}
            />
          )}

          {selected && !selected.messages && (
            <PlaydateDetail
              playdate={selected}
              myDogIds={myDogIds}
              tryUpdatePlaydate={tryUpdatePlaydate}
            />
          )}

          {!selected && (
            <p>Select a playdate request or a conversation to view details.</p>
          )}
        </div>
      </div>
    </section>
  );
}

//show a single playdate item that user can click to view details
function PlaydateItem({ playdate, onClick }) {
  return (
    <li onClick={onClick}>
      <img
        src={
          playdate.dogProfilePic
            ? import.meta.env.VITE_API + playdate.dogProfilePic
            : "/nopfp.png"
        }
        alt={playdate.dogName}
        className="message-pfp"
      />
      <div>
        <p>{playdate.dogName}</p>
        <p>{playdate.status}</p>
      </div>
    </li>
  );
}

//show a single conversation item that user can click to view message thread
function ConversationItem({ conversation, onClick }) {
  const preview =
    conversation.lastMessage.length > 40
      ? conversation.lastMessage.slice(0, 40) + "..."
      : conversation.lastMessage;

  return (
    <li onClick={onClick}>
      <img
        src={
          conversation.senderProfilePic
            ? import.meta.env.VITE_API + conversation.senderProfilePic
            : "/nopfphooman.jpg"
        }
        alt={conversation.senderName}
        className="message-pfp"
      />
      <div>
        <p>{conversation.senderName}</p>
        <p>{preview}</p>
      </div>
    </li>
  );
}

//display full message conversation and form to send new messages
//labels each bubble by sender and lines up my messages on the right
function MessageDetail({ conversation, onSendMessage, myUserId }) {
  return (
    <>
      <h2>{conversation.senderName}</h2>
      <div className="message-thread">
        {conversation.messages.map((m) => {
          const isMine = m.sender_id === myUserId;
          return (
            <div
              key={m.id}
              className={"message-bubble-wrap " + (isMine ? "mine" : "theirs")}
            >
              <p className="message-sender-label">
                {isMine ? "You" : conversation.senderName}
              </p>
              <p className="message-bubble">{m.content}</p>
            </div>
          );
        })}
      </div>
      <form action={onSendMessage}>
        <textarea name="message" required />
        <button>Send</button>
      </form>
    </>
  );
}

//display playdate request status and buttons based on whether the user sent or received the request
function PlaydateDetail({ playdate, myDogIds, tryUpdatePlaydate }) {
  const isSender = myDogIds.includes(playdate.request_dog_id);

  return (
    <>
      <p>{playdate.status}</p>
      {isSender ? (
        <button onClick={() => tryUpdatePlaydate(playdate.id, "cancelled")}>
          Cancel Request
        </button>
      ) : (
        <>
          <button onClick={() => tryUpdatePlaydate(playdate.id, "confirmed")}>
            Accept
          </button>
          <button onClick={() => tryUpdatePlaydate(playdate.id, "declined")}>
            Decline
          </button>
        </>
      )}
    </>
  );
}
