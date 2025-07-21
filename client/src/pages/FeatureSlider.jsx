import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import slide1 from '../assets/create-join.png';
import slide2 from '../assets/invite.png';
import slide3 from '../assets/video-call.png';

export default function FeatureSlider() {
  return (
    <section className="py-16 bg-white px-4 shadow-2xl">
     <h3 className="text-2xl font-semibold text-blue-700 mb-2">HD Video Conferencing</h3>

      <Carousel
        showThumbs={false}
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={true}
        interval={6000}
        swipeable
        emulateTouch
      >
        <div className="text-center">
          <img src={slide1} alt="Create or Join Meeting" className="mx-auto rounded shadow max-h-[500px] object-contain" />
          <p className="legend text-sm text-gray-700 mt-4">
            Create a new meeting, join using room code, and view your past meeting history easily.
          </p>
        </div>

        <div className="text-center">
          <img src={slide2} alt="Invite Participants" className="mx-auto rounded shadow max-h-[500px] object-contain" />
          <p className="legend text-sm text-gray-700 mt-4">
            Invite participants via email when creating a meeting, or skip and invite later during the meeting.
          </p>
        </div>

        <div className="text-center">
          <img src={slide3} alt="Live Meeting Features" className="mx-auto rounded shadow max-h-[500px] object-contain" />
          <p className="legend text-sm text-gray-700 mt-4">
            Interact in real time: chat, share screen, toggle mic/camera, and manage participants smoothly.
          </p>
        </div>
      </Carousel>
    </section>
  );
}
