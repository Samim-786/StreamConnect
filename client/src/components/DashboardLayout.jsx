import { Link, useNavigate } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 text-white flex flex-col justify-between p-6">
        <div>
          <h2 className="text-2xl font-bold mb-8">StreamConnect</h2>
          <p className="mb-6">Welcome, {user?.name || "User"} 👋</p>
          <nav className="space-y-4">
  <Link to="/meeting" className="block hover:underline">➕ Create Meeting</Link>
  <Link to="/stream/start" className="block hover:underline">📺 Start Live Streaming</Link>
    <Link to="/calendar" className="block hover:underline"> 📅 Event&nbsp;Calendar</Link>
    <Link to="/events" className="block hover:underline">📋 My Events (List)</Link>

     </nav>

        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          🚪 Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
