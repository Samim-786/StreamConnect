import { useEffect, useState } from 'react';

const EventList = () => {
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return;

    const fetchEvents = async () => {
      try {
        const [upcomingRes, pastRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/events/upcoming/${user.id}`),
          fetch(`${API_BASE_URL}/api/events/past/${user.id}`),
        ]);

        const upcomingData = await upcomingRes.json();
        const pastData = await pastRes.json();

        setUpcoming(upcomingData);
        setPast(pastData);
      } catch (err) {
        console.error("Error loading events", err);
      }
    };

    fetchEvents();
  }, [API_BASE_URL]);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">📅 My Events</h1>

      {/* Upcoming */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">🟢 Upcoming Events</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming events.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map(event => (
              <li key={event._id} className="border p-3 rounded shadow">
                <strong>{event.title || 'Untitled Event'}</strong>
                <div className="text-sm text-gray-600">
                  Scheduled at: {new Date(event.scheduledTime).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Past */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📜 Past Events</h2>
        {past.length === 0 ? (
          <p className="text-gray-500">No past events.</p>
        ) : (
          <ul className="space-y-2">
            {past.map(event => (
              <li key={event._id} className="border p-3 rounded shadow">
                <strong>{event.title || 'Untitled Event'}</strong>
                <div className="text-sm text-gray-600">
                  Held on: {new Date(event.scheduledTime).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default EventList;
