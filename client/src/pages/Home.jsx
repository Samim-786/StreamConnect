import { useState } from 'react';
import { Link } from 'react-router-dom';
//import videoCallImg from '../assets/video_call.png';
//import livestreamImg from '../assets/livestream.png';

import FeatureSlider from './FeatureSlider';
import EventSlider from './EventSlider';




//import aiSummaryImg from '../assets/ai_summary.png';

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);

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
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 text-center text-blue-700">Sign Up</h2>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
              Create Account
            </button>
            <p className="text-center text-sm mt-4">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log in
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Feature Sections */}
      <div className="flex-grow bg-gray-50 py-20 px-6">
        <div className="max-w-6xl mx-auto grid gap-16 md:grid-cols-2">

          {/* Feature 1: Video Calls */}
          <div className="flex flex-col items-center text-center">
            {/* <img src={videoCallImg} alt="Video Call" className="w-64 mb-6" /> */}
            {/* <h3 className="text-2xl font-semibold text-blue-700 mb-2">HD Video Conferencing</h3>
            <p className="text-gray-600">
              Experience high-quality, low-latency video calls for teams, creators, and professionals.
            </p> */}
            <FeatureSlider />
          </div>

          {/* Feature 2: Livestreaming */}
          <div className="flex flex-col items-center text-center">
            {/* <img src={livestreamImg} alt="Livestream" className="w-64 mb-6" /> */}
            <h3 className="text-2xl font-semibold text-indigo-700 mb-2">Live Streaming</h3>
            <p className="text-gray-600">
              Go live anytime with your audience using livekit integration and seamless controls.
            </p>
          </div>

          {/* Feature 3: Event Scheduling */}
          <div className="flex flex-col items-center text-center">
            {/* <img src={calendarImg} alt="Event Scheduling" className="w-64 mb-6" />
            <h3 className="text-2xl font-semibold text-green-700 mb-2">Event Scheduling</h3>
            <p className="text-gray-600">
              Schedule meetings, send invites, and track upcoming events with our smart calendar tools.
            </p> */}
            <EventSlider/>
          </div>

          {/* Feature 4: AI Summary */}
          <div className="flex flex-col items-center text-center">
            {/* <img src={aiSummaryImg} alt="AI Summary" className="w-64 mb-6" /> */}
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
        <div className='flex-col space-x-3.5'>
        <Link >About</Link>
        <Link>Contact Us</Link>
        <Link>Privacy</Link>

        </div>
      </footer>
    </div>
  );
}
