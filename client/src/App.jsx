import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';
import Login from './pages/Login';
import SignUp from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MeetingOptions from './pages/MeetingOptions';
import EventCalendar from './pages/EventCalendar';
import EventList from './pages/EventList';
import PrivateRoute from './components/PrivateRoute';
import './App.css';

function PageNotFound() {
  return (
    <div className="h-screen flex items-center justify-center text-3xl text-red-600">
      404! Page Not Found
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/signup' element={<SignUp />} />

      {/* ✅ Protected Dashboard */}
      <Route path='/dashboard' element={
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      } />

      {/* ✅ NEW: Meeting options page (create or join) */}
      <Route path='/meeting' element={
        <PrivateRoute>
          <MeetingOptions />
        </PrivateRoute>
      } />

      {/* ✅ Secure room route with dynamic roomId */}
      <Route path='/room/:roomId' element={
        <PrivateRoute>
          <Room />
        </PrivateRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<PageNotFound />} />
      <Route path="/calendar" element={<EventCalendar />} />
      <Route path="/events" element={<EventList />} />
    </Routes>
  );
}

export default App;
