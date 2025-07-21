// src/pages/Room.jsx
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const SERVER_URL = import.meta.env.VITE_LIVEKIT_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Room = () => {
  const { roomId } = useParams();  // roomName from URL
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  const [emails, setEmails] = useState('');
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    const joinRoom = async () => {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      let identity = storedUser?.name;
      let userId = storedUser?.id;

      if (!identity || !userId) {
        identity = prompt('Enter your name:');
        if (!identity) {
          alert('Name is required to join the meeting.');
          navigate('/meeting');
          return;
        }
        userId = 'guest';
      }

      try {
        const res = await fetch(
          `${BACKEND_URL}/token?roomName=${roomId}&identity=${encodeURIComponent(identity)}&userId=${userId}`
        );
        const data = await res.json();
        if (res.ok && data.token) {
          setToken(data.token);
        } else {
          throw new Error("Token not received");
        }
      } catch (err) {
        console.error("Token fetch failed:", err);
        alert("Failed to join meeting.");
        navigate("/meeting");
      }
    };

    joinRoom();
  }, [roomId, navigate]);

  const handleSendInvites = async () => {
    const emailList = emails
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length);

    if (emailList.length === 0) {
      return alert('Please enter at least one email.');
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/send-invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: emailList, roomName: roomId }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Invitations sent!');
        setEmails('');
        setShowInvite(false);
      } else {
        alert('Failed to send invites: ' + data.error);
      }
    } catch (err) {
      console.error("Error sending invites:", err);
      alert("Failed to send invites.");
    }
  };

  if (!token) return <div className="text-center text-lg mt-10">Joining room...</div>;

  return (
    <>
      <div className="flex justify-between items-center px-6 py-2 bg-gray-100 border-b">
        <h2 className="text-lg font-semibold">Meeting Room: <span className="text-blue-600">{roomId}</span></h2>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
        >
          📧 Invite Participants
        </button>
      </div>

      {showInvite && (
        <div className="bg-white px-6 py-3 border-b space-y-2">
          <input
            type="text"
            placeholder="Enter emails separated by commas"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <button
            onClick={handleSendInvites}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Send Invites
          </button>
        </div>
      )}

      <LiveKitRoom
        token={token}
        serverUrl={SERVER_URL}
        connect={true}
        data-lk-theme="default"
        style={{ height: '90vh', width: '80vw' }}
      >
        <VideoConference />
      </LiveKitRoom>
    </>
  );
};

export default Room;
