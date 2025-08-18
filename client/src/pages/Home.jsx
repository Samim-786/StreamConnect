import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import FeatureSlider from './FeatureSlider';
import EventSlider from './EventSlider';

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`,
    formData,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );


      if (response.status === 201) {
        alert('Signup successful! Please login.');
        navigate('/login');
      }
    } catch (err) {
      console.error('Signup error:', err);
      setError(
        err.response?.data?.message || 
        'Signup failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-6 text-center">
        <h1 className="text-5xl font-bold mb-4 animate-slide-up">Welcome to StreamConnect</h1>
        <p className="text-xl max-w-2xl mx-auto animate-fade-in">
          HD Video Meetings • Seamless Livestreams • Smart Scheduling • AI-Powered Summaries
        </p>
        {!showSignup && (
          <button
            onClick={() => setShowSignup(true)}
            className="mt-8 bg-white cursor-pointer text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Get Started
          </button>
        )}
      </div>

      {/* Signup Box */}
      {showSignup && (
        <div className="px-6 mt-10 max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Sign Up</h2>
            
            {error && (
              <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <input
              name="name"
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
              minLength="6"
              className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <p className="text-center text-sm mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </form>
        </div>
      )}

      {/* Feature Sections */}
      <div className="flex-grow bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid gap-16 md:grid-cols-2">
          {/* Feature 1: Video Calls */}
          <div className="flex flex-col items-center text-center">
            <FeatureSlider />
          </div>

          {/* Feature 2: Livestreaming */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold text-indigo-700 mb-2">Live Streaming</h3>
            <p className="text-gray-600">
              Go live anytime with your audience using livekit integration and seamless controls.
            </p>
          </div>

          {/* Feature 3: Event Scheduling */}
          <div className="flex flex-col items-center text-center">
            <EventSlider/>
          </div>

          {/* Feature 4: AI Summary */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold text-purple-700 mb-2">AI Meeting Summaries</h3>
            <p className="text-gray-600">
              Let AI generate and email concise summaries of your meetings to all participants.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center">
        <p>&copy; {new Date().getFullYear()} StreamConnect. All rights reserved.</p>
        <div className="flex justify-center space-x-6 mt-2">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact Us</Link>
          <Link to="/privacy" className="hover:underline">Privacy</Link>
        </div>
      </footer>
    </div>
  );
}