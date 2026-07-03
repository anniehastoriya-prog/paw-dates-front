import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../auth/AuthContext";
import { createPlaydate, updatePlaydateStatus } from "../api/playdates";

//popup that lets user request a playdate from any page
export default function PlaydateRequestPopup({
  requestDogId,
  recipientDogId,
  onClose,
}) {
  const { token } = useAuth();
  const goToPage = useNavigate();
  const [error, setError] = useState(null);
  const [minimized, setMinimized] = useState(false);
  const [sent, setSent] = useState(false);
  const [playdateId, setPlaydateId] = useState(null);
  const [sentTime, setSentTime] = useState(null);
  const [timeslot, setTimeslot] = useState("");

  //user sends a playdate request to another dog owner
  //stored in database so recipient can accept or decline
  const tryCreatePlaydate = async () => {
    setError(null);
    try {
      const result = await createPlaydate(token, {
        requestDogId,
        recipientDogId,
        timeslot,
      });
      setPlaydateId(result.id);
      setSentTime(new Date().toLocaleTimeString());
      setSent(true);
    } catch (e) {
      setError(e.message);
    }
  };

  //user can cancel their playdate request before recipient responds
  //removes the request from database
  const tryCancelPlaydate = async () => {
    setError(null);
    try {
      await updatePlaydateStatus(token, playdateId, "cancelled");
      setSent(false);
      setPlaydateId(null);
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

  //render full popup with request form or confirmation view
  //show send and cancel buttons before request is sent
  //show confirmation message and cancel request button after sent
  return (
    <article>
      <button onClick={() => setMinimized(true)}>_</button>
      <button onClick={onClose}>X</button>
      <button onClick={() => goToPage("/messages")}>✉</button>

      <h2>Request Playdate</h2>
      {error && <p role="alert">{error}</p>}

      {!sent ? (
        <>
          <input
            type="date"
            value={timeslot}
            onChange={(e) => setTimeslot(e.target.value)}
            required
          />
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button onClick={tryCreatePlaydate}>Send</button>
        </>
      ) : (
        <>
          <p>You've requested a playdate</p>
          <p>{sentTime}</p>
          <p>Pending</p>
          <button onClick={tryCancelPlaydate}>Cancel Request</button>
        </>
      )}
    </article>
  );
}
