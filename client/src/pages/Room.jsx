// src/pages/Room.jsx
import { LiveKitRoom, VideoConference } from '@livekit/components-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';


const SERVER_URL = import.meta.env.VITE_LIVEKIT_URL || 'wss://video-test-jctqzf6a.livekit.cloud';

const Room = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [emails, setEmails] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    const joinRoom = async () => {
      setLoading(true);
      setError('');
      
      try {
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

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/token?roomName=${roomId}&identity=${encodeURIComponent(identity)}&userId=${userId}`
        );

        if (!res.ok) {
          throw new Error(res.statusText || 'Failed to fetch token');
        }

        const data = await res.json();
        if (isMounted) {
          if (data.token) {
            setToken(data.token);
          } else {
            throw new Error("Token not received");
          }
        }
      } catch (err) {
        console.error("Token fetch failed:", err);
        if (isMounted) {
          setError("Failed to join meeting. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    joinRoom();

    return () => {
      isMounted = false;
    };
  }, [roomId, navigate]);

  const handleSendInvites = async () => {

    const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

    const emailList = emails
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length);

    if (emailList.length === 0) {
      return setError('Please enter at least one email.');
    }

    // Validate emails
    const invalidEmails = emailList.filter(email => !validateEmail(email));
    if (invalidEmails.length > 0) {
      return setError(`Invalid emails: ${invalidEmails.join(', ')}`);
    }

    setInviteLoading(true);
    setError('');

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/send-invites`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails: emailList, roomName: roomId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send invites');
      }

      alert('Invitations sent!');
      setEmails('');
      setShowInvite(false);
    } catch (err) {
      console.error("Error sending invites:", err);
      setError(err.message || "Failed to send invites.");
    } finally {
      setInviteLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center mt-10 p-4 bg-red-100 text-red-700 rounded max-w-md mx-auto">
        {error}
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!token || loading) {
    return <div className="text-center text-lg mt-10">Joining room...</div>;
  }

  return (
    <>
      <div className="flex justify-between items-center px-6 py-2 bg-gray-100 border-b">
        <h2 className="text-lg font-semibold">Meeting Room: <span className="text-blue-600">{roomId}</span></h2>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
          aria-label="Invite participants"
          aria-expanded={showInvite}
        >
          📧 Invite Participants
        </button>
      </div>

      {showInvite && (
        <div className="bg-white px-6 py-3 border-b space-y-2">
          <label htmlFor="emails" className="block text-sm font-medium text-gray-700">
            Email addresses (separated by commas)
          </label>
          <input
            id="emails"
            type="text"
            placeholder="e.g., user1@example.com, user2@example.com"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleSendInvites}
            disabled={inviteLoading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-green-300"
          >
            {inviteLoading ? 'Sending...' : 'Send Invites'}
          </button>
        </div>
      )}

      <LiveKitRoom
        token={token}
        serverUrl={SERVER_URL}
        connect={true}
        data-lk-theme="default"
        style={{ height: '90vh', width: '80vw' }}
        onDisconnected={() => {
          setError('Disconnected from the room');
        }}
      >
        <VideoConference />
      </LiveKitRoom>
    </>
  );
};

export default Room;