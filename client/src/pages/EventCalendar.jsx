import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useNavigate } from 'react-router-dom';

export default function EventCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // form fields
  const [title, setTitle]         = useState('');
  const [time, setTime]           = useState('');
  const [description, setDesc]    = useState('');
  const [participants, setParts]  = useState('');

  // events already on the calendar
  const [events, setEvents]       = useState([]);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  /* ────────────────────────────────────
     Load existing upcoming events
  ──────────────────────────────────── */
   useEffect(() => {
    if (!user) return;
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events/upcoming/${user.id}`);
        const data = await res.json();
        setEvents(data);                 // store raw events
      } catch (err) {
        console.error('Failed to load events', err);
      }
    };
    fetchEvents();
  }, [user]);

  /* ────────────────────────────────────
     Helpers
  ──────────────────────────────────── */
  const resetForm = () => {
    setShowForm(false);
    setTitle('');
    setTime('');
    setDesc('');
    setParts('');
    setSelectedDate(null);
  };

  const handleDateClick = (date) => {
    const today = new Date(); today.setHours(0,0,0,0);
    if (date < today) return alert('Cannot schedule in the past');
    setSelectedDate(date);
    setShowForm(true);
  };

  /* ────────────────────────────────────
     Submit new Event
  ──────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !time || !selectedDate) return alert('Fill all * fields');
    if (!/^\d{2}:\d{2}$/.test(time))     return alert('Time HH:MM');

    const [hours, minutes] = time.split(':').map(Number);
const localDateTime = new Date(selectedDate);
localDateTime.setHours(hours);
localDateTime.setMinutes(minutes);
localDateTime.setSeconds(0);

const isoDateTime = localDateTime.toISOString(); 

    const payload = {
      title,
      description,
      scheduledTime: isoDateTime,
      createdBy: user.id,
      participants: participants
        .split(',')
        .map((e) => e.trim())
        .filter(Boolean),
    };

   try {
      const res  = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/events`, {   // ← updated
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) return alert('Error: ' + data.error);

      alert('Event created!');
      setEvents((prev) => [...prev, data.event]);
      resetForm();
    } catch (err) {
      console.error(err);
      alert('Server error');
    }
  };
  /* ────────────────────────────────────
     Calendar tile helpers
  ──────────────────────────────────── */
  const tileClassName = ({ date }) => {
    const hasEvent = events.some(ev => (
      new Date(ev.scheduledTime).toDateString() === date.toDateString()
    ));
    return hasEvent ? 'bg-blue-100 cursor-pointer' : '';
  };

  const tileContent = ({ date }) => {
    const todaysEvents = events.filter(
      ev => new Date(ev.scheduledTime).toDateString() === date.toDateString()
    );
    if (!todaysEvents.length) return null;
    return (
      <ul className="text-[10px] list-disc pl-3">
        {todaysEvents.slice(0,3).map(ev => (
          <li key={ev._id}>{ev.title.slice(0,10)}…</li>
        ))}
        {todaysEvents.length > 3 && <li>+{todaysEvents.length-3} more</li>}
      </ul>
    );
  };

  /* ────────────────────────────────────
     JSX
  ──────────────────────────────────── */
  return (
    <div className="max-w-5xl mx-auto mt-8 grid md:grid-cols-2 gap-6 p-4">
      {/* Calendar */}
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold mb-2">📅 Select a Date</h2>
        <Calendar
          onClickDay={handleDateClick}
          tileDisabled={({ date }) => {
            const today = new Date(); today.setHours(0,0,0,0);
            return date < today;
          }}
          tileClassName={tileClassName}
          tileContent={tileContent}
        />
      </div>

      {/* Event creation form */}
      {showForm && (
        <div className="bg-white shadow rounded p-8">
          <h2 className="text-xl font-bold mb-4">📌 Schedule Event</h2>
          <form onSubmit={handleSubmit} className="space-y-3">
            <p><strong>Date:</strong> {selectedDate.toDateString()}</p>

            <div>
              <label className="block text-sm font-medium">Time*</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Title*</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDesc(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Participant Emails (comma separated)
              </label>
              <input
                type="text"
                value={participants}
                onChange={(e) => setParts(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              📅 Schedule Event
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
