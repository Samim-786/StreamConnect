import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MeetingOptions = () => {
  const [joinRoomName, setJoinRoomName] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [emails, setEmails] = useState('');
  const [showInvite, setShowInvite] = useState(false);
  const [pastMeetings, setPastMeetings] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.id;

  useEffect(() => {
    const fetchPastMeetings = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/meeting/past/${userId}`);
        const data = await res.json();
        setPastMeetings(data);
      } catch (err) {
        console.error("Failed to fetch past meetings", err);
      }
    };

    if (userId) {
      fetchPastMeetings();
    }
  }, [userId]);

  const handleCreateMeeting = async () => {
    const roomName = 'room-' + uuidv4().slice(0, 6);

    try {
      const res = await fetch(`${BACKEND_URL}/api/meeting/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName, createdBy: userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setNewRoomName(data.roomName);
        setShowInvite(true);
      } else {
        alert('Failed to create meeting: ' + data.error);
      }
    } catch (err) {
      alert('Error creating meeting');
      console.error("details:", err);
    }
  };

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
        body: JSON.stringify({ emails: emailList, roomName: newRoomName }),
      });

      const data = await res.json();
      if (res.ok) {
        alert('Invitations sent!');
        setEmails('');
        setShowInvite(false);
        navigate(`/room/${newRoomName}`);
      } else {
        alert('Failed to send invites: ' + data.error);
      }
    } catch (err) {
      alert('Error sending invitations');
      console.error(err);
    }
  };

  const handleJoinMeeting = () => {
    if (!joinRoomName.trim()) return alert('Please enter room name');
    navigate(`/room/${joinRoomName}`);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded space-y-6">
      <h1 className="text-2xl font-bold">Meeting Options</h1>

      {/* Create new */}
      <div className="space-y-2">
        <button
          onClick={handleCreateMeeting}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          ➕ Create New Meeting
        </button>
      </div>

      {/* Invite section */}
      {showInvite && (
        <div className="space-y-3 border-t pt-4">
          <p>
            Invite participants to: <span className="font-semibold">{newRoomName}</span>
          </p>
          <input
            type="text"
            placeholder="Enter emails separated by commas"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSendInvites}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              📧 Send Invites
            </button>
            <button
              onClick={() => navigate(`/room/${newRoomName}`)}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              🚪 Join Meeting Now
            </button>
          </div>
          <button
            onClick={() => navigate(`/room/${newRoomName}`)}
            className="text-sm text-gray-600 hover:underline mt-1"
          >
            Skip invites and enter meeting →
          </button>
        </div>
      )}

      <hr className="my-4" />

      {/* Join existing */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Enter Room Name or Code"
          value={joinRoomName}
          onChange={(e) => setJoinRoomName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={handleJoinMeeting}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          🔗 Join Meeting
        </button>
      </div>

      {/* Past meetings */}
      {pastMeetings.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">📅 Past Meetings</h2>
          <ul className="space-y-2">
            {pastMeetings.map((meeting) => (
              <li key={meeting._id} className="text-gray-700 text-sm">
                <span className="font-medium">
                  {meeting.role === "creator" ? "🛠️ Created" : "👥 Joined"}
                </span>{" "}
                • <span className="text-blue-700">{meeting.roomName}</span> •{" "}
                {new Date(meeting.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MeetingOptions;
